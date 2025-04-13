import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = event.context.$scriptdb;

  if (!connection) {
    return {
      success: false,
      error: 'Database connection not found.',
    };
  }

  try {
    if (method === 'GET') {
      
      const [rows]: any = await connection.execute(
        'SELECT id, image, title, description, status, title_en, description_en FROM `service`'
      );

      
      const services = rows.map((row: any) => {
        let imageBase64 = null;
        if (row.image) {
          const imageBuffer = Buffer.from(row.image);
         
          let mimeType = 'image/jpeg';
          if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
            mimeType = 'image/png';
          }
          imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
        }
        return {
          id: row.id,
          image: imageBase64,
          title: row.title,
          description: row.description,
          status: !!row.status, 
          title_en: row.title_en,
          description_en: row.description_en,
        };
      });

      return {
        success: true,
        services,
      };
    } else if (method === 'POST') {
      const body = await readBody(event);
      const {
        image,
        title,
        description,
        status = 0,
        title_en = '',
        description_en = '',
      } = body;

      if (!title || !description) {
        return {
          success: false,
          error: 'Title and description are required.',
        };
      }

      let imageBuffer: Buffer | null = null;
      if (image) {
        const parts = image.split(',');
        if (parts.length === 2) {
          const imageData = parts[1];
          imageBuffer = Buffer.from(imageData, 'base64');
        }
      }

      const statusValue = status ? 1 : 0;

      try {
        const insertQuery = `
          INSERT INTO \`service\`
            (image, title, description, status, title_en, description_en)
          VALUES
            (?, ?, ?, ?, ?, ?)
        `;
        const [result]: any = await connection.execute(insertQuery, [
          imageBuffer,
          title,
          description || null,
          statusValue,
          title_en,
          description_en,
        ]);

        return {
          success: true,
          message: 'Service record created successfully.',
          insertId: result.insertId,
        };
      } catch (error) {
        console.error('Error inserting service:', error);
        return {
          success: false,
          error: 'Failed to create service record.',
        };
      }
    } else {
      
      return {
        success: false,
        error: 'Invalid request method. Use GET or POST.',
      };
    }
  } catch (error) {
    console.error('Error in service handler:', (error as Error).message);
    return {
      success: false,
      error: 'Failed to handle request.',
    };
  }
});
