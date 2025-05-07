import { setContext, getContext } from "svelte";
import { writable, type Writable } from "svelte/store";

const id = Symbol("timeline-context");

export type TimeContext = {
  filter: Writable<string[]>;
};

export const initTimeContext = () => {
  const filter = writable([]);
  setContext(id, {
    filter,
  });
};

export const getTimeContext = (): TimeContext => getContext(id);
