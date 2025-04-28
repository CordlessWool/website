import { createWriteStream } from "fs";
import { SitemapStream, streamToPromise } from "sitemap";
import { globby } from "globby";
import { join as joinPath } from "node:path";

const hostname = "https://dropanote.de";
const distDir = "./dist/static";

const getLanguageAndPath = (file) => {
  const relPath = file.replace("index.html", "");
  const segments = relPath.split("/").filter(Boolean);
  const lang = ["de", "en"].includes(segments[0]) ? segments[0] : null;
  const path = "/" + segments.join("/") + "/";
  return { lang, path };
};

async function generate() {
  const files = await globby(["**/index.html"], { cwd: distDir });
  const urlsMap = new Map();

  for (const file of files) {
    const { lang, path } = getLanguageAndPath(file);
    if (!lang) continue;

    const pathKey = path.replace(/^\/(de|en)/, "");
    if (!urlsMap.has(pathKey)) urlsMap.set(pathKey, []);
    const urls = urlsMap.get(pathKey) ?? [];
    urls.push({ lang, url: path });
    urlsMap.set(pathKey, urls);
  }

  const sitemap = new SitemapStream({ hostname });
  const writeStream = createWriteStream(joinPath(distDir, "sitemap.xml"));

  sitemap.pipe(writeStream);

  for (const [_, langUrls] of urlsMap) {
    // deutsche URL als default
    const primary = langUrls.find((l) => l.lang === "de") || langUrls[0];
    sitemap.write({
      url: primary.url,
      links: langUrls.map(({ lang, url }) => ({ lang, url })),
    });
  }

  sitemap.end();
  await streamToPromise(sitemap);
  console.log("✅ sitemap.xml erstellt mit hreflang");
}

generate().catch(console.error);
