import { collections } from "$embodi/collections?locale=en&only=blog";

export const load = ({ data }) => {
  const posts = collections
    .filter((post) => post.data.published != null)
    .map((posts) => {
      return {
        title: posts.data.title,
        description: posts.data.description,
        url: posts.url,
        published: posts.data.published,
        category: posts.data.category,
        updated: posts.data.updated,
        tags: posts.data.tags.filter((tag) => tag !== "blog"),
      };
    });
  return { ...data, posts };
};
