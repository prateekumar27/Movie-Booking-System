import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SeatContextProvider } from "./context/SeatContext.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <LocationProvider>
        <AuthContextProvider>
          <SeatContextProvider>
            <App />
          </SeatContextProvider>
        </AuthContextProvider>
      </LocationProvider>
    </QueryClientProvider>
  </BrowserRouter>,
);
