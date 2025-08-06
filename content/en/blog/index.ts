import { collections } from "$embodi/collections?locale=en&only=blog";

export const load = ({ data }) => {
  const posts = collections
    .filter((post) => post.data.published != null)
    .sort((a, b) => b.data.published - a.data.published)
    .map((posts) => {
      return {
        title: posts.data.title,
        description: posts.data.description,
        url: posts.url,
        published: new Date(posts.data.published),
        category: posts.data.category,
        updated: posts.data.updated,
        tags: posts.data.tags.filter((tag) => tag !== "blog"),
      };
    })
    .sort((a, b) => b.published.getTime() - a.published.getTime());
  return { ...data, posts };
};
