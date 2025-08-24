import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Homepage from "@/pages/Homepage";
import Dashboard from "@/pages/Dashboard";
import SustainabilityDashboard from "@/pages/SustainabilityDashboard";
import ChatWidget from "@/components/ChatWidget";
import SoilHealth from "@/pages/SoilHealth";
import WaterUsage from "@/pages/WaterUsage";
import RegenerativePractices from "@/pages/RegenerativePractices";
import CarbonCredit from "@/pages/CarbonCredit";
import SustainabilityReport from "@/pages/SustainabilityReport";
import LoginRequired from "@/components/LoginRequired";

import EarthData from "@/pages/EarthData";
import Weather from "@/pages/Weather";
import AirQuality from "@/pages/AirQuality";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Signup from "@/pages/Signup";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Homepage} />
        <Route path="/dashboard" component={() => (
          <ProtectedRoute feature="Dashboard">
            <SustainabilityDashboard />
          </ProtectedRoute>
        )} />
        <Route path="/old-dashboard" component={Dashboard} />
        <Route path="/home" component={Home} />
        <Route path="/soil-health" component={() => (
          <ProtectedRoute feature="Soil Health Monitoring">
            <SoilHealth />
          </ProtectedRoute>
        )} />
        <Route path="/water-usage" component={() => (
          <ProtectedRoute feature="Water Usage Analytics">
            <WaterUsage />
          </ProtectedRoute>
        )} />
        <Route path="/practices" component={() => (
          <ProtectedRoute feature="Regenerative Practices">
            <RegenerativePractices />
          </ProtectedRoute>
        )} />
        <Route path="/carbon-credits" component={() => (
          <ProtectedRoute feature="Carbon Credit Tracking">
            <CarbonCredit />
          </ProtectedRoute>
        )} />
        <Route path="/reports" component={() => (
          <ProtectedRoute feature="Sustainability Reports">
            <SustainabilityReport />
          </ProtectedRoute>
        )} />

        <Route path="/earth-data" component={EarthData} />
        <Route path="/weather" component={Weather} />
        <Route path="/air-quality" component={AirQuality} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route component={NotFound} />
      </Switch>
      
      {/* Global Chat Widget - Available on all pages */}
      <ChatWidget />
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
