import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/tailwind.css";
import "./styles/simplebar.css";
import "./styles/datepicker.css";

import { Provider } from "react-redux";
import { store } from "./stores/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
