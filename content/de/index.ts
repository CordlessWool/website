import { collections } from "$embodi/collections?locale=de&only=offer";
import type { LoadAction } from "embodi";

export const load: LoadAction = ({ data }) => {
  const offers = collections.map((offer) => ({
    ...offer.data,
    html: offer.html,
  }));
  return { ...data, offers };
};
