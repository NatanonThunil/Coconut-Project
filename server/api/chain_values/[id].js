import mysql from 'mysql2/promise';
 import { dbConfig } from '../../config/poom_db_config';
 
 const pool = mysql.createPool(dbConfig);
 
 export default defineEventHandler(async (event) => {
     let connection;
     try {
         connection = await pool.getConnection();
 
         if (event.req.method === 'PUT') {
             const body = await readBody(event);
             const { id, title, title_en, description, description_en, image, status, category, type} = body;
 
             if (!id) return { error: 'Chain value ID is required for updating.' };
 
             let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;
 
             const query = `
                 UPDATE chain_values 
                 SET title = ?, title_en = ?, description = ?, description_en = ?, image = ?, status = ? , category= ?, type= ?
                 WHERE id = ?
             `;
             const values = [title, title_en, description, description_en, category, type , imageBuffer, status ? 1 : 0, id];
 
             const [result] = await connection.execute(query, values);
             if (result.affectedRows === 0) return { error: 'No chain value found or no changes made.' };
 
             return { message: 'Chain value updated successfully', id };
         } else if (event.req.method === 'POST') {
             const body = await readBody(event);
             const { title, title_en, description, description_en, image, status } = body;
 
             if (!title || !title_en) return { error: 'Title and title_en are required.' };
 
             let imageBuffer = image ? Buffer.from(image.split(',')[1], 'base64') : null;
 
             const query = 'INSERT INTO chain_values (title, title_en, description, category, type, description_en, image, status) VALUES (?, ?, ?, ?, ?, ?)';
             const values = [title, title_en, description, description_en, imageBuffer, status ? 1 : 0];
 
             const [result] = await connection.execute(query, values);
             return { message: 'Chain value added successfully', id: result.insertId };
         } else if (event.req.method === 'GET') {
             // Fetch all chain values
             const [rows] = await connection.execute(
                 'SELECT id, title, title_en, description, description_en, category, type, image, status FROM chain_values'
             );
 
             // Convert binary image data to base64
             const chainValuesWithImages = rows.map(row => {
                 if (row.image) {
                     row.image = `data:image/jpeg;base64,${row.image.toString('base64')}`;
                 }
                 return row;
             });
 
             return chainValuesWithImages;
 
         } else if (event.req.method === 'DELETE') {
             const body = await readBody(event);
             console.log("Received DELETE Request:", body); // Log incoming request body
         
             const { id } = body;
         
             if (!id) {
                 setResponseStatus(event, 400);
                 return { error: 'Chain value ID is required for deletion.' };
             }
         
             try {
                 console.log("Attempting to delete chain value with ID:", id);
                 const query = 'DELETE FROM chain_values WHERE id = ?';
                 const [result] = await connection.execute(query, [id]);
         
                 console.log("Delete Query Result:", result);
         
                 if (result.affectedRows === 0) {
                     setResponseStatus(event, 404);
                     return { error: 'No chain value found with the given ID.' };
                 }
         
                 setResponseHeader(event, 'Content-Type', 'application/json');
                 setResponseStatus(event, 200);
                 return { message: 'Chain value deleted successfully', id };
         
             } catch (error) {
                 console.error("Error deleting chain value:", error);
                 setResponseStatus(event, 500);
                 return { error: 'Internal server error' };
             }
         }
         
     } finally {
         if (connection) connection.release();
     }
 });