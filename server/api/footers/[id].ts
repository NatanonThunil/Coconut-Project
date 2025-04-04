
export default defineEventHandler(async (event) => {
  const method = event.node.req.method?.toUpperCase();
  const id = event.context.params?.id;

  if (!id) {
    console.error("Error: Footer ID is missing.");
    return { success: false, error: "Footer ID is required." };
  }

  let connection;
  try {
    const pool = event.context.$scriptdb;
    if (!pool) {
      console.error("Error: Database connection pool is not initialized.");
      return { success: false, error: "Database connection failed." };
    }

    connection = await pool.getConnection();

    if (method === 'GET') {
      try {
        const [rows] = await connection.execute(
          'SELECT * FROM `footer` WHERE id = ?',
          [id]
        );

        if (!rows.length) {
          console.error(`Error: No footer found with ID: ${id}`);
          return { success: false, error: "Footer not found." };
        }

        const footer = rows[0];

        return {
          success: true,
          footer: {
            id: footer.id,
            text: footer.text || "Default footer text",
            text_en: footer.text_en || '',
          },
        };
      } catch (error) {
        console.error("Error fetching footer:", (error as Error).message);
        return { success: false, error: "Failed to fetch footer." };
      }
    } else if (method === 'PUT') {
      const body = await readBody(event);
      let { text, text_en } = body;

      text = text ?? null;
      text_en = text_en ?? null;

      const query = `
        UPDATE footer 
        SET text = ?, text_en = ?
        WHERE id = ?
      `;

      try {
        await connection.execute(query, [text, text_en, id]);
      } catch (error) {
        console.error("Error executing query:", (error as Error).message);
        return { success: false, error: "Failed to update footer in the database." };
      }

      return { success: true, message: "Footer updated successfully." };
    } else {
      console.error("Error: Invalid request method.");
      return { success: false, error: "Invalid request method." };
    }
  } catch (error) {
    console.error("Error handling request:", (error as Error).message || error);
    return { success: false, error: "Failed to handle request." };
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
