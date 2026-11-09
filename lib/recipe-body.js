// Reads the Markdown below a recipe's front matter: the steps, the tips and the extra sections.
//
//   1. Skär potatisen i tärningar.      A numbered list is the steps, shown under "Gör så här".
//   ### Vattenkokare                    Starts a titled group of steps (optional).
//   **Har du ingen gröt över?** Koka…   A paragraph that starts in bold is a tip, shown after the steps.
//   ## Dekoration och servering         An extra section after the steps, with a bulleted list:
//   - Strö krasse runt tornet.
//
// Each step and list item is a single paragraph. Bold, italics, links and inline code work inside it.
// Anything else stops the build with a message, so nothing is silently left off the page.

import fs from 'node:fs';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

// `html` goes into the page; `text` is the same without markup, for the recipe's structured data.
function inline(token) {
  return {html: md.renderer.renderInline(token.children, md.options, {}), text: plainText(token.children)};
}

function plainText(tokens) {
  return tokens.map(token => {
    if (['text', 'text_special', 'code_inline'].includes(token.type)) return token.content;
    if (token.type === 'softbreak' || token.type === 'hardbreak') return ' ';
    if (token.type === 'image') return plainText(token.children ?? []);
    return '';
  }).join('');
}

const startsBold = token => token.children.find(child => child.type !== 'text' || child.content)?.type === 'strong_open';

export function parseRecipeBody(source, file) {
  const tokens = md.parse(source, {});

  const fail = (token, message) => {
    // token.map counts lines from the end of the front matter; report the line in the file.
    let where = file;
    if (token?.map) {
      let offset = 0;
      try {
        const whole = fs.readFileSync(file, 'utf8');
        if (whole.endsWith(source)) offset = whole.slice(0, whole.length - source.length).split('\n').length - 1;
      } catch {}
      where += `:${token.map[0] + 1 + offset}`;
    }
    throw new Error(`${where}: ${message}`);
  };

  // A list's items, each a single paragraph. Returns the items and the index after the list.
  const listItems = start => {
    const close = tokens[start].type.replace(/_open$/, '_close');
    const items = [];
    let i = start + 1;
    while (tokens[i].type !== close) {
      const [item, paragraph, content, paragraphEnd, itemEnd] = tokens.slice(i, i + 5);
      if (item.type !== 'list_item_open' || paragraph?.type !== 'paragraph_open' || content?.type !== 'inline'
        || paragraphEnd?.type !== 'paragraph_close' || itemEnd?.type !== 'list_item_close') {
        fail(item, 'Each list item must be a single paragraph, without a list or anything else inside it.');
      }
      items.push(inline(content));
      i += 5;
    }
    return [items, i + 1];
  };

  const directionSections = [{title: undefined, steps: []}];
  const directionNotes = [];
  const extraSections = [];
  let extra = null; // the ## section being read, once the first one has started

  let i = 0;
  while (i < tokens.length) {
    const token = tokens[i];
    const next = tokens[i + 1];

    if (token.type === 'heading_open' && token.tag === 'h2') {
      extra = {title: plainText(next.children), items: []};
      extraSections.push(extra);
      i += 3;
    } else if (token.type === 'heading_open' && token.tag === 'h3' && !extra) {
      const title = plainText(next.children);
      const current = directionSections.at(-1);
      if (current.steps.length || current.title) directionSections.push({title, steps: []});
      else current.title = title;
      i += 3;
    } else if (token.type === 'ordered_list_open' && !extra) {
      const [steps, after] = listItems(i);
      directionSections.at(-1).steps.push(...steps);
      i = after;
    } else if (token.type === 'bullet_list_open' && extra) {
      const [items, after] = listItems(i);
      extra.items.push(...items);
      i = after;
    } else if (token.type === 'paragraph_open' && !extra && startsBold(next)) {
      // markdown-it puts an empty text token before the opening bold.
      const children = next.children.filter(child => child.type !== 'text' || child.content);
      const end = children.findIndex(child => child.type === 'strong_close');
      const rest = children.slice(end + 1);
      directionNotes.push({
        title: plainText(children.slice(1, end)),
        html: md.renderer.renderInline(rest, md.options, {}).trimStart(),
        text: plainText(rest).trimStart()
      });
      i += 3;
    } else {
      const expected = extra
        ? `Under "## ${extra.title}" only a bulleted list (- …) can follow.`
        : 'Before the first ## heading only numbered steps (1. …), ### step group titles and tips (**Title** text) can follow.';
      fail(token, `Unexpected ${token.type.replace(/_open$/, '').replace(/_/g, ' ')}. ${expected}`);
    }
  }

  if (!directionSections.some(section => section.steps.length)) fail(null, 'The recipe has no steps (a numbered list).');
  const empty = extraSections.find(section => !section.items.length);
  if (empty) fail(null, `"## ${empty.title}" needs a bulleted list.`);
  const emptyGroup = directionSections.find(section => !section.steps.length);
  if (emptyGroup) fail(null, `"### ${emptyGroup.title}" has no steps.`);

  return {directionSections, directionNotes, extraSections};
}
