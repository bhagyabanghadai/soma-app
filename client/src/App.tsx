import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import SoilHealth from "@/pages/SoilHealth";
import WaterUsage from "@/pages/WaterUsage";
import RegenerativePractices from "@/pages/RegenerativePractices";
import CarbonCredit from "@/pages/CarbonCredit";
import SustainabilityReport from "@/pages/SustainabilityReport";
import AIAssistant from "@/pages/AIAssistant";
import EarthData from "@/pages/EarthData";
import Weather from "@/pages/Weather";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/soil-health" component={SoilHealth} />
        <Route path="/water-usage" component={WaterUsage} />
        <Route path="/practices" component={RegenerativePractices} />
        <Route path="/carbon-credits" component={CarbonCredit} />
        <Route path="/reports" component={SustainabilityReport} />
        <Route path="/ai-assistant" component={AIAssistant} />
        <Route path="/earth-data" component={EarthData} />
        <Route path="/weather" component={Weather} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
