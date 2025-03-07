const { pool } = require("../../config/config");
const { hashPassword, checkPassword } = require('../../utils/auth');


// Register Service
const adminRegisterService = async (role, username, password) => {
    try {
        const hashedPassword = await hashPassword(password);

        // Insert admin data into the database
        await pool.query(
            "INSERT INTO tbl_admin_register (role, username, password) VALUES (?, ?, ?)",
            [role, username, hashedPassword]
        );

        return { message: 'Admin registered successfully!', success: true };
    } catch (error) {
        return { message: error.message, success: false };
    }
};

// Login Service
const adminLoginService = async (role, username, password) => {
    try {
        const [rows] = await pool.query(
            "SELECT role, password, id FROM tbl_admin_register WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return { message: 'Invalid username!', success: false };
        }

        const dbRole = rows[0].role;
        const hashedPassword = rows[0].password;
        const id = rows[0].id;

        if (dbRole !== role) {
            return { message: 'Role does not match!', success: false };
        }

        const isPasswordValid = await checkPassword(password, hashedPassword);
        if (!isPasswordValid) {
            return { message: 'Invalid password!', success: false };
        }

        return {
            message: 'Login successful',
            user_id: id,
            role: dbRole,
            success: true
        };

    } catch (error) {
        return { message: error.message, success: false };
    }
};

const empLoginService = async (role, username, password) => {
    let connection;
    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute(
            `SELECT id, emp_designation_id, emp_password 
             FROM tbl_employees 
             WHERE emp_designation_id = ? AND emp_username = ?`,
            [role, username]
        );

        if (rows.length === 0) {
            return {
                status: 401,
                message: "Invalid username, password, or role",
                success: false
            };
        }

        const { id, emp_designation_id, emp_password } = rows[0];

        // Validate password
        const isPasswordValid = await checkPassword(password, emp_password);
        if (!isPasswordValid) {
            return {
                status: 401,
                message: "Invalid password!",
                success: false
            };
        }

        return {
            status: 200,
            message: "Login successful",
            success: true,
            user_id: id,
            role: emp_designation_id
        };

    } catch (error) {
        return {
            status: 500,
            message: `Database error: ${error.message}`,
            success: false
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = { adminRegisterService, adminLoginService, empLoginService };
