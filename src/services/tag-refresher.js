/**
 * Tag Refresher Service
 * 
 * Refreshes tag data periodically and stores it for use in the application.
 * This ensures we're always using fresh data for filters and SEO.
 */

import { getPopularTags } from './api/tag-analyzer';
import fs from 'fs/promises';
import path from 'path';

/**
 * Refresh tag information and save to JSON file
 * @param {number} minModels - Minimum number of models with the tag
 * @returns {Promise<boolean>} Success flag
 */
export async function refreshTagData(minModels = 20) {
  console.log('Starting tag refresh process...');
  
  try {
    // Get tag data from analyzer
    const tagData = await getPopularTags(minModels);
    
    // Ensure directory exists
    const dataDir = path.join(process.cwd(), 'src/data');
    await fs.mkdir(dataDir, { recursive: true });
    
    // Write tag data to file
    const filePath = path.join(dataDir, 'popular-tags.json');
    await fs.writeFile(
      filePath, 
      JSON.stringify(tagData, null, 2)
    );

    // Create a timestamp file to track the last update
    await fs.writeFile(
      path.join(dataDir, 'tags-updated.txt'),
      new Date().toISOString()
    );
    
    console.log(`Tag data refreshed successfully: ${filePath}`);
    return true;
  } catch (error) {
    console.error('Error refreshing tag data:', error);
    return false;
  }
}

/**
 * Check if tag data is stale and needs refreshing
 * @param {number} maxAgeDays - Maximum age of tag data in days
 * @returns {Promise<boolean>} Whether tags need refreshing
 */
export async function tagsNeedRefresh(maxAgeDays = 3) {
  try {
    const timestampFile = path.join(process.cwd(), 'src/data/tags-updated.txt');
    const dataFile = path.join(process.cwd(), 'src/data/popular-tags.json');
    
    // Check if files exist
    try {
      await fs.access(timestampFile);
      await fs.access(dataFile);
    } catch {
      return true; // Files don't exist, needs refresh
    }
    
    // Check timestamp
    const timestamp = await fs.readFile(timestampFile, 'utf8');
    const lastUpdate = new Date(timestamp);
    const now = new Date();
    const ageInDays = (now - lastUpdate) / (1000 * 60 * 60 * 24);
    
    return ageInDays > maxAgeDays;
  } catch (error) {
    console.error('Error checking tag freshness:', error);
    return true; // On error, assume refresh is needed
  }
}

// For direct CLI usage
if (require.main === module) {
  refreshTagData()
    .then(success => {
      process.exit(success ? 0 : 1);
    });
} 