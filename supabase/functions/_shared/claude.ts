// Calls Claude through the Messages API and returns its answer as JSON matching `schema`
// (structured outputs: https://platform.claude.com/docs/en/build-with-claude/structured-outputs).
import {env} from './http.ts';

// Sonnet reads fridge photos well and writes good Swedish. CLAUDE_MODEL changes it without a deploy;
// Haiku is cheaper and worth trying for the photos (CLAUDE_DETECT_MODEL).
export const models = {
  detect: () => Deno.env.get('CLAUDE_DETECT_MODEL') || Deno.env.get('CLAUDE_MODEL') || 'claude-sonnet-5-5',
  recipe: () => Deno.env.get('CLAUDE_RECIPE_MODEL') || Deno.env.get('CLAUDE_MODEL') || 'claude-sonnet-5-5'
};

type Content =
  | {type: 'text'; text: string}
  | {type: 'image'; source: {type: 'base64'; media_type: 'image/jpeg'; data: string}};

export interface ClaudeRequest {
  model: string;
  // The fixed instructions. Sent with cache_control, so repeated requests read it from the prompt cache.
  system: string;
  content: Content[];
  schema: Record<string, unknown>;
  maxTokens: number;
}

export async function askClaude<T>({model, system, content, schema, maxTokens}: ClaudeRequest): Promise<T> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      system: [{type: 'text', text: system, cache_control: {type: 'ephemeral'}}],
      messages: [{role: 'user', content}],
      output_config: {format: {type: 'json_schema', schema}}
    })
  });
  if (!response.ok) throw new Error(`Claude answered ${response.status}: ${await response.text()}`);
  const message = await response.json();
  if (message.stop_reason === 'max_tokens') throw new Error(`Claude ran out of tokens (max_tokens ${maxTokens}).`);
  if (message.stop_reason === 'refusal') throw new Error('Claude declined the request.');
  const text = message.content?.find((block: {type: string}) => block.type === 'text')?.text;
  if (typeof text !== 'string') throw new Error('Claude sent no text.');
  return JSON.parse(text) as T;
}
