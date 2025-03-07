const {pool} = require("../../config/config");


async function abmFetchFieldTechnicianDailyVisitReportService(user_id, abm_id) {
    let conn;
    try {
        conn = await pool.getConnection();

        // Fetch region_id and AbmArea_id
        const [rows] = await conn.execute(
            `SELECT region_id, AbmArea_id FROM tbl_employees WHERE id = ? AND AbmArea_id = ?`,
            [user_id, abm_id]
        );
        
        if (rows.length === 0) {
            return { success: false, message: "No matching employee found with provided user_id and abm_id." };
        }

        const { region_id, AbmArea_id } = rows[0];

        // Fetch daily visit report data
        const [reports] = await conn.execute(
            `SELECT dvr.id, dvr.dvr_user_id, dvr.dvr_hq, e.emp_name, d.DesignationType, t.FieldTechnicianHq, 
                    dvr.dvr_date, dvr.dvr_working_day_no, dvr.dvr_cum_working_day_no, dvr.dvr_name, 
                    dvr.dvr_hq_name, dvr.dvr_km_traveled, dvr.dvr_cum_km_traveled, dvr.dvr_order_value, 
                    dvr.dvr_cum_order_value, dvr.dvr_area_visited, dvr.dvr_route_no, 
                    dvr.dvr_total_customer_visit, dvr.dvr_cum_total_customer_visit, dvr.dvr_agent_visit, 
                    dvr.dvr_cum_agent_visit, dvr.dvr_call_avg_cust_day, dvr.CreationDate, dvr.ModifiedDate 
             FROM tbl_daily_visit_report dvr 
             INNER JOIN tbl_employees e ON dvr.dvr_user_id = e.id 
             INNER JOIN tbl_field_technician t ON e.FieldTechnicianHq_id = t.id 
             INNER JOIN tbl_designation d ON e.emp_designation_id = d.id 
             WHERE t.region_id = ? AND t.AbmArea_id = ? AND dvr.dvr_hq = t.id`,
            [region_id, AbmArea_id]
        );

        return { success: true, daily_visit_reports: reports };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
}

module.exports = { abmFetchFieldTechnicianDailyVisitReportService };