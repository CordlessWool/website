import { collections } from "$embodi/collections?locale=en&only=project";
import type { LoadAction } from "embodi";

function getFirstParagraph(html: string): string {
  const firstParagraph = html.split("<hr>")[0];
  return firstParagraph;
}

function hasFirstParagraph(html: string): boolean {
  return html.split("<hr>").length > 1;
}

export const load: LoadAction = ({ data }) => {
  const projects = collections
    .map((project) => {
      return {
        ...project.data,
        url: project.url,
        html: getFirstParagraph(project.html),
        showPageLink: hasFirstParagraph(project.html),
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return { ...data, projects };
};
