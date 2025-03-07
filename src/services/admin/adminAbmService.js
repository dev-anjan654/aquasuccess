const { pool } = require("../../config/config");

// Service to insert an ABM area
const adminAbmAreaInsertService = async (region_id, abm_area) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Check if the region_id exists
        const [regionExists] = await conn.execute("SELECT 1 FROM tbl_region WHERE id = ?", [region_id]);
        if (regionExists.length === 0) {
            return { success: false, message: "Invalid region_id. Region does not exist." };
        }

        if (!abm_area.trim()) {
            return { success: false, message: "ABM Area cannot be empty." };
        }

        await conn.execute("INSERT INTO tbl_abm_area (region_id, AbmArea) VALUES (?, ?)", [region_id, abm_area]);

        return { success: true, message: "ABM Area added successfully!" };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
};

// Service to update an ABM area
const adminAbmAreaUpdateService = async (id, region_id, AbmArea) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const modifiedDate = new Date();

        // Ensure the ABM area exists
        const [existingAbm] = await conn.execute("SELECT 1 FROM tbl_abm_area WHERE id = ?", [id]);
        if (existingAbm.length === 0) {
            return { success: false, message: "No ABM area found with the provided ID" };
        }

        const [result] = await conn.execute(
            "UPDATE tbl_abm_area SET region_id = ?, AbmArea = ?, ModifiedDate = ? WHERE id = ?",
            [region_id, AbmArea, modifiedDate, id]
        );

        if (result.affectedRows === 0) {
            return { success: false, message: "Update failed. No changes were made." };
        }

        return { success: true, message: "ABM area updated successfully" };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
};


// Fetch ABM areas for a given region_id
const adminFetchAbmAreaService = async (region_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Validate region_id
        if (!region_id || region_id <= 0) {
            return { success: false, message: "Invalid region ID." };
        }

        // Fetch ABM areas
        const query = "SELECT id, AbmArea FROM tbl_abm_area WHERE region_id = ? ORDER BY id DESC";
        const [rows] = await conn.execute(query, [region_id]);

        const abm_areas = rows.map(row => ({
            id: row.id,
            AbmArea: row.AbmArea
        }));

        return { success: true, abm_areas };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { adminAbmAreaInsertService, adminAbmAreaUpdateService, adminFetchAbmAreaService };
