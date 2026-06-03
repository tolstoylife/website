// Eleventy
import { EleventyRenderPlugin } from '@11ty/eleventy';
import rss from '@11ty/eleventy-plugin-rss';
import syntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import webc from '@11ty/eleventy-plugin-webc';
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

// obsidian-style wikilinks — parse-level resolution + pre-computed backlinks,
// no render-pipeline re-entry (scales to the full vault). Replaces interlinker.
import wikilinks from './plugins/wikilinks/index.js';

// custom
import { markdownLib } from './plugins/markdown.js';
import { drafts } from './plugins/drafts.js';

// Custom transforms
import { htmlConfig } from './plugins/html-config.js';

export default {
  EleventyRenderPlugin,
  rss,
  syntaxHighlight,
  webc,
  eleventyImageTransformPlugin,
  markdownLib,
  drafts,
  htmlConfig,
  wikilinks
};