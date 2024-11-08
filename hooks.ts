import { init, changeLanguage } from "i18next";
import type { RenderHook } from "embodi";

export const render: RenderHook = ({ data }) => {
  init({
    fallbackLng: "en",
    debug: false,
    resources: {
      de: {
        translation: {
          about: "Intro",
          skills: "Fähigkeiten",
          projects: "Projekte",
          since: "seit",
          tools: "Werkzeuge",
          languages: "Sprachen",
          frameworks: "Frameworks",
          databases: "Datenbanken",
          roles: "Rollen",
          other: "Sonstiges",
          developing: "Entwicklung",
          degree: "Abschluss",
          name: "Name",
          years: "Jahre",
          occupation: "Tätigkeit",
          location: "Standort",
          experience: "Erfahrung",
          imprint: "Impressum",
          developing_experience: "Entwicklungserfahrung",
          current_tech: "Aktuell bevorzugte Technologien",
          link_to: "Link zu",
          freelancermap_title:
            "Profil von Wolfgang Rathgeb auf www.freelancermap.de",
        },
      },
      en: {
        translation: {
          about: "Intro",
          skills: "Skills",
          projects: "Projects",
          since: "since",
          tools: "Tools",
          languages: "Languages",
          frameworks: "Frameworks",
          databases: "Databases",
          roles: "Roles",
          other: "Other",
          developing: "Developing",
          degree: "Degree",
          name: "Name",
          years: "years",
          occupation: "Occupation",
          location: "Location",
          experience: "Experience",
          imprint: "Imprint",
          developing_experience: "Developing experience",
          current_tech: "Currently preferred technologies",
          link_to: "Link to",
          freelancermap_title:
            "Profile of Wolfgang Rathgeb on www.freelancermap.de",
        },
      },
    },
  });

  changeLanguage(data.locale);
};
