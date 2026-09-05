import {useContext} from "react";

import {HomeContentContext} from "./home-content-context.js";

export function useHomeContent() {
  const value = useContext(HomeContentContext);
  if (!value) {
    throw new Error("useHomeContent must be used inside HomeContentProvider");
  }
  return value;
}
