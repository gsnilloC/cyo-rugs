import sharp from "sharp";
import path from "path";
import fs from "fs";
import glob from "glob";

const inputDir = path.join(
  process.cwd(),
  "src/assets/images/*.{jpg,jpeg,png,JPG,PNG}"
);
const outputDir = path.join(process.cwd(), "src/assets/images/compressed");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

glob(inputDir, (err, files) => {
  if (err) {
    console.error("Error:", err);
    return;
  }

  console.log("Matched files:", files);

  const imageFiles = files.filter((file) =>
    /\.(jpg|jpeg|png|JPG|PNG)$/.test(file)
  );

  if (imageFiles.length === 0) {
    console.log("No images found to compress.");
    return;
  }

  (async () => {
    const compressedFiles = [];
    const maxConcurrent = 5;
    const promises = [];

    for (const file of imageFiles) {
      const promise = (async () => {
        try {
          const outputFilePath = path.join(outputDir, path.basename(file));
          await sharp(file)
            .jpeg({ quality: 75 })
            .png({ quality: 80 })
            .toFile(outputFilePath);
          compressedFiles.push(outputFilePath);
        } catch (error) {
          console.error(`Error compressing ${file}:`, error);
        }
      })();

      promises.push(promise);

      if (promises.length >= maxConcurrent) {
        await Promise.race(promises);
        promises.splice(0, promises.length - 1);
      }
    }

    await Promise.all(promises);

    console.log("Images compressed:", compressedFiles);
  })();
});
