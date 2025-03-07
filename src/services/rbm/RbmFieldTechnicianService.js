const {pool} = require("../../config/config");

async function rbmFetchFieldTechnicianHQService(regionId, userId) {
    let connection;

    try {
        connection = await pool.getConnection();

        // Check if the user exists with the given region_id
        const [userExists] = await connection.execute(
            "SELECT 1 FROM tbl_employees WHERE id = ? AND region_id = ?", 
            [userId, regionId]
        );

        if (userExists.length === 0) {
            return { success: false, message: "User not found for the given region_id" };
        }

        // Fetch field technician HQ data
        const [rows] = await connection.execute(`
            SELECT 
                ft.FieldTechnicianHq,
                ft.id
            FROM 
                tbl_employees e
            INNER JOIN 
                tbl_field_technician ft 
            ON 
                e.FieldTechnicianHq_id = ft.id
            WHERE 
                e.region_id = ?
                AND e.FieldTechnicianHq_id IS NOT NULL 
                AND e.FieldTechnicianHq_id != ''
                AND e.AbmArea_id IS NOT NULL 
                AND e.AbmArea_id != ''
        `, [regionId]);

        const fieldTechnicianHqs = rows.map(row => ({
            field_technician_hq: row.FieldTechnicianHq,
            id: row.id
        }));

        return { success: true, field_technician_hqs: fieldTechnicianHqs };

    } catch (error) {
        console.error("Error fetching field technician HQs:", error);
        return { success: false, message: error.message };
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { rbmFetchFieldTechnicianHQService };
