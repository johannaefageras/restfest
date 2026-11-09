// The site's public address, e.g. 'https://restfest.se'. When set, recipe pages get canonical
// links and share images with full URLs, and sitemap.xml is written.
const url = '';

export default {
  url,
  // A full URL for a path in the site, or null while `url` is empty.
  absolute: path => url ? new URL(path, url.replace(/\/?$/, '/')).href : null
};
