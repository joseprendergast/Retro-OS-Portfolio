import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function serveStatic(app: Express) {
  // In production, the bundled file is at dist/index.cjs
  // __dirname in CommonJS points to the directory of the current file
  // So for dist/index.cjs, __dirname is 'dist'
  // We need to find the 'public' folder relative to the bundled file
  let distPath = path.resolve(__dirname, "public");
  
  // Log for debugging
  console.log(`[static] __dirname: ${__dirname}`);
  console.log(`[static] Attempting to serve static files from: ${distPath}`);
  console.log(`[static] Current working directory: ${process.cwd()}`);
  
  // If the distPath doesn't exist, try alternative paths
  if (!fs.existsSync(distPath)) {
    console.log(`[static] ${distPath} does not exist, trying alternative paths...`);
    
    // Try relative to current working directory
    const altPath1 = path.resolve(process.cwd(), "dist/public");
    if (fs.existsSync(altPath1)) {
      console.log(`[static] Found at: ${altPath1}`);
      distPath = altPath1;
    } else {
      console.log(`[static] ${altPath1} does not exist`);
      
      // Try one level up from __dirname
      const altPath2 = path.resolve(__dirname, "../dist/public");
      if (fs.existsSync(altPath2)) {
        console.log(`[static] Found at: ${altPath2}`);
        distPath = altPath2;
      } else {
        console.log(`[static] ${altPath2} does not exist`);
        throw new Error(
          `Could not find the build directory. Tried:\n` +
          `  - ${path.resolve(__dirname, "public")}\n` +
          `  - ${altPath1}\n` +
          `  - ${altPath2}\n` +
          `Make sure to build the client first with 'npm run build'`,
        );
      }
    }
  }
  
  console.log(`[static] Successfully resolved static path to: ${distPath}`);

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
