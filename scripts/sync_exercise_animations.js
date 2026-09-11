import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const exercisesFilePath = path.resolve(__dirname, '../web/exercises.js');
const imgDir = path.resolve(__dirname, '../web/images/exercises');

let content = fs.readFileSync(exercisesFilePath, 'utf8');

// Regex to find each exercise block
const regex = /{\s*id:\s*'([a-z0-9_]+)'[\s\S]*?image:\s*'([^']+)'(?:,\s*animation:\s*'([^']+)')?[\s\S]*?svg:/g;

let match;
let countAdded = 0;
let modified = content;

// Replace systematically by matching id and inserting animation if file exists
const exRegex = /{\s*id:\s*'([a-z0-9_]+)',\s*category:/g;
const matches = [...content.matchAll(exRegex)];

for (const m of matches) {
  const exId = m[1];
  const webpPath = path.join(imgDir, `${exId}.webp`);
  if (fs.existsSync(webpPath)) {
    // Check if this exercise block already has animation
    const blockStart = m.index;
    const blockEnd = content.indexOf('svg:', blockStart);
    const block = content.slice(blockStart, blockEnd);
    if (!block.includes('animation:')) {
      // Find `image: '/images/exercises/${exId}.jpg',`
      const target = `image: '/images/exercises/${exId}.jpg',`;
      const replacement = `image: '/images/exercises/${exId}.jpg',\n    animation: '/images/exercises/${exId}.webp',`;
      if (modified.includes(target)) {
        modified = modified.replace(target, replacement);
        countAdded++;
      }
    }
  }
}

if (countAdded > 0) {
  fs.writeFileSync(exercisesFilePath, modified, 'utf8');
  console.log(`Successfully synced ${countAdded} new animation(s) into web/exercises.js`);
} else {
  console.log('All available on-disk animations are already synced in web/exercises.js');
}
