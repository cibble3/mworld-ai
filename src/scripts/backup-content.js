const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { BACKUP_CONFIG } = require('../config/constants');

// Ensure backup directory exists
const BACKUP_DIR = path.resolve(process.cwd(), 'backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Get timestamp for backup
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupPath = path.join(BACKUP_DIR, `backup_${timestamp}`);

// Create backup directory
fs.mkdirSync(backupPath, { recursive: true });

// Content directories to backup
const contentDirs = [
  'src/data/blog',
  'src/data/categories',
  'src/data/models',
  'src/data/pages'
];

console.log('📦 Starting content backup...');

// Copy each content directory
contentDirs.forEach(dir => {
  const sourcePath = path.resolve(process.cwd(), dir);
  const targetPath = path.join(backupPath, path.basename(dir));
  
  if (fs.existsSync(sourcePath)) {
    console.log(`📂 Backing up ${dir}...`);
    execSync(`cp -r ${sourcePath} ${targetPath}`);
  } else {
    console.warn(`⚠️ Directory not found: ${dir}`);
  }
});

// Compress backup if enabled
if (BACKUP_CONFIG.COMPRESSION) {
  console.log('🔒 Compressing backup...');
  execSync(`tar -czf ${backupPath}.tar.gz -C ${BACKUP_DIR} ${path.basename(backupPath)}`);
  fs.rmSync(backupPath, { recursive: true });
}

// Clean up old backups
const retentionDate = new Date();
retentionDate.setDate(retentionDate.getDate() - BACKUP_CONFIG.RETENTION_DAYS);

fs.readdirSync(BACKUP_DIR).forEach(file => {
  const filePath = path.join(BACKUP_DIR, file);
  const stats = fs.statSync(filePath);
  
  if (stats.mtime < retentionDate) {
    console.log(`🗑️ Removing old backup: ${file}`);
    fs.unlinkSync(filePath);
  }
});

console.log('✅ Backup completed successfully'); 