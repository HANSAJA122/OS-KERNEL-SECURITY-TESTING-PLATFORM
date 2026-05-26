"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import TestingModules from "@/components/TestingModules";
import Dashboard from "@/components/Dashboard";
import ReportTable from "@/components/ReportTable";
import ActivityTimeline from "@/components/ActivityTimeline";
import RealVsSimulated from "@/components/RealVsSimulated";
import LearningGuide from "@/components/LearningGuide";
import Footer from "@/components/Footer";

export default function Home() {
  const [reportData, setReportData] = useState(null);

  const handleTestComplete = (data) => {
    // Stores the complete report payload (supporting both simulated array and live agent object)
    setReportData(data);
  };

  return (
    <main className="flex-1">
      <Navbar />
      <Hero />
      <About />
      <TestingModules />
      <Dashboard onTestComplete={handleTestComplete} />
      <ReportTable reportData={reportData} />
      <ActivityTimeline reportData={reportData} />
      <RealVsSimulated />
      <LearningGuide />
      <Footer />
    </main>
  );
}
