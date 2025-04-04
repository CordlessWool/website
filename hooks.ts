import { setLocale } from "./__layout/lib/paraglide/runtime.js";

import type { RenderHook } from "embodi";

export const render: RenderHook = ({ data }) => {
  setLocale(data.locale);
};
