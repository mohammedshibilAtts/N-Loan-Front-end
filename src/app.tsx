import "./global.css";

import { Router } from "./routes/sections";

import { useScrollToTop } from "./hooks/use-scroll-to-top";

import { ThemeProvider } from "./theme/theme-provider";

import { Toaster } from "sonner";

import "./global.css";

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
 

  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "custom-toast",
          descriptionClassName: "custom-description",
        }}
      />

      <Router />
    </ThemeProvider>
  );
}
