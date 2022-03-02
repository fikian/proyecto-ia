import "../styles/globals.css";
import { SessionContextProvider } from "../context/sessionContext";

function MyApp({ Component, pageProps }) {
  return (
    <SessionContextProvider>
      <Component {...pageProps} />
      <div id="modal-container" />
    </SessionContextProvider>
  );
}

export default MyApp;
