import { setLanguageTag } from "./__layout/lib/paraglide/runtime.js";

import type { RenderHook } from "embodi";

export const render: RenderHook = ({ data }) => {
  setLanguageTag(data.locale);
};
