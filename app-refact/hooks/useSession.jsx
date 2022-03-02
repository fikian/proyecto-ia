import { useContext, useEffect } from "react";
import Context from "../context/sessionContext";
import { parseCookies, setCookie, destroyCookie } from "nookies";

export default function useSession() {
  const { token, setToken } = useContext(Context);

  useEffect(() => {
    const { token } = parseCookies();
    if (token) {
      setToken(token);
    }
  }, []);

  const login = async ({ sesion }) => {
    try {
      const result = await fetch("http://localhost:3000/api/user", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({ sesion }),
      }).then((res) => res.json());
      console.log("usesesion", result);
      if (result.token !== "") {
        setCookie(null, "token", result.token, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        setToken(result);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log("Error:" + error);
    }
  };

  const logOut = () => {
    try {
      destroyCookie(null, "token");
      setToken(null);
    } catch (error) {
      console.log("Error:" + error);
    }
  };

  return {
    isLogged: Boolean(token),
    login,
    logOut,
  };
}
