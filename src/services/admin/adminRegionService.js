const { pool } = require("../../config/config");

// Insert new region
const adminRegionInsertService = async (regionName) => {
    try {
        if (!regionName.trim()) {
            return { success: false, message: "Region cannot be empty." };
        }
        
        const query = "INSERT INTO tbl_region (region) VALUES (?)";
        await pool.execute(query, [regionName]);
        
        return { success: true, message: "Region added successfully!" };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}`};
    }
};

const adminRegionUpdateService = async (id, region) => {
    if (!id || !region) {
        return { success: false, message: "Region ID and name are required."};
    }
    try {
        const modifiedDate = new Date();
        const [result] = await pool.execute(
            "UPDATE tbl_region SET region = ?, ModifiedDate = ? WHERE id = ?", 
            [region, modifiedDate, id]
        );
        
        if (result.affectedRows === 0) {
            return {success: false, message: "No region found with the provided ID."};
        }
        
        return { success: true, message: "Region updated successfully." };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}`};
    }
};


const adminFetchAllRegionsService = async () => {
    try {
        const query = "SELECT id, region, CreationDate FROM tbl_region ORDER BY id DESC";
        const [rows] = await pool.execute(query);

        // Format response
        const regions = rows.map(row => ({
            id: row.id,
            region: row.region,
            CreationDate: row.CreationDate ? new Date(row.CreationDate).toISOString().split('T')[0] : null
        }));

        return { success: true, regions };
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}`};
    }
};

module.exports = { adminRegionInsertService, adminRegionUpdateService, adminFetchAllRegionsService };