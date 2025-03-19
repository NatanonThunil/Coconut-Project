export default defineEventHandler(async (event) => {
  if (event.req.url.startsWith('/api')) {

    const token = getHeader(event, 'CKH');
    const config = useRuntimeConfig();

    if (!token) {
      throw createError({ 
        statusCode: 400, 
        message: 'API token is missing' 
      });
    }

    if (token !== config.apiSecret) {
 
      console.warn(`Unauthorized access attempt to ${event.req.url}`);

      throw createError({ 
        statusCode: 403, 
        message: 'Forbidden: Invalid API token' 
      });
    }
  }
});
