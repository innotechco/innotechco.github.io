import {useContext} from "react";
import {ContactActionsContext} from "./contactActionsContext";

export function useContactAction() {
  const openContact = useContext(ContactActionsContext);

  if (!openContact) {
    throw new Error("useContactAction must be used inside ContactActionsProvider");
  }

  return openContact;
}
