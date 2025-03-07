const { pool } = require("../../config/config");

// Insert a new holiday
const adminHolidayInsertService = async (user_id, holidates, holidates_events) => {
    try {
        // Check if the holiday already exists
        const [existing] = await pool.execute(
            "SELECT 1 FROM tbl_holidays WHERE holidates = ?",
            [holidates]
        );

        if (existing.length > 0) {
            return { success: false, message: "The holiday date already exists." };
        }

        // Insert the new holiday record
        await pool.execute(
            "INSERT INTO tbl_holidays (user_id, holidates, holidates_events) VALUES (?, ?, ?)",
            [user_id, holidates, holidates_events]
        );

        return { success: true, message: "Holiday added successfully!" };

    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    }
};

// Fetch all holidays
const adminHolidaysFetchService = async () => {
    try {
        // Fetch holiday data from the database
        const [rows] = await pool.execute("SELECT id, holidates, holidates_events FROM tbl_holidays");

        const holidays = rows.map(row => ({
            id: row.id,
            holidates: row.holidates,
            holidates_events: row.holidates_events
        }));

        return { success: true, holidays };

    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    }
};


// Update holiday data in the database
const adminHolidayUpdateService = async (id, user_id, holidates, holidates_events) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const query = `
            UPDATE tbl_holidays 
            SET holidates = ?, holidates_events = ?, ModifiedDate = ? 
            WHERE id = ?
        `;

        const [result] = await conn.query(query, [holidates, holidates_events, user_id, id]);

        if (result.affectedRows === 0) {
            return { success: false, message: "Holiday ID not found.", status: 404 };
        }

        return { success: true, message: "Holiday updated successfully." , status: 200 };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}`, status: 400 };
    } finally {
        if (conn) conn.release();
    }
};

// Ensure both services are exported
module.exports = { adminHolidayInsertService, adminHolidaysFetchService, adminHolidayUpdateService };
