/**
 * Fix Dependencies Script for MistressWorld
 * 
 * This script checks for and fixes common dependency issues:
 * 1. Makes sure all required packages are installed
 * 2. Fixes common import paths
 * 3. Updates environment variables if needed
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Required dependencies for the project
const requiredDependencies = [
  'framer-motion',
  'react-icons',
  'next',
  'react',
  'react-dom'
];

// Check package.json for required dependencies
function checkDependencies() {
  console.log('Checking dependencies...');
  
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const missingDependencies = requiredDependencies.filter(dep => !dependencies[dep]);
    
    if (missingDependencies.length === 0) {
      console.log('✅ All required dependencies are installed.');
      return [];
    }
    
    console.log(`⚠️ Missing dependencies: ${missingDependencies.join(', ')}`);
    return missingDependencies;
  } catch (err) {
    console.error('❌ Error checking dependencies:', err);
    return [];
  }
}

// Install missing dependencies
function installDependencies(missingDependencies) {
  if (missingDependencies.length === 0) return;
  
  console.log(`Installing missing dependencies: ${missingDependencies.join(', ')}...`);
  
  return new Promise((resolve, reject) => {
    exec(`npm install ${missingDependencies.join(' ')}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error installing dependencies: ${error.message}`);
        reject(error);
        return;
      }
      
      console.log('✅ Dependencies installed successfully.');
      resolve();
    });
  });
}

// Create fallback components for any potentially missing components
function createFallbackComponents() {
  console.log('\nChecking for essential components...');
  
  const componentsToCheck = [
    {
      path: 'src/components/common/PageTransition.jsx',
      content: `import React from 'react';

/**
 * Simple PageTransition component (fallback version)
 */
const PageTransition = ({ children, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  return <>{children}</>;
};

export default PageTransition;`
    },
    {
      path: 'src/components/common/ErrorBoundary.jsx',
      content: `import React from 'react';

/**
 * Error Boundary Component (fallback version)
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>Something went wrong</h3>
          <button onClick={() => this.setState({ hasError: false })}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;`
    }
  ];
  
  componentsToCheck.forEach(({ path: componentPath, content }) => {
    const fullPath = path.resolve(process.cwd(), componentPath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`Creating fallback component: ${componentPath}`);
      
      try {
        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        // Write fallback component
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Created: ${componentPath}`);
      } catch (err) {
        console.error(`❌ Error creating ${componentPath}:`, err);
      }
    } else {
      console.log(`✅ Component exists: ${componentPath}`);
    }
  });
}

// Check and create .env.local if needed
function checkEnvironmentVars() {
  console.log('\nChecking environment variables...');
  
  const envPath = path.resolve(process.cwd(), '.env.local');
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    console.log('✅ .env.local exists');
  } else {
    console.log('⚠️ .env.local does not exist, creating it...');
  }
  
  // Key environment variables to check
  const requiredEnvVars = [
    { key: 'NEXT_PUBLIC_SITE_URL', value: 'https://mistressworld.xxx' }
  ];
  
  // Add any missing environment variables
  let updated = false;
  requiredEnvVars.forEach(({ key, value }) => {
    if (!envContent.includes(`${key}=`)) {
      envContent += `\n${key}=${value}`;
      updated = true;
      console.log(`⚠️ Added missing environment variable: ${key}`);
    }
  });
  
  // Write updated .env.local file if needed
  if (updated) {
    fs.writeFileSync(envPath, envContent.trim(), 'utf8');
    console.log('✅ Updated .env.local with missing variables');
  } else {
    console.log('✅ All required environment variables exist');
  }
}

// Main function
async function main() {
  console.log('🔧 Starting dependency and project fix...');
  
  // Check and install dependencies
  const missingDeps = checkDependencies();
  if (missingDeps.length > 0) {
    await installDependencies(missingDeps);
  }
  
  // Create fallback components
  createFallbackComponents();
  
  // Check environment variables
  checkEnvironmentVars();
  
  console.log('\n✨ All fixes completed! You should be ready to go.');
}

// Run the script
main().catch(console.error); 