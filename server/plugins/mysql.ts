import mysql from 'mysql2/promise';

export default defineNitroPlugin((nitroApp)=> {
let pool;

try {


// Log to confirm the plugin is loaded

nitroApp.hooks.hook('request', (event) => {
  event.context.$scriptdb = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
  
 })

 } 
  catch (error) {
   console.error('Error creating MySQL pool:', error);
   throw new Error('Failed to initialize MySQL connection pool');
 }

return {
  provide: {
   mysql: pool,
   },
  };
   });