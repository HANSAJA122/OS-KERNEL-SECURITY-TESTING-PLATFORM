import { NextResponse } from 'next/server';

const AGENT_URL = 'http://localhost:3001/api/agent-data';

// Helper to provide realistic demo fallback data
function getFallbackData() {
  return {
    hostname: 'demo-endpoint.local',
    platform: 'macOS',
    architecture: 'arm64',
    totalMemory: '16.00 GB',
    freeMemory: '6.45 GB',
    memoryUsagePercentage: '59.7%',
    uptimeSeconds: 84600,
    uptimeString: '0d 23h 30m',
    cpuModel: 'Apple M3 Pro',
    cpuCores: 11,
    osName: 'macOS',
    osVersion: '14.5',
    kernelVersion: '23.5.0',
    processCount: 342,
    openPortsCount: 8,
    loadedModulesCount: 198,
    firewallStatus: 'ENABLED',
    integrityStatus: 'SIMULATED TELEMETRY (AGENT OFFLINE)'
  };
}

export async function GET() {
  try {
    // Attempt to query the local read-only agent
    // Setting a short timeout of 800ms to ensure the dashboard remains fast
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 800);

    const response = await fetch(AGENT_URL, {
      signal: controller.signal,
      cache: 'no-store' // Do not cache dynamic system queries
    });
    
    clearTimeout(id);

    if (response.ok) {
      const result = await response.json();
      return NextResponse.json({
        status: 'SUCCESS',
        agentConnected: true,
        source: 'Real Agent',
        timestamp: new Date().toISOString(),
        data: result.data
      });
    }
  } catch (error) {
    // If the agent is not running (e.g. Connection Refused), gracefully return demo fallback
  }

  // Fallback to Demo Data
  return NextResponse.json({
    status: 'FALLBACK',
    agentConnected: false,
    source: 'Demo Fallback',
    timestamp: new Date().toISOString(),
    data: getFallbackData()
  });
}
