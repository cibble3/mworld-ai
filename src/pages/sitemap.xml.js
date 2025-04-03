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

    {
      loc: "https://mistressworld.com/free",
    },
    {
      loc: "https://mistressworld.com/free/girls/asian",
    },
    {
      loc: "https://mistressworld.com/free/girls/ebony",
    },
    {
      loc: "https://mistressworld.com/free/girls/latina",
    },
    {
      loc: "https://mistressworld.com/free/girls/teen",
    },
    {
      loc: "https://mistressworld.com/free/girls/milf",
    },
    {
      loc: "https://mistressworld.com/free/girls/blonde",
    },
    {
      loc: "https://mistressworld.com/free/girls/brunette",
    },
    {
      loc: "https://mistressworld.com/free/girls/bigtits",
    },
    {
      loc: "https://mistressworld.com/free/girls/bbw",
    },
    {
      loc: "https://mistressworld.com/free/girls/squirt",
    },
    {
      loc: "https://mistressworld.com/free/girls/lesbian",
    },
    {
      loc: "https://mistressworld.com/free/girls/couple",
    },
    {
      loc: "https://mistressworld.com/free/girls/bigboobs",
    },
    {
      loc: "https://mistressworld.com/free/girls/smallboobs",
    },
    {
      loc: "https://mistressworld.com/free/girls/fetish",
    },
    {
      loc: "https://mistressworld.com/free/girls/anal",
    },
    {
      loc: "https://mistressworld.com/free/girls/redhead",
    },
    {
      loc: "https://mistressworld.com/free/girls/fuckmachine",
    },
    {
      loc: "https://mistressworld.com/free/girls/feet",
    },
    {
      loc: "https://mistressworld.com/free/girls/lovense",
    },
    {
      loc: "https://mistressworld.com/free/girls/lush",
    },
    {
      loc: "https://mistressworld.com/free/girls/ohmibod",
    },
    {
      loc: "https://mistressworld.com/free/girls/squit",
    },
    {
      loc: "https://mistressworld.com/free/girls/tattoos",
    },

    {
      loc: "https://mistressworld.com/free/trans/asian",
    },
    {
      loc: "https://mistressworld.com/free/trans/ebony",
    },
    {
      loc: "https://mistressworld.com/free/trans/latina",
    },
    {
      loc: "https://mistressworld.com/free/trans/teen",
    },
    {
      loc: "https://mistressworld.com/free/trans/milf",
    },
    {
      loc: "https://mistressworld.com/free/trans/blonde",
    },
    {
      loc: "https://mistressworld.com/free/trans/brunette",
    },
    {
      loc: "https://mistressworld.com/free/trans/bigtits",
    },
    {
      loc: "https://mistressworld.com/free/trans/bbw",
    },
    {
      loc: "https://mistressworld.com/free/trans/squirt",
    },
    {
      loc: "https://mistressworld.com/free/trans/lesbian",
    },
    {
      loc: "https://mistressworld.com/free/trans/couple",
    },
    {
      loc: "https://mistressworld.com/free/trans/bigboobs",
    },
    {
      loc: "https://mistressworld.com/free/trans/smallboobs",
    },
    {
      loc: "https://mistressworld.com/free/trans/fetish",
    },
    {
      loc: "https://mistressworld.com/free/trans/anal",
    },
    {
      loc: "https://mistressworld.com/free/trans/redhead",
    },
    {
      loc: "https://mistressworld.com/free/trans/fuckmachine",
    },
    {
      loc: "https://mistressworld.com/free/trans/feet",
    },
    {
      loc: "https://mistressworld.com/free/trans/lovense",
    },
    {
      loc: "https://mistressworld.com/free/trans/lush",
    },
    {
      loc: "https://mistressworld.com/free/trans/ohmibod",
    },
    {
      loc: "https://mistressworld.com/free/trans/squit",
    },
    {
      loc: "https://mistressworld.com/free/trans/tattoos",
    },
    {
      loc: "https://mistressworld.com/free/trans/bigcock",
    },
    {
      loc: "https://mistressworld.com/free/trans/selfsuck",
    },
    {
      loc: "https://mistressworld.com/free/trans/dildo",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Girls",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/shemale",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Foot",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/BBW",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/MILF",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/MILF",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Latina",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/cock",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Asian",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Erotic",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Male",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Article",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Male",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Dominatrix",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Lesbian",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/fetish",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Ebony",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Pro",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/BDSM",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/tattooed",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Muslim",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/categories/Mistress",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/10-naughty-tasty-cam-babes-to-drool-over-online",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-hung-latina-trans-babes-with-bodies-worth-exploring",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/10-live-foot-fetish-girls-to-worship-online",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-anal-shemale-cam-models-that-love-to-fuck-their-ass-like-its-1999",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-anal-shemale-cam-models-that-love-to-fuck-their-ass-like-its-1999",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-of-the-worlds-sexiest-curvy-hd-cam-girls-bbw-webcams-online",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/100s-of-big-booty-shemale-cam-babes-online-24-7",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-big-booty-shemales-that-love-to-make-it-bounce-and-twerk",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/3-hairy-cam-babes-pussies-for-all-you-bush-lovers-out-there",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/5-mature-tgirl-webcam-babes-who-love-to-sex-chat-cam2cam",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-sexy-live-mature-cam-models-who-brings-these-milfs-to-live-orgasm-is-undecided",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/we-got-99-problems-but-a-lack-of-brunette-ts-babes-aint-one",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/live-latina-transsexuals-are-some-of-the-hottest-trans-girls-in-the-world",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mistressworld-big-cock-shemales-for-the-discerning-hung-tranny-cam-lover",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mistressworlds-live-shemale-cams-transsexual-webcam-performers",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/enjoy-live-asian-ladyboys-shemale-cam-models-from-asia",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotw-infernalangel-smack-my-ass-and-call-me-mistress",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/our-5-reasons-milf-mature-sexcams-is-your-favorite-cam-sex-category",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/7-bbw-cam-models-bringing-you-plus-sized-satisfaction",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/feetgoddesss-bring-the-pain-mistress-tale-of-the-day-mtotd",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/top-live-asian-shemale-cam-babes-of-2015",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/watch-live-sex-cam-babes-like-aniytta-fuck-sex-toys-on-cam",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/male-cam-boy-mileskepler-is-taking-the-web-by-storm",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-things-your-bae-has-fantasized-about-that-she-hasnt-told-you",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/5-good-reasons-why-people-love-to-submit-online-to-live-dominatrix-cams",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/5-reasons-why-live-cam-sex-is-the-way-forward",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/why-join-mistressworlds-exclusive-vip-xxx-cam-rooms",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/shemale-cam-babe-of-the-week-prettyrosie4u",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/lesbian-webcam-babes-of-the-week-1california1",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/watch-brigittets-play-with-her-8-inch-fat-cock-today",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/watch-fetish-cam-babe-wildslutty4u-play-with-her-100s-of-sex-toys-now",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/hot-21-yeah-old-webcam-mistress-jordanmistres-loves-bdsm-toys-your-cock",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/busty-bbw-ebony-babe-bustyebonyx1",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/100s-of-live-tranny-cam-models-on-misterss-world",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/6-awesome-webcam-sex-categories-that-makes-it-worth-while-getting-up-in-the-morning",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/brianatopts-dominant-tranny-cam-girl-with-huge-cock",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/3-reasons-to-make-tranny-cams-your-new-favorite-pastime",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/5-things-to-remember-when-scoping-out-a-pro-domme",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotw-roxanaxrated-lonely-and-bored",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/nicolaj-coster-waldau-gets-his-ass-spanked-by-kate-upton-in-bdsm-scene-cut-from-the-other-woman",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/not-hot-for-teacher-former-psu-student-sues-for-12m-after-professor-obsesses-over-her-bdsm-past",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-diannaartt-dirty-dianna",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/fifty-shades-of-grey-sm-parody-sequel-spank-harder-a-huge-hit",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/how-to-be-a-good-submissive-a-quick-guide-for-d-s-newbies",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-misssophieee-one-badass-bitch",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/5-common-misconceptions-about-bdsm-that-are-completely-bogus",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-natashaotil-the-spy-that-loved-sm",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-dirtycat69-curiosity-never-killed-this-cat",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/whoa-katy-perry-madonna-team-up-for-a-hot-sm-photoshoot-for-v-magazine",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/10-tasty-tattooed-cam-babes-to-drool-over-online",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/5-sexy-muslim-cam-models-too-hot-for-tv-2",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-studentwhore-class-is-in-session-1",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-xslavemistress-naughty-noir-nights",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-controlabletoy-a-quiet-night-inside",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/mtotd-missdamaris1-happy-birthday",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/live-face-sitting-adventure-with-mistressgiadevon",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/my-private-cam-session-with-leximoon",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/top-5-blonde-cam-models-of-2019",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/10-fun-facts-about-big-tits",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/7-kinky-asian-fetish-cam-performers",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/top-9-sexy-ebony-cam-models-of-august-2018",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/7-teen-latina-cam-models-that-are-sure-to-grab-your-attention",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/5-top-milf-cam-models-of-march-2021",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/ts-parris-first-live-performance-nov-28-11am",
    },
    {
      loc: "https://www.mistressworld.xxx/blog/sex-and-sushi-8-asian-teens-that-will-have-you-craving-more",
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
