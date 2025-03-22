import mysql from 'mysql2/promise';

export default defineNitroPlugin((nitroApp)=> {
let pool;

try {


// Log to confirm the plugin is loaded

nitroApp.hooks.hook('request', (event) => {
  event.context.$scriptdb = mysql.createPool({
    host: '85.31.224.65',
    user: 'coconutkukps',
    password: 'Coconut@kukps2025',
    database: 'coconutknowledgehub',
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