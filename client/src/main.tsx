import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Set the document title
document.title = "DirectoryBuilder";

// Add favicon
const link = document.createElement('link');
link.rel = 'icon';
link.href = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yIDZhMiAyIDAgMDEyLTJoNGwyIDJoNGEyIDIgMCAwMTIgMnY4YTIgMiAwIDAxLTIgMkg0YTIgMiAwIDAxLTItMlY2eiIgY2xpcC1ydWxlPSJldmVub2RkIiAvPjwvc3ZnPg==';
document.head.appendChild(link);

// Add meta description for SEO
const metaDescription = document.createElement('meta');
metaDescription.name = 'description';
metaDescription.content = 'DirectoryBuilder - A professional tool to generate standardized folder structures for VFX, Motion, Editor, and CG Artists.';
document.head.appendChild(metaDescription);

createRoot(document.getElementById("root")!).render(<App />);
