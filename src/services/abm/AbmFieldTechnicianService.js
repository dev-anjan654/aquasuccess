const {pool} = require("../../config/config");

// Utility function for date formatting
const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0]; // YYYY-MM-DD format
};

const abmFetchFieldTechnicianHqService = async (AbmArea_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        const query = `
            SELECT  
                e.id,
                e.emp_name,
                e.emp_designation_id,
                d.DesignationType,
                e.emp_residential_address,
                e.emp_city,
                e.emp_postal_code,
                e.emp_country,
                e.emp_same_as_residential_address,
                e.emp_permanent_address,
                e.emp_permanent_city,
                e.emp_permanent_postal_code,
                e.emp_permanent_country,
                e.emp_mobile_no1,
                e.emp_mobile_no2,
                e.emp_whatsapp_no,
                e.emp_email_id,
                e.emp_resi_no1,
                e.emp_resi_no2,
                e.emp_dateofjoining,
                r.region,
                COALESCE(a.AbmArea, '') AS AbmArea,
                COALESCE(t.FieldTechnicianHq, '') AS FieldTechnicianHq,
                e.emp_username,
                e.CreationDate
            FROM 
                tbl_employees e
            INNER JOIN 
                tbl_designation d ON e.emp_designation_id = d.id
            INNER JOIN 
                tbl_region r ON e.region_id = r.id
            LEFT JOIN 
                tbl_abm_area a ON e.AbmArea_id = a.id
            LEFT JOIN 
                tbl_field_technician t ON e.FieldTechnicianHq_id = t.id
            WHERE 
                e.AbmArea_id = ? 
                AND (e.FieldTechnicianHq_id IS NOT NULL AND e.FieldTechnicianHq_id != '')
        `;

        // Execute query
        const [rows] = await conn.execute(query, [AbmArea_id]);

        // Format and return data
        const technicians = rows.map(row => ({
            id: row.id,
            emp_name: row.emp_name,
            emp_designation_id: row.emp_designation_id,
            DesignationType: row.DesignationType,
            emp_residential_address: row.emp_residential_address,
            emp_city: row.emp_city,
            emp_postal_code: row.emp_postal_code,
            emp_country: row.emp_country,
            emp_same_as_residential_address: row.emp_same_as_residential_address,
            emp_permanent_address: row.emp_permanent_address,
            emp_permanent_city: row.emp_permanent_city,
            emp_permanent_postal_code: row.emp_permanent_postal_code,
            emp_permanent_country: row.emp_permanent_country,
            emp_mobile_no1: row.emp_mobile_no1,
            emp_mobile_no2: row.emp_mobile_no2,
            emp_whatsapp_no: row.emp_whatsapp_no,
            emp_email_id: row.emp_email_id,
            emp_resi_no1: row.emp_resi_no1,
            emp_resi_no2: row.emp_resi_no2,
            emp_dateofjoining: formatDate(row.emp_dateofjoining),
            region: row.region,
            AbmArea: row.AbmArea,
            FieldTechnicianHq: row.FieldTechnicianHq,
            emp_username: row.emp_username,
            CreationDate: formatDate(row.CreationDate)
        }));

        return { success: true, data: technicians };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { abmFetchFieldTechnicianHqService };
