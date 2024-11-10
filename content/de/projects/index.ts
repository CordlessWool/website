import { collections } from "$embodi/collections?locale=de&tag=project";
import type { LoadAction } from "embodi";

export const load: LoadAction = ({ data }) => {
  const projects = collections.map((project) => {
    return {
      ...project.data,
      html: project.html,
    };
  });
  return { ...data, projects };
};
