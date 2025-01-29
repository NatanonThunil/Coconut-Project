import mysql from "mysql2/promise";
import { dbConfig } from "../config/poom_db_config";

const pool = mysql.createPool(dbConfig);

const detectMimeType = (buffer) => {
  const signature = buffer.toString("hex", 0, 4);
  switch (signature) {
    case "89504e47": return "image/png";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2": return "image/jpeg";
    case "47494638": return "image/gif";
    default: return "application/octet-stream";
  }
};

export default defineEventHandler(async (event) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const id = event.context.params?.id || null;

    const query = `
      SELECT e.*, 
             COALESCE(
               JSON_ARRAYAGG(JSON_QUOTE(t.tag_name)), 
               JSON_ARRAY()
             ) AS expert_tags_id
      FROM expert e 
      LEFT JOIN tags_expert t 
      ON JSON_CONTAINS(e.expert_tags_id, CAST(t.id AS JSON), '$')
      ${id ? 'WHERE e.id = ?' : ''}
      GROUP BY e.id;
    `;

    const [rows] = id ? await connection.execute(query, [id]) : await connection.execute(query);

    if (rows.length === 0) {
      return { error: "Expert not found" };
    }

    const experts = rows.map((expert) => {
      console.log("Expert Tags (Before Parsing):", expert.expert_tags_id);
    
      if (expert.image) {
        const mimeType = detectMimeType(expert.image);
        expert.image = `data:${mimeType};base64,${expert.image.toString("base64")}`;
      }
    
      try {
        if (typeof expert.expert_tags_id === 'string') {
          expert.expert_tags_id = JSON.parse(expert.expert_tags_id);
        } else if (!Array.isArray(expert.expert_tags_id)) {
          console.warn("Unexpected expert_tags_id format, defaulting to empty array.");
          expert.expert_tags_id = [];
        }
      } catch (error) {
        console.error("Error parsing expert_tags_id JSON:", error);
        expert.expert_tags_id = [];
      }
    
      return expert;
    });
    

    return id ? experts[0] : experts;
  } catch (error) {
    console.error("Error fetching expert data:", error);
    return { error: "An error occurred while fetching expert data" };
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
