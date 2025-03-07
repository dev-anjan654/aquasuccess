const {pool} = require('../../config/config');

async function adminFetchFieldTechnicianDailyVisitReport() {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const query = `
        SELECT dvr.id, e.region_id, tg.region, e.AbmArea_id, a.AbmArea,
               dvr.dvr_user_id, dvr.dvr_hq, dvr.dvr_date, 
               dvr.dvr_working_day_no, dvr.dvr_cum_working_day_no,
               dvr.dvr_name, dvr.dvr_hq_name, dvr.dvr_km_traveled,
               dvr.dvr_cum_km_traveled, dvr.dvr_order_value, 
               dvr.dvr_cum_order_value, dvr.dvr_area_visited, 
               dvr.dvr_route_no, dvr.dvr_total_customer_visit, 
               dvr.dvr_cum_total_customer_visit, dvr.dvr_agent_visit, 
               dvr.dvr_cum_agent_visit, dvr.dvr_call_avg_cust_day, 
               dvr.CreationDate, dvr.ModifiedDate
        FROM tbl_daily_visit_report dvr
        INNER JOIN tbl_employees e ON dvr.dvr_user_id = e.id
        INNER JOIN tbl_region tg ON e.region_id = tg.id
        INNER JOIN tbl_abm_area a ON e.AbmArea_id = a.id
        AND dvr.dvr_hq = e.FieldTechnicianHq_id;
        `;
        
        const [rows] = await connection.execute(query);
        
        return {
            success: true,
            daily_visit_reports: rows.map(row => ({
                id: row.id,
                user_id: row.dvr_user_id,
                hq_id: row.dvr_hq,
                region_id: row.region_id,
                dvr_region: row.region,
                AbmArea_id: row.AbmArea_id,
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
                creation_date: row.CreationDate
            }))
        };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { adminFetchFieldTechnicianDailyVisitReport };