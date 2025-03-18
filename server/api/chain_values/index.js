import mysql from 'mysql2/promise';
 import { dbConfig } from '../../config/poom_db_config';
 
 export default defineEventHandler(async () => {
     let connection;
     try {
         connection = await mysql.createConnection(dbConfig);
         const [rows] = await connection.execute('SELECT * FROM `chain_values`');
 
         if (rows.length === 0) {
             return { message: 'No chain values available.' };
         }
 
         const chainValues = rows.map((value) => {
             let imageBase64 = null;
             if (value.image) {
                 const imageBuffer = Buffer.from(value.image);
                 let mimeType = 'image/jpeg'; 
 
                 if (imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50) {
                     mimeType = 'image/png';
                 }
 
                 imageBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
             }
 
             return {
                 ...value,
                 image: imageBase64,
                 description: value.description, 
             };
         });
 
         return chainValues;
     } catch (error) {
         console.error('Error fetching chain values:', error);
         return { error: 'Failed to fetch chain values' };
     } finally {
         if (connection) {
             await connection.end();
         }
     }
 });