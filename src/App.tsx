import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import LoginPage from "@/pages/LoginPage";
import DonorRegistration from "@/pages/DonorRegistration";
import BloodRequestPage from "@/pages/BloodRequestPage";
import DonorListPage from "@/pages/DonorListPage";
import MapViewPage from "@/pages/MapViewPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useApp();

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/donors" replace />} />
        <Route path="/donors" element={<DonorListPage />} />
        <Route path="/register" element={<DonorRegistration />} />
        <Route path="/request" element={<BloodRequestPage />} />
        <Route path="/map" element={<MapViewPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
