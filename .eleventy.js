// .eleventy.js
import i18n from 'eleventy-plugin-i18n';
import * as path from 'node:path';
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
	"roles": {
		"de": "Rollen",
		"en": "Roles"
	},
	"other": {
		"de": "Sonstiges",
		"en": "Other"
	},
	'developing': {
		"de": "Entwicklung",
		"en": "Developing"
	},
	'degree': {
		"de": "Abschluss",
		"en": "Degree"
	},
	'name': {
		"de": "Name",
		"en": "Name"
	},
	'years': {
		"de": "Jahre",
		"en": "years"
	},
	'occupation': {
		"de": "Tätigkeit",
		"en": "Occupation"
	},
	'location': {
		"de": "Standort",
		"en": "Location"
	},
	'experience': {
		"de": "Erfahrung",
		"en": "Experience"
	},
	"imprint": {
		"de": "Impressum",
		"en": "Imprint"
	},
	"developing_experience": {
		"de": "Entwicklungserfahrung",
		"en": "Developing experience"
	},
	"current_tech": {
		"de": "Aktuell bevorzugte Technologien",
		"en": "Currently preferred technologies"
	},
	"link_to": {
		"de": "Link zu",
		"en": "Link to"
	},
	"freelancermap_title": {
		"de": "Profil von Wolfgang Rathgeb auf www.freelancermap.de",
		"en": "Profile of Wolfgang Rathgeb on www.freelancermap.de"
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
	eleventyConfig.addPassthroughCopy({ "src/images/favicon.ico": "/" });


	eleventyConfig.addFilter("age", (date) => {
		const now = new Date();
		const birthDate = new Date(date);
		const diff = now - birthDate;
		const ageDate = new Date(diff);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	})

	eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
		// which file extensions to process
		extensions: "html",

		// Add any other Image utility options here:

		// optional, output image formats
		formats: ["webp", "jpeg"],
		// formats: ["auto"],

		// optional, output image widths
		widths: [300, 700, 1300],

		// optional, attributes assigned on <img> override these values.
		defaultAttributes: {
			loading: "lazy",
			decoding: "async",
		},

		filenameFormat: (id, src, width, format) => {
			const extension = path.extname(src);
			const name = path.basename(src, extension);

			return `${name}-${id}${width}.${format}`;
		},

		sizes: "100vw",
	});

  // Configuration
  return {
    dir: {
      input: 'src'
    },
    markdownTemplateEngine: 'njk'
  };
};