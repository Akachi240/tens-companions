import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProfileProvider } from "@/context/ProfileContext";
import AppLayout from "@/components/AppLayout";
import Index from "./pages/Index";
import SessionSetup from "./pages/SessionSetup";
import ActiveSession from "./pages/ActiveSession";
import Education from "./pages/Education";
import Dashboard from "./pages/Dashboard";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ProfileProvider>
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/session-setup" element={<SessionSetup />} />
              <Route path="/active-session" element={<ActiveSession />} />
              <Route path="/education" element={<Education />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </ProfileProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
