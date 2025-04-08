import path from 'path';
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  try {
    // Find the absolute path to the JSON file
    const jsonDirectory = path.join(process.cwd(), 'src', 'data');
    // Read the JSON file
    const fileContents = await fs.readFile(path.join(jsonDirectory, 'categories.json'), 'utf8');
    // Parse the JSON data
    const data = JSON.parse(fileContents);

    // Return the data
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
} 