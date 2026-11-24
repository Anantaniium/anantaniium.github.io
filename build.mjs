import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (file) => fs.readFileSync(path.join(here, file), 'utf8');
const config = JSON.parse(read('site.config.json'));
const template = read('index.template.html');
const siteUrl = config.siteUrl.replace(/\/$/, '');
const canonical = `${siteUrl}/`;
const absolute = (value) => value ? (value.startsWith('http') ? value : `${siteUrl}${value.startsWith('/') ? '' : '/'}${value}`) : '';
const escapeHtml = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const escapeXml = (value = '') => escapeHtml(value).replace(/&#39;/g, '&apos;');

const profiles = [
  ['LinkedIn', config.socials.linkedin],
  ['GitHub', config.socials.github],
  ['YouTube', config.socials.youtube],
  ['Instagram', config.socials.instagram],
  ['ORCID', config.socials.orcid],
  ['Google Scholar', config.socials.googleScholar]
].filter(([, url]) => Boolean(url && url.trim()));

const socialLinks = profiles.map(([label, url]) => `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(label)}</span><span aria-hidden="true">↗</span></a>`).join('\n');
const cvAction = config.cvPdf
  ? `<a class="button button--outline-light button--small" href="${escapeHtml(config.cvPdf)}" target="_blank" rel="noopener noreferrer">Download CV <span aria-hidden="true">↓</span></a>`
  : '';

const org = (name, url) => ({ '@type': 'Organization', name, url });
const sameAs = Object.values(config.socials).filter(Boolean);
const media = [
  { name: 'Careers360', url: config.links.careers360 },
  { name: 'DU Beat', url: config.links.duBeat },
  { name: 'Organiser', url: config.links.organiser }
].filter(item => item.url);

const person = {
  '@type': 'Person',
  '@id': `${canonical}#anant-singh`,
  name: 'Anant Singh',
  jobTitle: 'Vice President & Outreach and Advocacy Manager, International Association of Physics Students',
  url: canonical,
  description: config.description,
  email: config.email,
  affiliation: [
    org('Université Paris Cité', 'https://u-paris.fr/'),
    org('International Association of Physics Students', 'https://iaps.info/'),
    org('International Union of Pure and Applied Physics', 'https://iupap.org/'),
    org('Indian Network of Physics Students', config.links.inps)
  ],
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'University of Delhi', url: 'https://www.du.ac.in/' },
    { '@type': 'CollegeOrUniversity', name: 'Rajdhani College, University of Delhi', url: 'https://rajdhani.du.ac.in/' }
  ],
  memberOf: [
    org('International Association of Physics Students', 'https://iaps.info/'),
    org('International Union of Pure and Applied Physics', 'https://iupap.org/')
  ],
  hasCredential: [
    { '@type': 'EducationalOccupationalCredential', name: 'Caltech Summer Undergraduate Research Fellowship (SURF), 2023', credentialCategory: 'Research fellowship', recognizedBy: org('California Institute of Technology', 'https://www.caltech.edu/') }
  ],
  award: 'SMARTS-UP Scholarship',
  hasOccupation: [
    { '@type': 'Occupation', name: 'Master’s student in Physics' },
    { '@type': 'Occupation', name: 'Astrophysics researcher' },
    { '@type': 'Occupation', name: 'Science communicator' }
  ],
  knowsAbout: [
    'Astrophysics', 'Observational cosmology', 'Multi-messenger astronomy', 'High-energy astrophysics',
    'Fast Radio Bursts', 'FRB scintillation', 'Gamma-ray astronomy', 'LHAASO', 'CHIME/FRB',
    'Transient astronomy', 'Dark energy', 'Cosmological parameter estimation', 'Type Ia supernovae',
    'Atmospheric physics', 'Satellite engineering', 'Physics education research', 'Science education',
    'STEM education', 'Science communication', 'Public engagement with science', 'Science outreach',
    'Educational access', 'Student research opportunities', 'Science diplomacy', 'Science policy',
    'International scientific cooperation', 'International student representation', 'Academic collaboration'
  ],
  sameAs,
  founderOf: { '@id': `${canonical}#anantaniium` },
  subjectOf: media.map(item => ({ '@type': 'NewsArticle', name: item.name, url: item.url })),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Professional correspondence',
    email: config.email
  }
};
if (config.portraitImage) person.image = absolute(config.portraitImage);
if (config.socials.orcid) person.identifier = { '@type': 'PropertyValue', name: 'ORCID', value: config.socials.orcid };

const graph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${canonical}#website`,
      url: canonical,
      name: config.siteName,
      description: config.description,
      publisher: { '@id': `${canonical}#anant-singh` },
      inLanguage: 'en'
    },
    person,
    {
      '@type': 'Organization',
      '@id': `${canonical}#anantaniium`,
      name: 'Anantaniium',
      description: 'A science-communication platform exploring physics, mathematics, game theory and history through educational content.',
      url: config.socials.instagram || config.socials.youtube || canonical,
      sameAs: [config.socials.instagram, config.socials.youtube].filter(Boolean),
      founder: { '@id': `${canonical}#anant-singh` }
    }
  ]
};

const replacements = {
  '{{SITE_TITLE}}': escapeHtml(config.siteTitle),
  '{{DESCRIPTION}}': escapeHtml(config.description),
  '{{CANONICAL_URL}}': escapeHtml(canonical),
  '{{OG_IMAGE}}': escapeHtml(absolute(config.ogImage)),
  '{{JSON_LD}}': JSON.stringify(graph, null, 2).replace(/</g, '\\u003c'),
  '{{LOCATION}}': escapeHtml(config.location),
  '{{PORTRAIT_CONTENT}}': config.portraitImage ? `<img class="portrait-photo" src="${escapeHtml(config.portraitImage)}" alt="${escapeHtml(config.portraitAlt || 'Portrait of Anant Singh')}" fetchpriority="high">` : '',
  '{{EMAIL}}': escapeHtml(config.email),
  '{{PRESS_BIO}}': escapeHtml(config.pressBio),
  '{{SOCIAL_LINKS}}': socialLinks,
  '{{CV_ACTION}}': cvAction,
  '{{IAPS_URL}}': escapeHtml(config.links.iapsExecutiveCommittee),
  '{{IUPAP_URL}}': escapeHtml(config.links.iupapAc5),
  '{{IUPAP_C14_URL}}': escapeHtml(config.links.iupapC14 || 'https://iupap.org/'),
  '{{INPS_URL}}': escapeHtml(config.links.inps),
  '{{CAREERS360_URL}}': escapeHtml(config.links.careers360),
  '{{DUBEAT_URL}}': escapeHtml(config.links.duBeat),
  '{{ORGANISER_URL}}': escapeHtml(config.links.organiser),
  '{{AHISSA_URL}}': escapeHtml(config.links.ahissa),
  '{{YOUTUBE_URL}}': escapeHtml(config.socials.youtube || '#'),
  '{{INSTAGRAM_URL}}': escapeHtml(config.socials.instagram || '#')
};
let html = template;
for (const [token, value] of Object.entries(replacements)) html = html.replaceAll(token, value);
if (config.portraitImage) html = html.replace('class="portrait-frame"', 'class="portrait-frame portrait-frame--has-image"');
fs.writeFileSync(path.join(here, 'index.html'), html);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${escapeXml(canonical)}</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`;
fs.writeFileSync(path.join(here, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(here, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${canonical}sitemap.xml\n`);

const llms = `# ${config.siteName}\n\n> ${config.description}\n\nCanonical website: ${canonical}\nContact: ${config.email}\nLocation: ${config.location}\n\n## Profile\nAnant Singh is a Master's student in Physics at Université Paris Cité, an astrophysics researcher, Vice President and Outreach and Advocacy Manager of the International Association of Physics Students (IAPS), and Founder and Chairperson of the Governing Council of the Indian Network of Physics Students (INPS).\n\n## Sections\n- About: ${canonical}#about\n- Research and academic work: ${canonical}#research\n- Physics education, outreach and public engagement: ${canonical}#practice\n- Institutional leadership and international cooperation: ${canonical}#leadership\n- Media, speaking and press: ${canonical}#press\n- Ventures and science communication: ${canonical}#initiatives\n- Contact: ${canonical}#contact\n\n## Research areas\nObservational cosmology; multi-messenger astrophysics; high-energy astrophysics; Fast Radio Bursts; gamma-ray astronomy; atmospheric physics; satellite engineering; physics education research; science communication; science outreach; science diplomacy; science policy; international scientific cooperation.\n\n## Organisations and profiles\n- IAPS executive committee: ${config.links.iapsExecutiveCommittee}\n- IUPAP AC5: ${config.links.iupapAc5}\n- INPS: ${config.links.inps}\n${profiles.map(([label, url]) => `- ${label}: ${url}`).join('\n')}\n\n## Media\n${media.map(item => `- ${item.name}: ${item.url}`).join('\n')}\n\nThe page is the authoritative source for current role descriptions and biographical details. For future appointments or publications, consult the linked institutional and publication records.\n`;
fs.writeFileSync(path.join(here, 'llms.txt'), llms);
console.log('Built index.html, sitemap.xml, robots.txt and llms.txt from site.config.json');
console.log(`Canonical URL: ${canonical}`);
console.log(`Social profiles included: ${profiles.map(([name]) => name).join(', ') || 'none'}`);
