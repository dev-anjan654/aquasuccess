const { pool } = require("../../config/config");

// Fetch RBM leave applications
const adminFetchRBMLeaveApplicationsService = async () => {
    try {
        const query = `
            SELECT 
                la.id,
                la.user_id,
                e.region_id,
                r.region,
                e.emp_name,
                e.emp_designation_id,
                d.DesignationType,
                la.reason_of_leave,
                lt.leave_type,
                la.from_date,
                la.to_date,
                la.leave_status,
                la.CreationDate
            FROM 
                tbl_leave_application la
            INNER JOIN 
                tbl_employees e ON la.user_id = e.id
            INNER JOIN 
                tbl_leave_type lt ON la.leave_type = lt.id
            INNER JOIN
                tbl_region r ON e.region_id = r.id
            INNER JOIN 
                tbl_designation d ON e.emp_designation_id = d.id
            WHERE 
                d.DesignationType LIKE 'Rbm%' OR 
                d.DesignationType LIKE 'RBM%' OR 
                d.DesignationType LIKE 'rbm%' OR 
                d.DesignationType LIKE 'r%';
        `;

        // Execute query
        const [rows] = await pool.execute(query);

        // Process results
        const leaveApplications = rows.map(row => ({
            id: row.id,
            user_id: row.user_id,
            region_id: row.region_id,
            region: row.region,
            emp_name: row.emp_name,
            emp_designation_id: row.emp_designation_id,
            designation_type: row.DesignationType,
            reason_of_leave: row.reason_of_leave,
            leave_type: row.leave_type,
            from_date: row.from_date,
            to_date: row.to_date,
            leave_status: row.leave_status,
            creation_date: row.CreationDate
        }));

        return { success: true, leave_applications: leaveApplications };

    } catch (error) {
        return { success: false, message: `Database error: ${error.message}` };
    }
};

module.exports = { adminFetchRBMLeaveApplicationsService };
