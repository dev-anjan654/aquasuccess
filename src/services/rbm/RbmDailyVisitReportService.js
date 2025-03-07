const {pool} = require("../../config/config");

const rbmFetchFieldTechnicianDailyVisitReportService = async (region_id, user_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Check if user exists
        const [userExists] = await conn.execute(
            "SELECT 1 FROM tbl_employees WHERE id = ? AND region_id = ?",
            [user_id, region_id]
        );

        if (userExists.length === 0) {
            return { status: 400, data: { message: "No matching employee found with the provided user_id and region_id." } };
        }

        // Fetch daily visit report data
        const query = `
            SELECT 
                e.id AS user_id, 
                ft.id AS hq_id,
                e.AbmArea_id,
                a.AbmArea,
                dvr.id AS dvr_id,
                dvr.dvr_user_id,
                dvr.dvr_hq,
                dvr.dvr_date,
                dvr.dvr_working_day_no,
                dvr.dvr_cum_working_day_no,
                dvr.dvr_name,
                dvr.dvr_hq_name,
                dvr.dvr_km_traveled,
                dvr.dvr_cum_km_traveled,
                dvr.dvr_order_value,
                dvr.dvr_cum_order_value,
                dvr.dvr_area_visited,
                dvr.dvr_route_no,
                dvr.dvr_total_customer_visit,
                dvr.dvr_cum_total_customer_visit,
                dvr.dvr_agent_visit,
                dvr.dvr_cum_agent_visit,
                dvr.dvr_call_avg_cust_day,
                dvr.CreationDate,
                dvr.ModifiedDate
            FROM tbl_employees e
            INNER JOIN tbl_field_technician ft ON e.FieldTechnicianHq_id = ft.id
            INNER JOIN tbl_abm_area a ON e.AbmArea_id = a.id
            LEFT JOIN tbl_daily_visit_report dvr ON dvr.dvr_user_id = e.id AND dvr.dvr_hq = ft.id
            WHERE e.region_id = ?
            AND (e.FieldTechnicianHq_id IS NOT NULL AND e.FieldTechnicianHq_id != '')
            AND (e.AbmArea_id IS NOT NULL AND e.AbmArea_id != '')
            AND (
                (dvr.dvr_user_id IS NOT NULL AND dvr.dvr_hq IS NOT NULL)
                OR
                (dvr.dvr_user_id = ? AND dvr.dvr_hq = ft.id)
            )
        `;

        const [rows] = await conn.execute(query, [region_id, user_id]);

        const dailyVisitReports = rows.map(row => ({
            user_id: row.user_id,
            hq_id: row.hq_id,
            id: row.dvr_id,
            dvr_AbmArea_id: row.AbmArea_id,
            dvr_AbmArea: row.AbmArea,
            dvr_date: row.dvr_date,
            dvr_working_day_no: row.dvr_working_day_no,
            dvr_cum_working_day_no: row.dvr_cum_working_day_no,
            dvr_name: row.dvr_name,
            dvr_hq_name: row.dvr_hq_name,
            dvr_km_traveled: row.dvr_km_traveled,
            dvr_cum_km_traveled: row.dvr_cum_km_traveled,
            dvr_order_value: row.dvr_order_value,
            dvr_cum_order_value: row.dvr_cum_order_value,
            dvr_area_visited: row.dvr_area_visited,
            dvr_route_no: row.dvr_route_no,
            dvr_total_customer_visit: row.dvr_total_customer_visit,
            dvr_cum_total_customer_visit: row.dvr_cum_total_customer_visit,
            dvr_agent_visit: row.dvr_agent_visit,
            dvr_cum_agent_visit: row.dvr_cum_agent_visit,
            dvr_call_avg_cust_day: row.dvr_call_avg_cust_day,
            creation_date: row.CreationDate,
        }));

        return { status: 200, daily_visit_reports: dailyVisitReports, success: true };
    } catch (error) {
        return { status: 400, data: { message: error.message, success: false } };
    } finally {
        if (conn) conn.release();
    }
};

module.exports = { rbmFetchFieldTechnicianDailyVisitReportService };
