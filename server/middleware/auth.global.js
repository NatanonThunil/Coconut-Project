export default defineEventHandler(async (event) => {
  if (event.req.url.startsWith('/api')) {

    const token = getHeader(event, 'CKH');
    const config = useRuntimeConfig();


    if ((token !== config.apiSecret ) || !token) {
 
      console.warn(`Unauthorized access attempt to ${event.req.url}`);

      throw createError({ 
        statusCode: 404, 
        message: 'Forbidden: Invalid API token' 
      });
    }
  }
});
