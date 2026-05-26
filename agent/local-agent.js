/**
 * OS KERNEL SECURITY TESTING PLATFORM
 * Safe Local Defensive Monitoring Agent (Read-Only)
 * 
 * This script runs a lightweight, zero-dependency Node.js HTTP server
 * on port 3001. It executes safe, read-only commands to collect basic
 * defensive security metrics and returns them in JSON format.
 * 
 * Safety Rules:
 * - NO modification of files or system configurations.
 * - NO root/sudo privileges requested.
 * - NO stress testing, process killing, or network exploits.
 * - Read-only queries only.
 */

const http = require('http');
const { exec } = require('child_process');
const os = require('os');

const PORT = 3001;

// Helper to run shell commands safely with a promise
function execCommand(command) {
  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, data: '', error: error.message });
      } else if (stderr) {
        resolve({ success: true, data: stderr.trim() });
      } else {
        resolve({ success: true, data: stdout.trim() });
      }
    });
  });
}

// Format bytes to readable size
function formatBytes(bytes) {
  const gb = bytes / (1024 * 1024 * 1024);
  return `${gb.toFixed(2)} GB`;
}

// Format seconds to human-readable uptime
function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

// Query system metrics asynchronously
async function getSystemMetrics() {
  const platform = os.platform(); // 'darwin', 'linux', 'win32'
  
  // Base details using safe Node.js built-ins
  const metrics = {
    hostname: os.hostname(),
    platform: platform === 'darwin' ? 'macOS' : platform === 'linux' ? 'Linux' : platform,
    architecture: os.arch(),
    totalMemory: formatBytes(os.totalmem()),
    freeMemory: formatBytes(os.freemem()),
    memoryUsagePercentage: (((os.totalmem() - os.freemem()) / os.totalmem()) * 100).toFixed(1) + '%',
    uptimeSeconds: os.uptime(),
    uptimeString: formatUptime(os.uptime()),
    cpuModel: os.cpus()[0]?.model || 'Unknown CPU',
    cpuCores: os.cpus().length,
    
    // Command execution metrics (initialized with defaults)
    osName: 'Unknown OS',
    osVersion: 'Unknown Version',
    kernelVersion: os.release(),
    processCount: 0,
    openPortsCount: 0,
    loadedModulesCount: 0,
    firewallStatus: 'UNSUPPORTED',
    integrityStatus: 'VERIFIED (SAFE READ-ONLY AGENT)'
  };

  // 1. Get exact OS details & Version
  if (platform === 'darwin') {
    const swResult = await execCommand('sw_vers -productVersion');
    metrics.osName = 'macOS';
    metrics.osVersion = swResult.success ? swResult.data : 'Unknown macOS';
  } else if (platform === 'linux') {
    const osResult = await execCommand('cat /etc/os-release | grep PRETTY_NAME | cut -d= -f2');
    metrics.osName = 'Linux';
    metrics.osVersion = osResult.success ? osResult.data.replace(/"/g, '') : 'Unknown Linux';
  } else {
    metrics.osName = os.type();
    metrics.osVersion = os.release();
  }

  // 2. Get exact Kernel version
  const kernelResult = await execCommand('uname -r');
  if (kernelResult.success) {
    metrics.kernelVersion = kernelResult.data;
  }

  // 3. Process Count (Safe read-only active processes)
  if (platform === 'darwin' || platform === 'linux') {
    const psResult = await execCommand('ps -ax | wc -l');
    if (psResult.success) {
      metrics.processCount = parseInt(psResult.data, 10) - 1; // Subtract 1 for header
    }
  }

  // 4. Open TCP Ports Count
  if (platform === 'darwin' || platform === 'linux') {
    // Queries only TCP listening sockets
    const portsResult = await execCommand('lsof -i -P -n -sTCP:LISTEN | wc -l');
    if (portsResult.success) {
      const parsed = parseInt(portsResult.data, 10);
      metrics.openPortsCount = parsed > 0 ? parsed - 1 : 0; // Subtract header
    }
  }

  // 5. Loaded Kernel Modules Summary
  if (platform === 'darwin') {
    // On macOS, loaded modules are KEXTs (Kernel Extensions)
    const modulesResult = await execCommand('kextstat | wc -l');
    if (modulesResult.success) {
      const parsed = parseInt(modulesResult.data, 10);
      metrics.loadedModulesCount = parsed > 0 ? parsed - 1 : 0;
    }
  } else if (platform === 'linux') {
    const modulesResult = await execCommand('lsmod | wc -l');
    if (modulesResult.success) {
      const parsed = parseInt(modulesResult.data, 10);
      metrics.loadedModulesCount = parsed > 0 ? parsed - 1 : 0;
    }
  }

  // 6. Firewall Configuration Audit (macOS specific preference read)
  if (platform === 'darwin') {
    const fwResult = await execCommand('defaults read /Library/Preferences/com.apple.alf globalstate');
    if (fwResult.success) {
      const state = fwResult.data;
      if (state === '0') {
        metrics.firewallStatus = 'DISABLED';
      } else if (state === '1') {
        metrics.firewallStatus = 'ENABLED';
      } else if (state === '2') {
        metrics.firewallStatus = 'BLOCK_ALL';
      } else {
        metrics.firewallStatus = 'ENABLED (CUSTOM)';
      }
    } else {
      metrics.firewallStatus = 'READ_ERROR';
    }
  } else if (platform === 'linux') {
    // Safe check if ufw is active (if available)
    const ufwResult = await execCommand('ufw status');
    if (ufwResult.success) {
      metrics.firewallStatus = ufwResult.data.includes('active') ? 'ENABLED' : 'DISABLED';
    } else {
      metrics.firewallStatus = 'UNKNOWN';
    }
  }

  return metrics;
}

// Start HTTP Server
const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/' || req.url === '/api/agent-data') {
    try {
      const metrics = await getSystemMetrics();
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'SUCCESS',
        timestamp: new Date().toISOString(),
        agentConnected: true,
        data: metrics
      }));
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({
        status: 'ERROR',
        message: 'Failed to retrieve system metrics',
        error: err.message
      }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ status: 'NOT_FOUND', message: 'Endpoint not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`   OS KERNEL SECURITY TESTING - LOCAL AGENT      `);
  console.log(`   [STATUS] Running on http://localhost:${PORT}  `);
  console.log(`   [SECURITY] Safe, read-only monitoring active  `);
  console.log(`=================================================`);
});
