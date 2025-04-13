// server/api/service/[id].ts
import { defineEventHandler, readBody, sendError, createError } from 'h3';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const connection = event.context.$scriptdb;
  const id = event.context.params?.id;

  if (!connection) {
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Database connection not found.' }));
  }

  if (!id) {
    return sendError(event, createError({ statusCode: 400, statusMessage: 'Service ID is required.' }));
  }

  try {
    if (method === 'GET') {
      const [rows]: any = await connection.execute(
        'SELECT id, image, title, description, status, title_en, description_en FROM `service` WHERE id = ? AND status = 1',
        [id]
      );

      if (rows.length === 0) {
        return sendError(event, createError({ statusCode: 404, statusMessage: 'Service not found or inactive.' }));
      }

      const row = rows[0];
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
        success: true,
        service: {
          id: row.id,
          image: imageBase64,
          title: row.title,
          description: row.description,
          status: !!row.status,
          title_en: row.title_en,
          description_en: row.description_en,
        },
      };
    } else if (method === 'PUT') {
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
        return sendError(event, createError({ statusCode: 400, statusMessage: 'Title and description are required.' }));
      }

      let imageBuffer: Buffer | null = null;
      if (image) {
        const parts = image.split(',');
        if (parts.length === 2) {
          imageBuffer = Buffer.from(parts[1], 'base64');
        }
      }

      const statusValue = status ? 1 : 0;

      try {
        const updateQuery = `
          UPDATE \`service\`
          SET image = ?, title = ?, description = ?, status = ?, title_en = ?, description_en = ?
          WHERE id = ?
        `;
        await connection.execute(updateQuery, [
          imageBuffer,
          title,
          description || null,
          statusValue,
          title_en,
          description_en,
          id,
        ]);

        return {
          success: true,
          message: 'Service updated successfully.',
        };
      } catch (error) {
        console.error('Error updating service:', error);
        return sendError(event, createError({ statusCode: 500, statusMessage: 'Failed to update service record.' }));
      }
    } else if (method === 'DELETE') {
      await connection.execute('DELETE FROM `service` WHERE id = ?', [id]);
      return {
        success: true,
        message: 'Service deleted successfully.',
      };
    } else {
      return sendError(event, createError({ statusCode: 405, statusMessage: 'Invalid request method.' }));
    }
  } catch (error) {
    console.error('Error in [id] handler:', (error as Error).message);
    return sendError(event, createError({ statusCode: 500, statusMessage: 'Failed to process request.' }));
  }
});
