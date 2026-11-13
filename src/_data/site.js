// The site's public address, e.g. 'https://oftabraefter.se'. When set, recipe pages get canonical
// links and share images with full URLs, and sitemap.xml is written.
const url = '';

// An address visitors can write to about their account or their data, shown on integritet.html
// ("Frågor"). While it's empty the page has no such line; set it before the site takes sign-ups.
const contact = '';

export default {
  url,
  contact,
  // A full URL for a path in the site, or null while `url` is empty.
  absolute: path => url ? new URL(path, url.replace(/\/?$/, '/')).href : null
};
