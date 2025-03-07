const { pool } = require("../../config/config");

// Function to format date
const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD format
};

// Fetch ABM Areas with Region details
const adminFetchAbmWithRegionService = async () => {
    let conn;
    try {
        conn = await pool.getConnection();

        const query = `
            SELECT 
                a.id, 
                r.id as region_id,
                r.region,
                a.AbmArea,
                a.CreationDate
            FROM tbl_abm_area a
            JOIN tbl_region r ON a.region_id = r.id
        `;

        const [rows] = await conn.query(query);

        const abm_areas = rows.map(row => ({
            id: row.id,
            region_id: row.region_id,
            region: row.region,
            AbmArea: row.AbmArea,
            CreationDate: formatDate(row.CreationDate)
        }));

        return { success: true, data: abm_areas, status: 200 };
    } catch (error) {
        return { success: false, data: { message: `Database error: ${error.message}` }, status: 400 };
    } finally {
        if (conn) conn.release();
    }
};

// Fetch Field Technician HQ with ABM and Region details
const adminFetchFieldTechnicianHqWithAbmWithRegionService = async () => {
    let conn;
    try {
        conn = await pool.getConnection();

        const query = `
            SELECT 
                t.id,               
                r.id as region_id,
                r.region,           
                ta.AbmArea, 
                ta.id as abm_id,
                t.FieldTechnicianHq,
                t.CreationDate      
            FROM tbl_field_technician t
            JOIN tbl_region r ON t.region_id = r.id 
            JOIN tbl_abm_area ta ON t.AbmArea_id = ta.id
        `;

        const [rows] = await conn.query(query);

        const field_technicians = rows.map(row => ({
            id: row.id,
            region: row.region,
            region_id: row.region_id,
            AbmArea: row.AbmArea,
            AbmArea_id: row.abm_id,
            FieldTechnicianHq: row.FieldTechnicianHq,
            CreationDate: formatDate(row.CreationDate)
        }));

        return { success: true, data: field_technicians, status: 200 };
    } catch (error) {
        return { success: false, data: { message: `Database error: ${error.message}` }, status: 400 };
    } finally {
        if (conn) conn.release();
    }
};




// Fetch Field Technician HQs by AbmArea ID
const adminFetchFieldTechnicianHqByAbmAreaService = async (abm_area_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const query = `
            SELECT 
                id,                
                FieldTechnicianHq  
            FROM tbl_field_technician
            WHERE AbmArea_id = ?
        `;

        const [rows] = await conn.query(query, [abm_area_id]);

        const field_technician_hqs = rows.map(row => ({
            id: row.id,
            FieldTechnicianHq: row.FieldTechnicianHq
        }));

        return { success: true, data: field_technician_hqs, status: 200 };
    } catch (error) {
        return { success: false, data: { message: `Database error: ${error.message}` }, status: 400 };
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { adminFetchAbmWithRegionService,adminFetchFieldTechnicianHqWithAbmWithRegionService, adminFetchFieldTechnicianHqByAbmAreaService };
