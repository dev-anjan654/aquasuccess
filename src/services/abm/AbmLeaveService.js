const {pool} = require("../../config/config");

const abmfetchFieldTechnicianLeaveApplicationsService = async (user_id, abm_id) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        // Fetch region_id and AbmArea_id
        const [result] = await connection.execute(
            `SELECT region_id, AbmArea_id FROM tbl_employees WHERE id = ? AND AbmArea_id = ?`,
            [user_id, abm_id]
        );

        if (result.length === 0) {
            return { success: false, message: "No matching employee found with provided user_id and abm_id." };
        }

        const { region_id, AbmArea_id } = result[0];

        // Fetch leave applications
        const [leaveApplications] = await connection.execute(`
            SELECT 
                la.id, la.user_id, la.hq_id, t.FieldTechnicianHq, e.emp_name, d.DesignationType, 
                t.FieldTechnicianHq, lt.leave_type, la.reason_of_leave, 
                la.from_date, la.to_date, la.leave_status, la.CreationDate
            FROM tbl_leave_application la
            INNER JOIN tbl_employees e ON la.user_id = e.id
            INNER JOIN tbl_leave_type lt ON la.leave_type = lt.id
            INNER JOIN tbl_field_technician t ON e.FieldTechnicianHq_id = t.id
            INNER JOIN tbl_designation d ON e.emp_designation_id = d.id
            WHERE t.region_id = ? AND t.AbmArea_id = ? AND la.hq_id = t.id`,
            [region_id, AbmArea_id]
        );

        return { success: true, leave_applications: leaveApplications };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (connection) connection.release();
    }
};

const fetchAbmLeaveApplicationsService = async (user_id, AreaArea_id) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `
            SELECT 
                la.id,
                la.user_id,
                la.hq_id,
                e.emp_name,
                d.DesignationType,
                a.AbmArea,
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
            INNER JOIN tbl_abm_area a ON e.AbmArea_id = a.id
            INNER JOIN tbl_designation d ON e.emp_designation_id = d.id
            WHERE 
                la.user_id = ? AND la.hq_id = ?
        `;

        const [rows] = await connection.execute(query, [user_id, AreaArea_id]);

        const leaveApplications = rows.map(row => ({
            id: row.id,
            emp_name: row.emp_name,
            designation_type: row.DesignationType,
            hq_name: row.AbmArea,
            leave_type: row.leave_type,
            leave_type_id: row.leave_type_id,
            reason_of_leave: row.reason_of_leave,
            from_date: row.from_date,
            to_date: row.to_date,
            leave_status: row.leave_status,
            creation_date: row.CreationDate
        }));

        return { status: 200, data: { leave_applications: leaveApplications, success: true } };

    } catch (error) {
        return { status: 500, data: { message: error.message, success: false } };
    } finally {
        if (connection) connection.release();
    }
};


const updateLeaveApplicationStatus = async (id, user_id, hq_id, leave_status) => {
    let connection;
    try {
        if (!["Approved", "Rejected"].includes(leave_status)) {
            return { success: false, message: "Please provide correct leave status value." };
        }

        connection = await pool.getConnection();

        // Check if the record exists
        const [record] = await connection.execute(
            `SELECT 1 FROM tbl_leave_application WHERE id = ? AND user_id = ? AND hq_id = ?`,
            [id, user_id, hq_id]
        );

        if (record.length === 0) {
            return { success: false, message: "Please provide correct credentials." };
        }

        // Update leave status
        await connection.execute(
            `UPDATE tbl_leave_application SET leave_status = ? WHERE id = ? AND user_id = ? AND hq_id = ?`,
            [leave_status, id, user_id, hq_id]
        );

        return { success: true, message: `Leave status updated to ${leave_status} successfully.` };

    } catch (error) {
        return { success: false, message: `MySQL error: ${error.message}` };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = {
    abmfetchFieldTechnicianLeaveApplicationsService,
    updateLeaveApplicationStatus,
    fetchAbmLeaveApplicationsService
};
