// SITE SETTINGS
// Edit the values below, keeping the quotes around text values.
// After editing: run `npm run build`, then upload the contents of _site/.

// Public website address. Used for the sitemap, canonical links and share images.
const url = "https://oftabraefter.se";

// Site name: the header, footer, page-title suffix and sharing previews.
const name = "Ofta bra efter";

// Home-page title and description. Other pages can provide their own title and description.
const title = `${name} — Rädda resterna.`;
const description = `Middag av det du redan har. Skriv in vad som finns i kylen och få receptförslag ur receptarkivet på ${name}.`;

// Page language and the locale used in sharing previews.
const language = "sv";
const locale = "sv_SE";

// Default sharing image: a path relative to src/, or a full HTTPS image URL.
// Recipe pages use their own photo. Replace this image and its alt text together.
const socialImage = {
  path: "assets/social-card.png",
  alt: `${name} – Middag av det du redan har, med en illustrerad skål ramen.`,
};

// Contact email shown under "Frågor" on the privacy page. Empty = hidden.
const contact = "johanna@oftabraefter.se";

// Optional social profiles: add one object per profile to show links in the footer.
// Use full HTTPS URLs. Leave the list empty until you have profiles to link to.
const socialLinks = [
  // { label: "Instagram", url: "https://www.instagram.com/YOUR_USERNAME/" },
];

export default {
  url,
  name,
  title,
  description,
  language,
  locale,
  socialImage,
  contact,
  socialLinks,
  // A full URL for a path in the site, or null while `url` is empty.
  absolute: (path) =>
    url ? new URL(path, url.replace(/\/?$/, "/")).href : null,
};
