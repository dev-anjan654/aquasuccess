const { pool } = require("../../config/config");
const bcrypt = require("bcryptjs");

const adminFetchEmployeesService = async () => {
    try {
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
            r.id AS region_id,
            COALESCE(a.AbmArea, '') AS AbmArea,
            a.id AS AbmArea_id,
            COALESCE(t.FieldTechnicianHq, '') AS FieldTechnicianHq,
            t.id AS FieldTechnicianHq_id,
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
        `;

        const [rows] = await pool.query(query);

        // Format date function
        const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : null;

        const employees = rows.map(row => ({
            id: row.id,
            emp_name: row.emp_name,
            DesignationId: row.emp_designation_id,
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
            region_id: row.region_id,
            AbmArea: row.AbmArea,
            AbmArea_id: row.AbmArea_id,
            FieldTechnicianHq: row.FieldTechnicianHq,
            FieldTechnicianHq_id: row.FieldTechnicianHq_id,
            emp_username: row.emp_username,
            CreationDate: formatDate(row.CreationDate)
        }));

        return { success: true, fetch_employees: employees };
    } catch (error) {
        console.error("Database error:", error);
        return { success: false, error: error.message };
    }
};

const adminInsertEmployeesService = async (employeeData) => {
    try {
        const connection = await pool.getConnection();
        const [existingEmail] = await connection.execute(
            "SELECT 1 FROM tbl_employees WHERE emp_email_id = ?",
            [employeeData.emp_email_id]
        );

        if (existingEmail.length > 0) {
            connection.release();
            return { success: false, message: "Email ID already exists." };
        }

        const [existingUsername] = await connection.execute(
            "SELECT 1 FROM tbl_employees WHERE emp_username = ?",
            [employeeData.emp_username]
        );

        if (existingUsername.length > 0) {
            connection.release();
            return { success: false, message: "Username already exists." };
        }

        // Validate foreign keys
        const foreignKeys = [
            { key: "region_id", table: "tbl_region", value: employeeData.region_id },
            { key: "AbmArea_id", table: "tbl_abm_area", value: employeeData.AbmArea_id },
            { key: "FieldTechnicianHq_id", table: "tbl_field_technician", value: employeeData.FieldTechnicianHq_id },
        ];

        for (let { key, table, value } of foreignKeys) {
            if (value) {
                const [fkCheck] = await connection.execute(
                    `SELECT 1 FROM ${table} WHERE id = ?`,
                    [value]
                );
                if (fkCheck.length === 0) {
                    connection.release();
                    return { success: false, message: `${key} does not exist.` };
                }
            }
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(employeeData.emp_password, 10);

        // If permanent address is the same as residential, copy values
        if (employeeData.emp_same_as_residential_address === 1) {
            employeeData.emp_permanent_address = employeeData.emp_residential_address;
            employeeData.emp_permanent_city = employeeData.emp_city;
            employeeData.emp_permanent_postal_code = employeeData.emp_postal_code;
            employeeData.emp_permanent_country = employeeData.emp_country;
        }

        // Ensure no undefined values
        const safeValues = [
            employeeData.emp_name || null,
            employeeData.emp_designation_id || null,
            employeeData.emp_residential_address || null,
            employeeData.emp_city || null,
            employeeData.emp_postal_code || null,
            employeeData.emp_country || null,
            employeeData.emp_same_as_residential_address || 0,
            employeeData.emp_permanent_address || null,
            employeeData.emp_permanent_city || null,
            employeeData.emp_permanent_postal_code || null,
            employeeData.emp_permanent_country || null,
            employeeData.emp_mobile_no1 || null,
            employeeData.emp_mobile_no2 || 0,
            employeeData.emp_whatsapp_no || 0,
            employeeData.emp_email_id || null,
            employeeData.emp_resi_no1 || 0,
            employeeData.emp_resi_no2 || 0,
            employeeData.emp_dateofjoining || null,
            employeeData.region_id || null,
            employeeData.AbmArea_id || null,
            employeeData.FieldTechnicianHq_id || null,
            employeeData.emp_username || null,
            hashedPassword || null,
        ];

        const insertQuery = `
            INSERT INTO tbl_employees (
                emp_name, emp_designation_id, emp_residential_address, emp_city, emp_postal_code,
                emp_country, emp_same_as_residential_address, emp_permanent_address, emp_permanent_city,
                emp_permanent_postal_code, emp_permanent_country, emp_mobile_no1,
                emp_mobile_no2, emp_whatsapp_no, emp_email_id, emp_resi_no1,
                emp_resi_no2, emp_dateofjoining, region_id, AbmArea_id,
                FieldTechnicianHq_id, emp_username, emp_password
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(insertQuery, safeValues);
        connection.release();
        return { success: true, message: "Employee inserted successfully." };

    } catch (error) {
        console.error("Database Insert Error:", error);
        return { success: false, message: `Error: ${error.message}` };
    }
};

async function adminUpdateEmployeesService(employeeData) {
    let conn;
    try {
        if (!employeeData.id) {
            return { success: false, message: "Employee ID is required for update." };
        }

        conn = await pool.getConnection();
        const updateId = employeeData.id;
        const modifiedDate = new Date();

        // If permanent address is the same as residential, copy values
        if (employeeData.emp_same_as_residential_address === 1) {
            employeeData.emp_permanent_address = employeeData.emp_residential_address;
            employeeData.emp_permanent_city = employeeData.emp_city;
            employeeData.emp_permanent_postal_code = employeeData.emp_postal_code;
            employeeData.emp_permanent_country = employeeData.emp_country;
        }

        // Check if password needs to be hashed
        let hashedPassword = null;
        if (employeeData.emp_password) {
            hashedPassword = await bcrypt.hash(employeeData.emp_password, 10);
        }

        // Ensure no undefined values
        const safeValues = [
            employeeData.emp_name || null,
            employeeData.emp_designation_id || null,
            employeeData.emp_residential_address || null,
            employeeData.emp_city || null,
            employeeData.emp_postal_code || null,
            employeeData.emp_country || null,
            employeeData.emp_same_as_residential_address || 0,
            employeeData.emp_permanent_address || null,
            employeeData.emp_permanent_city || null,
            employeeData.emp_permanent_postal_code || null,
            employeeData.emp_permanent_country || null,
            employeeData.emp_mobile_no1 || null,
            employeeData.emp_mobile_no2 || 0,
            employeeData.emp_whatsapp_no || 0,
            employeeData.emp_email_id || null,
            employeeData.emp_resi_no1 || 0,
            employeeData.emp_resi_no2 || 0,
            employeeData.emp_dateofjoining || null,
            employeeData.region_id || null,
            employeeData.AbmArea_id || null,
            employeeData.FieldTechnicianHq_id || null,
            modifiedDate,
            updateId
        ];

        // Update query
        const updateQuery = `
            UPDATE tbl_employees SET 
                emp_name = ?, emp_designation_id = ?, emp_residential_address = ?, 
                emp_city = ?, emp_postal_code = ?, emp_country = ?, 
                emp_same_as_residential_address = ?, emp_permanent_address = ?, 
                emp_permanent_city = ?, emp_permanent_postal_code = ?, 
                emp_permanent_country = ?, emp_mobile_no1 = ?, emp_mobile_no2 = ?, 
                emp_whatsapp_no = ?, emp_email_id = ?, emp_resi_no1 = ?, 
                emp_resi_no2 = ?, emp_dateofjoining = ?, region_id = ?, 
                AbmArea_id = ?, FieldTechnicianHq_id = ?, ModifiedDate = ?
            WHERE id = ?`;

        const [result] = await conn.execute(updateQuery, safeValues);

        if (result.affectedRows === 0) {
            return { success: false, message: "No changes were found." };
        }

        return { success: true, message: "Employee updated successfully." };
    } catch (error) {
        console.error("Error in adminUpdateEmployeesService:", error);
        return { success: false, message: `Unexpected error: ${error.message}` };
    } finally {
        if (conn) conn.release();
    }
}

const adminEmployeesUpdateCredentialsService = async (emp_id, emp_username, emp_password) => {
    let connection;
    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(emp_password, 10);

        connection = await pool.getConnection();

        const query = `
            UPDATE tbl_employees 
            SET emp_username = ?, emp_password = ?, ModifiedDate = NOW()
            WHERE id = ?
        `;

        const [result] = await connection.execute(query, [emp_username, hashedPassword, emp_id]);

        connection.release();

        if (result.affectedRows > 0) {
            return { success: true, message: "Employee credentials updated successfully!" };
        } else {
            return { success: false, message: "No employee found with the given ID." };
        }
    } catch (error) {
        if (connection) connection.release();
        return { success: false, error: error.message };
    }
};
module.exports = { adminFetchEmployeesService,adminInsertEmployeesService,adminUpdateEmployeesService,adminEmployeesUpdateCredentialsService };

