import mysql from "mysql2/promise";
import { dbConfig } from "../config/poom_db_config";

const pool = mysql.createPool(dbConfig);

const createConnection = async () => {
  const connection = await pool.getConnection();
  return connection;
};

const imageToBuffer = (imageData) => {
  try {
    return Buffer.from(imageData, "base64");
  } catch (error) {
    throw new Error("Invalid image data. Unable to convert to buffer.");
  }
};

const detectMimeType = (imageBuffer) => {
  const signature = imageBuffer.slice(0, 4).toString("hex");
  switch (signature) {
    case "89504e47":
      return "image/png";
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
      return "image/jpeg";
    case "47494638":
      return "image/gif";
    default:
      return "application/octet-stream"; // Default for unknown types
  }
};

export default defineEventHandler(async (event) => {
  let connection;
  try {
    connection = await createConnection();

    if (event.req.method === "GET") {
      const [rows] = await connection.execute("SELECT * FROM expert ORDER BY id DESC");

      const experts = rows.map((expert) => {
        let imageBase64 = null;
        if (expert.image) {
          const mimeType = detectMimeType(expert.image);
          imageBase64 = `data:${mimeType};base64,${expert.image.toString(
            "base64"
          )}`;
        }

        return {
          ...expert,
          image: imageBase64,
        };
      });

      return experts;
    } else if (event.req.method === "POST") {
      const body = await readBody(event);

      const {
        name,
        address,
        description,
        expert_tags_id,
        phoneNumber,
        gmail,
        image,
        type,
      } = body;

      // Basic validation
      if (!name || !address || !description || !expert_tags_id || !phoneNumber || !gmail || !image ||!type) {
        return { error: "All fields are required." };
      }

      const imageBuffer = imageToBuffer(image);
      const mimeType = detectMimeType(imageBuffer);

      if (!["image/png", "image/jpeg", "image/gif"].includes(mimeType)) {
        return { error: "Unsupported image format. Use PNG, JPEG, or GIF." };
      }

      const [result] = await connection.execute(
        `INSERT INTO expert 
          (image, name, address, description, expert_tags_id, phoneNumber, gmail) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          imageBuffer,
          name,
          address,
          description,
          expert_tags_id,
          phoneNumber,
          gmail,
          type,
        ]
      );

      return {
        message: "Expert added successfully.",
        id: result.insertId,
      };
    } else {
      return { error: "Method Not Allowed" };
    }
  } catch (error) {
    console.error("Error handling expert API request:", error);
    return { error: "An unexpected error occurred. Please try again later." };
  } finally {
    if (connection) {
      try {
        connection.release();
      } catch (releaseError) {
        console.error("Error releasing database connection:", releaseError);
      }
    }
  }
});
