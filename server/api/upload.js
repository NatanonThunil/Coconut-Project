import fs from 'fs';
import path from 'path';
import { readBody } from 'h3';

export default eventHandler(async (event) => {
  try {
    const body = await readBody(event);

    if (!body) {
      return { statusCode: 400, body: { error: 'Request body is missing' } };
    }

    const { image, path: imagePath } = body;

    if (!image || !imagePath) {
      return { statusCode: 400, body: { error: 'Image data or path is missing' } };
    }

    const buffer = Buffer.from(image, 'base64');
    const fullPath = path.join(process.cwd(), 'public', imagePath);
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, buffer);

    return { statusCode: 200, body: { message: 'Image uploaded successfully', path: imagePath } };
  } catch (error) {
    console.error('Error uploading image:', error.message);
    return { statusCode: 500, body: { error: `Failed to upload image: ${error.message}` } };
  }
});
