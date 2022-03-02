import { createContext, useEffect, useState } from "react";
import { parseCookies } from "nookies";

const Context = createContext({});

export function SessionContextProvider({ children }) {
  const [token, setToken] = useState(undefined);

  return (
    <Context.Provider value={{ token, setToken }}>{children}</Context.Provider>
  );
}
export default Context;
