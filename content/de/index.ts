import { collections } from "$embodi/collections?locale=de&only=offer";
import { collections as radarchartsCollection } from "$embodi/collections?locale=de&only=radarchart";

import type { LoadAction } from "embodi";

export const load: LoadAction = ({ data }) => {
  const offers = collections.map((offer) => ({
    ...offer.data,
    html: offer.html,
  }));
  const radarcharts = radarchartsCollection.map((r) => ({
    ...r.data,
    html: r.html,
  }));

  return { ...data, offers, radarcharts };
};
