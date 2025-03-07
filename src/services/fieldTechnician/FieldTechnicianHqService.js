const {pool} = require("../../config/config");

// Function to fetch FieldTechnicianHq
async function fieldTechnicianHqFetchService(user_id) {
    let conn;
    try {
        if (!user_id) {
            return { status: 400, data: { message: "user_id is required!" } };
        }

        conn = await pool.getConnection();
        const query = `
            SELECT ft.FieldTechnicianHq, ft.id
            FROM tbl_employees e
            INNER JOIN tbl_field_technician ft ON e.FieldTechnicianHq_id = ft.id
            WHERE e.id = ?
        `;

        const [rows] = await conn.execute(query, [user_id]);

        if (rows.length > 0) {
            return { status: 200, data: { FieldTechnicianHq: rows[0].FieldTechnicianHq, id: rows[0].id } };
        } else {
            return { status: 404, data: { message: "No FieldTechnicianHq found for the given user_id" } };
        }

    } catch (error) {
        console.error("Database Error:", error);
        return { status: 500, data: { message: error.message } };

    } finally {
        if (conn) conn.release();
    }
}

module.exports = { fieldTechnicianHqFetchService };
