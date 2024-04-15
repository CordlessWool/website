// .eleventy.js
import i18n from 'eleventy-plugin-i18n';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

const translations ={
	"about": {
		"de": "Intro",
		"en": "Intro"
	},
	"skills": {
		"de": "Fähigkeiten",
		"en": "Skills"
	},
	"projects": {
		"de": "Projekte",
		"en": "Projects"
	},
	"since": {
		"de": "seit",
		"en": "since"
	},
	"tools": {
		"de": "Werkzeuge",
		"en": "Tools"
	},
	"languages": {
		"de": "Sprachen",
		"en": "Languages"
	},
	"frameworks": {
		"de": "Frameworks",
		"en": "Frameworks"
	},
	"databases": {
		"de": "Datenbanken",
		"en": "Databases"
	},
	"impressum": {
		"de": "Impressum",
		"en": "Imprint"
	},
}


export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en'
    }
  });

	eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
	eleventyConfig.addPassthroughCopy("src/assets");

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// which file extensions to process
		extensions: "html",

		// Add any other Image utility options here:

		// optional, output image formats
		formats: ["webp", "jpeg"],
		// formats: ["auto"],

		// optional, output image widths
		// widths: ["auto"],

		// optional, attributes assigned on <img> override these values.
		defaultAttributes: {
			loading: "lazy",
			decoding: "async",
		},
	});

  // Configuration
  return {
    dir: {
      input: 'src'
    },
    markdownTemplateEngine: 'njk'
  };
};