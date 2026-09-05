import {useContext} from "react";
import {ContactActionsContext} from "./contactActionsContext.js";

export function useContactAction() {
  const openContact = useContext(ContactActionsContext);

  if (!openContact) {
    throw new Error("useContactAction must be used inside ContactActionsProvider");
  }

  return openContact;
}
