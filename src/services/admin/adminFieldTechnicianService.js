const { pool } = require("../../config/config");

// Insert Field Technician
const adminFieldTechnicianInsertService = async (region_id, abm_area_id, field_technician_hq) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Validate if region_id exists
        const [regionExists] = await conn.execute("SELECT 1 FROM tbl_region WHERE id = ?", [region_id]);
        if (regionExists.length === 0) {
            return { success: false, message: "Invalid region_id. Region does not exist." };
        }

        // Validate if abm_area_id exists
        const [abmAreaExists] = await conn.execute("SELECT 1 FROM tbl_abm_area WHERE id = ?", [abm_area_id]);
        if (abmAreaExists.length === 0) {
            return { success: false, message: "Invalid AbmArea_id. ABM Area does not exist." };
        }

        // Insert Field Technician
        const creation_date = new Date().toISOString().slice(0, 19).replace("T", " ");
        const modified_date = creation_date;

        const insertQuery = `
            INSERT INTO tbl_field_technician (region_id, AbmArea_id, FieldTechnicianHq, CreationDate, ModifiedDate)
            VALUES (?, ?, ?, ?, ?)
        `;

        await conn.execute(insertQuery, [region_id, abm_area_id, field_technician_hq, creation_date, modified_date]);

        return { success: true, message: "Field Technician added successfully!" };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
};




// Update Field Technician
const adminFieldTechnicianUpdateService = async (id, region_id, AbmArea_id, FieldTechnicianHq) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Automatically set the modified date
        const modified_date = new Date().toISOString().slice(0, 19).replace("T", " ");

        // Update query
        const updateQuery = `
            UPDATE tbl_field_technician
            SET region_id = ?, 
                AbmArea_id = ?, 
                FieldTechnicianHq = ?, 
                ModifiedDate = ?
            WHERE id = ?
        `;

        const [result] = await conn.execute(updateQuery, [region_id, AbmArea_id, FieldTechnicianHq, modified_date, id]);

        // Check if any rows were updated
        if (result.affectedRows === 0) {
            return { message: "No field technician found with the provided ID", success: false, status: 404 };
        }

        return { message: "Field technician updated successfully", success: true, status: 200 };
    } catch (error) {
        return { message: `Database error: ${error.message}`, success: false, status: 400 };
    } finally {
        if (conn) conn.release();
    }
};





module.exports = { adminFieldTechnicianInsertService,adminFieldTechnicianUpdateService };
