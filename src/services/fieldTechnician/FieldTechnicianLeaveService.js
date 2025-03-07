const {pool} = require("../../config/config");

// Function to fetch leave types
async function fieldTechnicianLeaveTypeFetchService() {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = "SELECT id, leave_type FROM tbl_leave_type";

        const [rows] = await conn.execute(query);

        const leave_types = rows.map(row => ({
            id: row.id,
            leave_type: row.leave_type
        }));

        return { status: 200, data: { leave_types } };

    } catch (error) {
        console.error("Database Error:", error);
        return { status: 500, data: { message: error.message } };

    } finally {
        if (conn) conn.release(); // Release the connection back to the pool
    }
}

// Function to insert a leave application
async function fieldTechnicianLeaveApplicationInsertService(user_id, hq_id, leave_type, reason_of_leave, from_date, to_date, leave_status = "Pending") {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
            INSERT INTO tbl_leave_application (
                user_id, hq_id, leave_type, reason_of_leave, from_date, to_date, leave_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await conn.execute(query, [user_id, hq_id, leave_type, reason_of_leave, from_date, to_date, leave_status]);

        return { success: true, message: "Leave application submitted successfully!" };

    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, message: `Database error: ${error.message}` };

    } finally {
        if (conn) conn.release(); // Release the connection back to the pool
    }
}

async function fieldTechnicianLeaveApplicationUpdateService(leave_id, user_id, hq_id, leave_type, reason_of_leave, leave_status, from_date, to_date) {
    try {
        const connection = await pool.getConnection();
        const query = `
            UPDATE tbl_leave_application 
            SET leave_type = ?, reason_of_leave = ?, leave_status = ?, 
                from_date = ?, to_date = ?, ModifiedDate = NOW()
            WHERE id = ? AND user_id = ? AND hq_id = ?`;

        const [result] = await connection.execute(query, [leave_type, reason_of_leave, leave_status, from_date, to_date, leave_id, user_id, hq_id]);
        connection.release();

        if (result.affectedRows > 0) {
            return { success: true, message: "Leave application updated successfully!" };
        } else {
            return { success: false, message: "No record found to update!" };
        }
    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    }
}

async function fetchFieldTechnicianLeaveApplicationsService(userId, hqId) {
    let connection;
    try {
        if (!userId || !hqId) {
            return { success: false, message: "user_id and hq_id are required!" };
        }

        connection = await pool.getConnection();
        
        const query = `
            SELECT 
                la.id,
                e.emp_name,
                d.DesignationType,
                t.FieldTechnicianHq,
                lt.leave_type,
                la.leave_type AS leave_type_id,
                la.reason_of_leave,
                la.from_date,
                la.to_date,
                la.leave_status,
                la.CreationDate
            FROM 
                tbl_leave_application la
            INNER JOIN tbl_employees e ON la.user_id = e.id
            INNER JOIN tbl_leave_type lt ON la.leave_type = lt.id
            INNER JOIN tbl_field_technician t ON e.FieldTechnicianHq_id = t.id
            INNER JOIN tbl_designation d ON e.emp_designation_id = d.id
            WHERE 
                la.user_id = ? AND la.hq_id = ?
        `;

        const [rows] = await connection.execute(query, [userId, hqId]);

        const leaveApplications = rows.map(row => ({
            id: row.id,
            emp_name: row.emp_name,
            designation_type: row.DesignationType,
            hq: row.FieldTechnicianHq,
            leave_type: row.leave_type,
            leave_type_id: row.leave_type_id,
            reason_of_leave: row.reason_of_leave,
            from_date: formatDate(row.from_date),
            to_date: formatDate(row.to_date),
            leave_status: row.leave_status,
            creation_date: formatDate(row.CreationDate)
        }));

        return { success: true, leave_applications: leaveApplications };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (connection) connection.release();
    }
}

// Function to format date
function formatDate(date) {
    if (!date) return null;
    return new Date(date).toISOString().split('T')[0]; // Format: YYYY-MM-DD
}

module.exports = { fieldTechnicianLeaveTypeFetchService,fieldTechnicianLeaveApplicationInsertService,fieldTechnicianLeaveApplicationUpdateService,fetchFieldTechnicianLeaveApplicationsService };
