import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import Onboarding, { useOnboarding } from "./components/Onboarding";
import { AMapProvider } from "@/contexts/AMapContext";

const queryClient = new QueryClient();

const AppContent = () => {
  const { done, complete } = useOnboarding();

  if (!done) {
    return <Onboarding onComplete={complete} />;
  }

  return (
    <>
      <Toaster />
      <HashRouter>
        <Routes>
          {navItems.map(({ to, page }) => (
            <Route key={to} path={to} element={page} />
          ))}
        </Routes>
      </HashRouter>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AMapProvider>
        <AppContent />
      </AMapProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
