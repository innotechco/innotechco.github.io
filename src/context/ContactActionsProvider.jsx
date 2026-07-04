import {ContactActionsContext} from "./contactActionsContext";

export function ContactActionsProvider({children, onOpen}) {
  return (
    <ContactActionsContext.Provider value={onOpen}>
      {children}
    </ContactActionsContext.Provider>
  );
}
