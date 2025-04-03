const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// First run the cleanup script
console.log('Running cleanup script...');
require('./cleanup');

// Create deployment package
console.log('\nCreating deployment package...');

// Method 1: Create a zip file
function createZip() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const zipFilename = `mistressworld-deployment-${timestamp}.zip`;
  
  try {
    console.log(`Creating zip file: ${zipFilename}`);
    execSync(`zip -r ${zipFilename} . -x "*.zip" -x "cleanup.js" -x "package-for-deployment.js"`, { stdio: 'inherit' });
    console.log(`\nZip file created: ${zipFilename}`);
    
    // Get the size of the zip file
    const stats = fs.statSync(zipFilename);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`Size: ${fileSizeInMB} MB`);
  } catch (error) {
    console.error('Error creating zip file:', error);
  }
}

// Method 2: Create a base64-encoded string (optional, uncomment if needed)
function createBase64() {
  /*
  try {
    console.log('Creating temporary tar file...');
    execSync('tar -cf temp-deploy.tar --exclude="*.tar" --exclude="*.zip" --exclude="cleanup.js" --exclude="package-for-deployment.js" .', { stdio: 'inherit' });
    
    console.log('Converting to base64...');
    execSync('base64 temp-deploy.tar > deployment.base64', { stdio: 'inherit' });
    
    // Clean up temporary tar file
    fs.unlinkSync('temp-deploy.tar');
    
    const stats = fs.statSync('deployment.base64');
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`Base64 file created: deployment.base64 (${fileSizeInMB} MB)`);
  } catch (error) {
    console.error('Error creating base64 file:', error);
  }
  */
}

// Create the zip file (default method)
createZip();

// Uncomment the line below if you also want a base64 encoded version
// createBase64();

console.log('\nDeployment package created successfully!');
console.log('\nTo run the application after deployment, remember to:');
console.log('1. Install dependencies: npm install');
console.log('2. Build the application: npm run build');
console.log('3. Start the server: npm start'); 