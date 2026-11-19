// Search metadata follows the same site settings and back links as the visible pages.
// Recipe JSON-LD is generated separately in recipes.js and keeps its original dish photo.
export function pageStructuredData(path, site, title, parent, noindex = false) {
  if (noindex || !site.url) return null;

  const url = site.absolute(path);
  const home = site.absolute('/');
  const data = path === '/'
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${home}#website`,
        url: home,
        name: site.name,
        description: site.description,
        inLanguage: site.language
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${url}#breadcrumb`,
        itemListElement: [
          { name: site.name, item: home },
          ...(parent?.path ? [{
            name: parent.label.replace(/^Till /, ''),
            item: site.absolute(parent.path)
          }] : []),
          { name: title || site.name, item: url }
        ].map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          ...item
        }))
      };

  // A title containing an HTML closing tag must remain text inside the JSON script.
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
