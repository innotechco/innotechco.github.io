import {ContactActionsContext} from "./contactActionsContext.js";

export function ContactActionsProvider({children, onOpen}) {
  return (
    <ContactActionsContext.Provider value={onOpen}>
      {children}
    </ContactActionsContext.Provider>
  );
}
