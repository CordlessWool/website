import { collections } from "$embodi/collections?locale=de&tag=project";

export const load = ({ data }) => {
  const projects = collections.map((project) => {
    return {
      ...project.data,
      html: project.html,
    };
  });
  return { ...data, projects };
};
