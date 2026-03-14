import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { loadAMap } from "@/lib/amapLoader";

const key = import.meta.env.VITE_AMAP_KEY;
const root = ReactDOM.createRoot(document.getElementById("root"));

if (key) {
  loadAMap(key, { plugins: ["AMap.Geocoder"] })
    .then(() => root.render(<App />))
    .catch(() => root.render(<App />));
} else {
  root.render(<App />);
}
