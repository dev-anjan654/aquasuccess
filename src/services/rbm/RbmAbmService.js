const {pool} = require("../../config/config");

async function rbmFetchAbmByRegionIdService(regionId) {
    let conn;
    try {
        conn = await pool.getConnection();
        
        const query = `
        SELECT  
            e.id, e.emp_name, e.emp_designation_id, d.DesignationType, 
            e.emp_residential_address, e.emp_city, e.emp_postal_code, 
            e.emp_country, e.emp_same_as_residential_address, 
            e.emp_permanent_address, e.emp_permanent_city, 
            e.emp_permanent_postal_code, e.emp_permanent_country, 
            e.emp_mobile_no1, e.emp_mobile_no2, e.emp_whatsapp_no, 
            e.emp_email_id, e.emp_resi_no1, e.emp_resi_no2, 
            e.emp_dateofjoining, r.region, 
            COALESCE(a.AbmArea, '') AS AbmArea, e.AbmArea_id, 
            COALESCE(t.FieldTechnicianHq, '') AS FieldTechnicianHq,
            e.emp_username, e.CreationDate
        FROM 
            tbl_employees e
        INNER JOIN tbl_designation d ON e.emp_designation_id = d.id
        INNER JOIN tbl_region r ON e.region_id = r.id
        LEFT JOIN tbl_abm_area a ON e.AbmArea_id = a.id  
        LEFT JOIN tbl_field_technician t ON e.FieldTechnicianHq_id = t.id
        WHERE
            e.region_id = ?
            AND (e.FieldTechnicianHq_id IS NULL OR e.FieldTechnicianHq_id = '')
            AND (e.AbmArea_id IS NOT NULL OR e.AbmArea_id != '')
        `;

        const [rows] = await conn.execute(query, [regionId]);
        return { abms: rows };
    } catch (error) {
        return { error: `MySQL error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
}


async function fetchRbmAllRegionByUserIdService(userId) {
    let conn;
    try {
        conn = await pool.getConnection();
        
        const query = `
            SELECT r.region, r.id
            FROM tbl_employees e
            INNER JOIN tbl_region r ON e.region_id = r.id
            WHERE e.id = ?
        `;
        
        const [rows] = await conn.execute(query, [userId]);

        if (rows.length > 0) {
            return { success: true, RegionArea: rows[0].region, id: rows[0].id };
        } else {
            return { success: false, message: "No region found for the given user_id" };
        }
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
}




module.exports = { rbmFetchAbmByRegionIdService,fetchRbmAllRegionByUserIdService };