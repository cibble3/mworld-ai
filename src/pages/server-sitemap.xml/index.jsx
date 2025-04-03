export const getServerSideProps = async (ctx) => {
  const fields = [
    {
      loc: "https://mistressworld.com/",
    },
    {
      loc: "https://mistressworld.com/girls",
    },
    {
      loc: "https://mistressworld.com/girls/asian",
    },
    {
      loc: "https://mistressworld.com/girls/ebony",
    },
    {
      loc: "https://mistressworld.com/girls/latina",
    },
    {
      loc: "https://mistressworld.com/girls/teen",
    },
    {
      loc: "https://mistressworld.com/girls/milf",
    },
    {
      loc: "https://mistressworld.com/girls/blonde",
    },
    {
      loc: "https://mistressworld.com/girls/brunette",
    },
    {
      loc: "https://mistressworld.com/girls/bigtits",
    },
    {
      loc: "https://mistressworld.com/girls/bbw",
    },
    {
      loc: "https://mistressworld.com/girls/squirt",
    },
    {
      loc: "https://mistressworld.com/girls/lesbian",
    },
    {
      loc: "https://mistressworld.com/girls/couple",
    },
    {
      loc: "https://mistressworld.com/trans",
    },
    {
      loc: "https://mistressworld.com/trans/asian",
    },
    {
      loc: "https://mistressworld.com/trans/ebony",
    },
    {
      loc: "https://mistressworld.com/trans/latina",
    },
    {
      loc: "https://mistressworld.com/trans/teen",
    },
    {
      loc: "https://mistressworld.com/trans/milf",
    },
    {
      loc: "https://mistressworld.com/trans/bigtits",
    },
    {
      loc: "https://mistressworld.com/trans/bbw",
    },
    {
      loc: "https://mistressworld.com/trans/athletic",
    },
    {
      loc: "https://mistressworld.com/trans/blonde",
    },
    {
      loc: "https://mistressworld.com/trans/brunette",
    },
    {
      loc: "https://mistressworld.com/trans/bigcock",
    },
  ];

  const sitemapXml = generateSitemapXml(fields);

  ctx.res.setHeader("Content-Type", "text/xml");
  ctx.res.write(sitemapXml);
  ctx.res.end();

  return {
    props: {},
  };
};

function generateSitemapXml(fields) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpenTag =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetCloseTag = "</urlset>";

  const urlElements = fields
    .map(
      (field) => `
      <url>
        <loc>${field.loc}</loc>
        <lastmod>${new Date().toDateString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>1</priority>
      </url>
    `
    )
    .join("");

  return `${xmlHeader}${urlsetOpenTag}${urlElements}${urlsetCloseTag}`;
}

// Default export to prevent next.js errors
export default function Sitemap() {}
