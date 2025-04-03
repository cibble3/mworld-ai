const fs = require('fs');
const path = require('path');

const PENDING_JOBS_DIR = path.resolve(process.cwd(), 'jobs/pending');

// Ensure directory exists
if (!fs.existsSync(PENDING_JOBS_DIR)) {
  console.log(`Creating directory: ${PENDING_JOBS_DIR}`);
  fs.mkdirSync(PENDING_JOBS_DIR, { recursive: true });
}

// Create a job
const job = {
  id: `flatten-categories-${Date.now()}`,
  type: 'flatten-categories',
  createdAt: new Date().toISOString(),
  status: 'pending'
};

// Save job file
const jobFile = path.join(PENDING_JOBS_DIR, `${job.id}.json`);
fs.writeFileSync(jobFile, JSON.stringify(job, null, 2));

console.log(`✅ Created category flatten job: ${job.id} in ${PENDING_JOBS_DIR}`); 