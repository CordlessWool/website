import { collections } from "$embodi/collections?locale=en&only=blog";

export const load = ({ data }) => {
  const posts = collections.map((posts) => {
    return {
      ...project.data,
      html: project.html,
    };
  });
  return { ...data, posts };
};
