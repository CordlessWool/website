import { collections } from "$embodi/collections?locale=en&only=project";

function getFirstParagraph(html: string): string {
  const firstParagraph = html.split("<hr>")[0];
  return firstParagraph;
}

function hasFirstParagraph(html: string): boolean {
  return html.split("<hr>").length > 1;
}

export const load: LoadAction = ({ data }) => {
  const projects = collections.map((project) => {
    return {
      ...project.data,
      url: project.url,
      html: getFirstParagraph(project.html),
      showPageLink: hasFirstParagraph(project.html),
    };
  });
  return { ...data, projects };
};
