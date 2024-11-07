import sharp from "sharp";
import path from "path";
import fs from "fs";
import glob from "glob";

// Define input and output directories
const inputDir = path.join(
  process.cwd(),
  "src/assets/images/*.{jpg,jpeg,png,JPG,PNG}"
);
const outputDir = path.join(process.cwd(), "src/assets/images/compressed");

// Check if the output directory exists, if not, create it
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Debugging: List matched files
glob(inputDir, (err, files) => {
  if (err) {
    console.error("Error:", err);
    return;
  }

  console.log("Matched files:", files); // Log matched files

  // Filter out non-image files
  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|JPG|PNG)$/.test(file)
  );

  if (imageFiles.length === 0) {
    console.log("No images found to compress.");
    return;
  }

  (async () => {
    const compressedFiles = [];
    const maxConcurrent = 5; // Limit the number of concurrent compressions
    const promises = [];

    for (const file of imageFiles) {
      const promise = (async () => {
        try {
          const outputFilePath = path.join(outputDir, path.basename(file));
          await sharp(file)
            .jpeg({ quality: 75 }) // Adjust quality for JPEG
            .png({ quality: 80 }) // Adjust quality for PNG
            .toFile(outputFilePath);
          compressedFiles.push(outputFilePath);
        } catch (error) {
          console.error(`Error compressing ${file}:`, error);
        }
      })();

      promises.push(promise);

      // Limit concurrent promises
      if (promises.length >= maxConcurrent) {
        await Promise.race(promises);
        promises.splice(0, promises.length - 1); // Keep only the last promise
      }
    }

    // Wait for any remaining promises to resolve
    await Promise.all(promises);

    console.log("Images compressed:", compressedFiles);
  })();
});
