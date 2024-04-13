// .eleventy.js
import i18n from 'eleventy-plugin-i18n';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

const translations ={
	"about": {
		"de-DE": "Intro",
		"en-GB": "Intro"
	},
	"skills": {
		"de-DE": "Fähigkeiten",
		"en-GB": "Skills"
	},
	"projects": {
		"de-DE": "Projekte",
		"en-GB": "Projects"
	},
	"since": {
		"de-DE": "seit",
		"en-GB": "since"
	},
	"tools": {
		"de-DE": "Werkzeuge",
		"en-GB": "Tools"
	},
	"languages": {
		"de-DE": "Sprachen",
		"en-GB": "Languages"
	},
	"frameworks": {
		"de-DE": "Frameworks",
		"en-GB": "Frameworks"
	}
}


export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(i18n, {
    translations,
    fallbackLocales: {
      '*': 'en-GB'
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
		pathPrefix: "/website/",
    markdownTemplateEngine: 'njk'
  };
};