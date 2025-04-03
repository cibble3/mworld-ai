const fs = require('fs');
const path = require('path');

const PENDING_JOBS_DIR = path.resolve(process.cwd(), 'jobs/pending');

// Ensure directory exists
if (!fs.existsSync(PENDING_JOBS_DIR)) {
  console.log(`Creating directory: ${PENDING_JOBS_DIR}`);
  fs.mkdirSync(PENDING_JOBS_DIR, { recursive: true });
}

// Get optional AWE categories from command line arguments
// Use AWE specific category names like 'girls', 'transgender'
const categories = process.argv.slice(2);

// Create a job
const job = {
  id: `awe-sync-${Date.now()}`, // Updated job type in ID
  type: 'sync-awe',             // Updated job type
  createdAt: new Date().toISOString(),
  status: 'pending'
};

// Add specific categories to the job if provided
if (categories.length > 0) {
    job.categories = categories;
    console.log(`Job will sync specific AWE categories: ${categories.join(', ')}`);
}

// Save job file
const jobFile = path.join(PENDING_JOBS_DIR, `${job.id}.json`);
fs.writeFileSync(jobFile, JSON.stringify(job, null, 2));

console.log(`✅ Created AWE sync job: ${job.id} in ${PENDING_JOBS_DIR}`); 