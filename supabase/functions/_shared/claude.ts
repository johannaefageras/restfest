// Calls Claude through the Messages API and returns its answer as JSON matching `schema`
// (structured outputs: https://platform.claude.com/docs/en/build-with-claude/structured-outputs).
import {env} from './http.ts';

// Sonnet reads fridge photos well and writes good Swedish. CLAUDE_MODEL changes it without a deploy;
// Haiku is cheaper and worth trying for the photos (CLAUDE_DETECT_MODEL).
export const models = {
  detect: () => Deno.env.get('CLAUDE_DETECT_MODEL') || Deno.env.get('CLAUDE_MODEL') || 'claude-sonnet-5-5',
  recipe: () => Deno.env.get('CLAUDE_RECIPE_MODEL') || Deno.env.get('CLAUDE_MODEL') || 'claude-sonnet-5-5'
};

// How much Claude thinks before it answers. Left out, Sonnet 5.5 runs at "high", which is slower and
// spends more of max_tokens on thinking than a fridge inventory or a dinner recipe needs. Secrets change
// it without a deploy, like the models above: CLAUDE_DETECT_EFFORT or CLAUDE_RECIPE_EFFORT for one,
// CLAUDE_EFFORT for both. A value that isn't a level is skipped. The model has to be one that takes an
// effort (the Claude 5 models do; Haiku 4.5 answers 400).
const effortLevels = ['low', 'medium', 'high', 'xhigh', 'max'] as const;
export type Effort = typeof effortLevels[number];
function effort(secret: string, fallback: Effort): Effort {
  for (const name of [secret, 'CLAUDE_EFFORT']) {
    const value = Deno.env.get(name)?.trim().toLowerCase() as Effort | undefined;
    if (value && effortLevels.includes(value)) return value;
  }
  return fallback;
}
export const efforts = {
  detect: () => effort('CLAUDE_DETECT_EFFORT', 'medium'),
  recipe: () => effort('CLAUDE_RECIPE_EFFORT', 'medium')
};

// Thinking counts towards max_tokens, so the limit leaves room for it. It is a ceiling, not a cost:
// only the tokens Claude writes are paid for.
const maxTokens = 16000;

type Content =
  | {type: 'text'; text: string}
  | {type: 'image'; source: {type: 'base64'; media_type: 'image/jpeg'; data: string}};

export interface ClaudeRequest {
  // Names the request in the usage log: 'detect' or 'recipe'.
  label: string;
  model: string;
  effort: Effort;
  // The fixed instructions. Sent with cache_control, so repeated requests read it from the prompt cache.
  system: string;
  content: Content[];
  schema: Record<string, unknown>;
}

// Claude gave no answer: the API was busy or unreachable, also on a second try, or turned the request
// down. Nothing was made or paid for, so the functions give the visitor's try back (refundCap in limits.ts).
export class ClaudeUnavailable extends Error {}

// Worth one more try: timeouts, rate limits and trouble on Anthropic's side.
const retryable = (status: number) => status === 408 || status === 409 || status === 429 || status >= 500;

// Before the second try: as long as the API asks for (retry-after, in seconds), at most five seconds.
function pause(response: Response | null): Promise<void> {
  const asked = Number(response?.headers.get('retry-after'));
  const seconds = response?.headers.has('retry-after') && Number.isFinite(asked) ? Math.min(Math.max(asked, 0), 5) : 1;
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

export async function askClaude<T>({label, model, effort, system, content, schema}: ClaudeRequest): Promise<T> {
  const started = Date.now();
  // Sonnet 5.5 can decline a request it reads as unsafe. With a fallback the API tries a declined
  // request on another model within the same call (it covers some kinds of decline, not all).
  // https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback
  const fallback = model.startsWith('claude-sonnet-5-5');
  const send = () => fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      ...(fallback && {'anthropic-beta': 'server-side-fallback-2026-07-01'})
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: [{type: 'text', text: system, cache_control: {type: 'ephemeral'}}],
      messages: [{role: 'user', content}],
      output_config: {effort, format: {type: 'json_schema', schema}},
      ...(fallback && {fallbacks: 'default'})
    })
  });

  let response: Response | null = null;
  let problem = '';
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      response = await send();
      if (response.ok) break;
      problem = `Claude answered ${response.status}: ${await response.text()}`;
      if (!retryable(response.status)) break;
    } catch (error) {
      response = null;
      problem = `Claude could not be reached: ${error instanceof Error ? error.message : error}`;
    }
    if (attempt === 1) await pause(response);
  }
  if (!response?.ok) throw new ClaudeUnavailable(problem);

  const message = await response.json();
  // One line per answer in the function's log: what it used, and whether the instructions came from
  // the prompt cache (cache_read) or were written to it (cache_write).
  console.log(JSON.stringify({
    claude: label,
    model: message.model ?? model,
    stop: message.stop_reason,
    seconds: Math.round((Date.now() - started) / 100) / 10,
    input: message.usage?.input_tokens,
    cache_write: message.usage?.cache_creation_input_tokens,
    cache_read: message.usage?.cache_read_input_tokens,
    output: message.usage?.output_tokens
  }));
  if (message.stop_reason === 'max_tokens') throw new Error(`Claude ran out of tokens (max_tokens ${maxTokens}).`);
  if (message.stop_reason === 'refusal') throw new Error('Claude declined the request.');
  const text = message.content?.find((block: {type: string}) => block.type === 'text')?.text;
  if (typeof text !== 'string') throw new Error('Claude sent no text.');
  return JSON.parse(text) as T;
}
