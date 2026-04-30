import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import FormPage from "./pages/FormPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import { PasscodeGate } from "./components/PasscodeGate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PasscodeGate>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/new" element={<FormPage />} />
            <Route path="/edit/:id" element={<FormPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PasscodeGate>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
