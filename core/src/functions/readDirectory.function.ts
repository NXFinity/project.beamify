import * as fs from 'fs';
import * as path from 'path';

export function readUserDirectory(userId: string): string[] {
  const dir = path.join(__dirname, `../dist/uploads/${userId}`);

  // Check if the directory exists
  if (fs.existsSync(dir)) {
    // If the directory exists, read its contents
    const files = fs.readdirSync(dir);

    return files; // This will be an array of filenames
  } else {
    throw new Error(`Directory for user ${userId} does not exist.`);
  }
}
