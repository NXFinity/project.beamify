import * as fs from 'fs';
import * as path from 'path';

// This function creates a new directory and returns true if successful, false otherwise
export function createDirectory(dirName: string): boolean {
  const dir = path.join(__dirname, `../dist/uploads/${dirName}`);

  // Check if the directory already exists
  if (!fs.existsSync(dir)) {
    // If the directory does not exist, create it
    fs.mkdirSync(dir, { recursive: true });

    // Check again if the directory was successfully created
    if (fs.existsSync(dir)) {
      return true; // The directory was successfully created
    } else {
      return false; // The directory was not created
    }
  } else {
    return true; // The directory already exists
  }
}
