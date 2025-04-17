import { collections } from "$embodi/collections?locale=de&only=blog";

export const load = ({ data }) => {
  console.log({ collections: collections[0].data });
  const posts = collections.map((posts) => {
    return {
      title: posts.data.title,
      description: posts.data.description,
      url: posts.url,
      published: posts.data.published,
      updated: posts.data.updated,
    };
  });
  return { ...data, posts };
};
