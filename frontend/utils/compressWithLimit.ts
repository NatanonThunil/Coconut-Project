// import imageCompression from 'browser-image-compression';

// const B = 1024 * 1024;

// // We aim for <= 50 MB base64 => ~37.5 MB binary
// const BASE64_LIMIT_MB = 50;
// const BINARY_TARGET_MB = 37.5;

// function base64Bytes(dataUrl: string) {
//   // binaryBytes ≈ base64Length * 3/4 (ignore headers)
//   const i = dataUrl.indexOf(',');
//   const raw = i !== -1 ? dataUrl.slice(i + 1) : dataUrl;
//   return Math.floor((raw.length * 3) / 4);
// }

// async function fileToDataURL(file: File): Promise<string> {
//   return await new Promise((resolve, reject) => {
//     const fr = new FileReader();
//     fr.onload = () => resolve(fr.result as string);
//     fr.onerror = reject;
//     fr.readAsDataURL(file);
//   });
// }

// /**
//  * Compress to WebP under ~50MB base64. Retries with smaller dimensions if needed.
//  */
// export async function compressWithLimit(
//   file: File,
//   {
//     startMaxEdge = 2560,          // first pass max width/height
//     minMaxEdge = 1280,            // stop shrinking under this
//     binaryTargetMB = BINARY_TARGET_MB,
//   }: {
//     startMaxEdge?: number;
//     minMaxEdge?: number;
//     binaryTargetMB?: number;
//   } = {}
// ): Promise<{ base64: string; file: File; widthOrHeight: number; attempts: number; }> {
//   let maxEdge = startMaxEdge;
//   let attempts = 0;

//   while (true) {
//     attempts++;

//     const compressed = await imageCompression(file, {
//       maxWidthOrHeight: maxEdge,
//       maxSizeMB: binaryTargetMB,     // target binary size (library will try to meet this)
//       useWebWorker: true,
//       initialQuality: 0.9,
//       fileType: 'image/webp',        // forces WebP output
//     });

//     const dataUrl = await fileToDataURL(compressed);

//     // Check final base64 size
//     const bytes = base64Bytes(dataUrl);
//     if (bytes <= BASE64_LIMIT_MB * B) {
//       return { base64: dataUrl, file: compressed, widthOrHeight: maxEdge, attempts };
//     }

//     // Too big? Try again with a smaller max edge.
//     if (maxEdge <= minMaxEdge) {
//       // Last resort: shave the binary target a bit and try once more.
//       if (binaryTargetMB > 20) {
//         binaryTargetMB = Math.max(20, binaryTargetMB - 5); // lower by 5MB steps, min 20MB
//         continue;
//       }
//       throw new Error(`Image still exceeds ${BASE64_LIMIT_MB}MB after compression (final ~${(bytes / B).toFixed(1)}MB).`);
//     }

//     // Reduce ~20% each loop
//     maxEdge = Math.max(minMaxEdge, Math.floor(maxEdge * 0.8));
//   }
// }
