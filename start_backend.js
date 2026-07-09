/* =============================================
   AURA – Backend Microservices Process Manager
   Launches API Gateway, Auth, Analytics, and Chat services
   ============================================= */

const { spawn } = require('child_process');
const path = require('path');

const services = [
    { name: 'Auth Service', path: 'backend/auth-service/index.js', port: 8001 },
    { name: 'Analytics Service', path: 'backend/analytics-service/index.js', port: 8006 },
    { name: 'Chat Service', path: 'backend/chat-service/index.js', port: 8008 },
    { name: 'API Gateway', path: 'backend/api-gateway/index.js', port: 8000 }
];

console.log("=============================================");
console.log("AURA – Starting Backend Microservices...");
console.log("=============================================");

const processes = [];

services.forEach(service => {
    const scriptPath = path.join(__dirname, service.path);
    console.log(`[Manager]: Booting ${service.name} from ${service.path} on port ${service.port}...`);
    
    const child = spawn('node', [scriptPath], {
        stdio: 'inherit',
        env: { ...process.env, PORT: service.port }
    });

    child.on('error', err => {
        console.error(`[Manager] Error starting ${service.name}:`, err.message);
    });

    child.on('exit', (code, signal) => {
        console.log(`[Manager] ${service.name} exited with code ${code} (signal: ${signal})`);
    });

    processes.push(child);
});

// Handle termination signals to kill all child processes
const cleanup = () => {
    console.log("\n[Manager] Shutting down all microservices...");
    processes.forEach(proc => {
        try {
            proc.kill();
        } catch (e) {}
    });
    process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
