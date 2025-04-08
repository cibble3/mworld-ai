const cron = require('node-cron');
const { spawn } = require('child_process');
const path = require('path');
const config = require('../config'); // Import central config

console.log('⏰ Scheduler starting...');

// --- Define Schedules from Config ---

// Schedule AWE Sync Job Creation (Replaces VPAPI)
if (config.jobSchedule?.aweSync) { // Check for aweSync schedule
  cron.schedule(config.jobSchedule.aweSync, () => {
    console.log(`[${new Date().toISOString()}] Scheduling AWE sync job...`);
    const scriptPath = path.resolve(process.cwd(), 'src/cli/create-awe-job.js'); // Use awe job creator
    if (require('fs').existsSync(scriptPath)) {
        const childProcess = spawn('node', [scriptPath]);
        childProcess.stdout.on('data', (data) => console.log(`AWE Job Creator: ${data}`)); // Updated log prefix
        childProcess.stderr.on('data', (data) => console.error(`AWE Job Creator Error: ${data}`)); // Updated log prefix
        childProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`[${new Date().toISOString()}] AWE sync job created successfully.`);
          } else {
            console.error(`[${new Date().toISOString()}] AWE job creator failed with code ${code}.`);
          }
        });
    } else {
        console.error(`[${new Date().toISOString()}] Error: Script not found at ${scriptPath}`);
    }
  });
  console.log(`🗓️ Scheduled AWE Sync: ${config.jobSchedule.aweSync}`);
} else {
  console.warn('⚠️ AWE sync schedule (aweSync) not found in config.');
}

// Schedule Category Flattening Job Creation
if (config.jobSchedule?.categoryFlatten) {
  cron.schedule(config.jobSchedule.categoryFlatten, () => {
    console.log(`[${new Date().toISOString()}] Scheduling category flatten job...`);
    const scriptPath = path.resolve(process.cwd(), 'src/cli/create-category-job.js');
    if (require('fs').existsSync(scriptPath)) {
        const childProcess = spawn('node', [scriptPath]);
        childProcess.stdout.on('data', (data) => console.log(`Category Job Creator: ${data}`));
        childProcess.stderr.on('data', (data) => console.error(`Category Job Creator Error: ${data}`));
        childProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`[${new Date().toISOString()}] Category flatten job created successfully.`);
          } else {
            console.error(`[${new Date().toISOString()}] Category job creator failed with code ${code}.`);
          }
        });
    } else {
        console.error(`[${new Date().toISOString()}] Error: Script not found at ${scriptPath}`);
    }
  });
  console.log(`🗓️ Scheduled Category Flatten: ${config.jobSchedule.categoryFlatten}`);
} else {
  console.warn('⚠️ Category flatten schedule not found in config.');
}

// Schedule Tag Analysis Job
if (config.jobSchedule?.tagAnalysis) {
  cron.schedule(config.jobSchedule.tagAnalysis, () => {
    console.log(`[${new Date().toISOString()}] Starting tag analysis job...`);
    const scriptPath = path.resolve(process.cwd(), 'src/cli/analyze-tags.js');
    
    if (require('fs').existsSync(scriptPath)) {
      const childProcess = spawn('node', [
        scriptPath,
        '--min-models=20',
        '--visualize'
      ]);
      
      childProcess.stdout.on('data', (data) => console.log(`Tag Analysis: ${data}`));
      childProcess.stderr.on('data', (data) => console.error(`Tag Analysis Error: ${data}`));
      
      childProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`[${new Date().toISOString()}] Tag analysis completed successfully.`);
        } else {
          console.error(`[${new Date().toISOString()}] Tag analysis failed with code ${code}.`);
        }
      });
    } else {
      console.error(`[${new Date().toISOString()}] Error: Tag analysis script not found at ${scriptPath}`);
    }
  });
  
  console.log(`🏷️ Scheduled Tag Analysis: ${config.jobSchedule.tagAnalysis}`);
} else {
  console.warn('⚠️ Tag analysis schedule not found in config. Tag data may become stale.');
}

// --- Add more schedules here as needed (reading from config) ---

console.log('✅ Scheduler running. Waiting for scheduled tasks...');

// Keep the script running if run directly
if (require.main === module) {
  setInterval(() => {}, 1 << 30); 
} 