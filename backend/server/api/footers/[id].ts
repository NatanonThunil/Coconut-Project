export default defineEventHandler(async (event) => {
  const method = event.node.req.method?.toUpperCase();
  const id = event.context.params?.id;

  if (!id) {
    console.error("Error: Footer ID is missing.");
    return { success: false, error: "Footer ID is required." };
  }

  let connection;
  try {
    // Assuming event.context.$scriptdb is a direct connection (not from a pool)
    connection = event.context.$scriptdb;

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
            credit: footer.credit || '',
            credit_en: footer.credit_en || '',
          },
        };
      } catch (error) {
        console.error("Error fetching footer:", (error as Error).message);
        return { success: false, error: "Failed to fetch footer." };
      }
    } else if (method === 'PUT') {
      const body = await readBody(event);
      let { text, text_en, credit, credit_en } = body;

      text = text ?? null;
      text_en = text_en ?? null;
      credit = credit ?? null;
      credit_en = credit_en ?? null;
      const query = `
        UPDATE footer 
        SET text = ?, text_en = ?, credit = ?, credit_en = ?
        WHERE id = ?
      `;

      try {
        await connection.execute(query, [text, text_en, credit, credit_en, id]);
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
    // No need to release if not using a pool-based connection
    // If you're not using a pool, just ensure the connection is closed (if applicable).
    // Example: connection.end(); if using a direct connection (check your DB library).
  }
});
