const {pool} = require("../../config/config");

const fetchRbmLeaveApplicationService = async (user_id, region_id) => {
    let conn;
    try {
        conn = await pool.getConnection();
        
        const [employee] = await conn.execute(
            "SELECT 1 FROM tbl_employees WHERE id = ? AND region_id = ?", 
            [user_id, region_id]
        );

        if (employee.length === 0) {
            return { status: 400, data: { message: "No matching employee found with the provided user_id and region_id.", success: false } };
        }

        const query = `
            SELECT 
                la.id, la.user_id, e.emp_name, d.DesignationType, a.AbmArea, e.AbmArea_id, 
                la.reason_of_leave, lt.leave_type, la.from_date, la.to_date, 
                la.leave_status, la.CreationDate
            FROM tbl_leave_application la
            INNER JOIN tbl_employees e ON la.user_id = e.id 
            INNER JOIN tbl_leave_type lt ON la.leave_type = lt.id
            INNER JOIN tbl_abm_area a ON e.AbmArea_id = a.id
            INNER JOIN tbl_designation d ON e.emp_designation_id = d.id
            WHERE e.region_id = ?
            AND (e.FieldTechnicianHq_id IS NULL OR e.FieldTechnicianHq_id = '')
            AND (e.AbmArea_id IS NOT NULL AND e.AbmArea_id != '')
            AND la.hq_id = e.AbmArea_id
        `;

        const [rows] = await conn.execute(query, [region_id]);
        
        const leaveApplications = rows.map(row => ({
            id: row.id,
            emp_name: row.emp_name,
            designation: row.DesignationType,
            abm_area: row.AbmArea,
            user_id: row.user_id,
            abm_area_id: row.AbmArea_id,
            reason_of_leave: row.reason_of_leave,
            leave_type: row.leave_type,
            from_date: row.from_date,
            to_date: row.to_date,
            leave_status: row.leave_status,
            creation_date: row.CreationDate,
        }));

        return { status: 200, data: { leave_applications: leaveApplications, success: true } };
    } catch (error) {
        return { status: 500, data: { message: error.message, success: false } };
    } finally {
        if (conn) conn.release();
    }
};
const fetchAllRbmLeaveApplicationsService = async (user_id, region_id) => {
    let connection;
    try {
        connection = await pool.getConnection();
        const query = `
        SELECT 
            la.id, la.user_id, la.hq_id, e.emp_name, d.DesignationType, r.region, 
            lt.leave_type, la.leave_type AS leave_type_id, la.reason_of_leave, 
            la.from_date, la.to_date, la.leave_status, la.CreationDate
        FROM tbl_leave_application la
        INNER JOIN tbl_employees e ON la.user_id = e.id
        INNER JOIN tbl_leave_type lt ON la.leave_type = lt.id
        INNER JOIN tbl_region r ON e.region_id = r.id
        INNER JOIN tbl_designation d ON e.emp_designation_id = d.id
        WHERE la.user_id = ? AND la.hq_id = ?`;

        const [rows] = await connection.execute(query, [user_id, region_id]);
        const leaveApplications = rows.map(row => ({
            leave_id: row.id,
            emp_name: row.emp_name,
            designation_type: row.DesignationType,
            region: row.region,
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

module.exports = { fetchRbmLeaveApplicationService,fetchAllRbmLeaveApplicationsService };