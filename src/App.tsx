import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import UploadPage from "./pages/UploadPage";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";
import DepartmentsPage from "./pages/DepartmentsPage";
import ContractsPage from "./pages/ContractsPage";
import RequirementsPage from "./pages/RequirementsPage";
import RegulationsPage from "./pages/RegulationsPage";
import MessagesPage from "./pages/MessagesPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import PayrollPage from "./pages/PayrollPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/contracts" element={<ContractsPage />} />
          <Route path="/requirements" element={<RequirementsPage />} />
          <Route path="/regulations" element={<RegulationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
