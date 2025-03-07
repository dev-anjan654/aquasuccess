const {pool} = require("../../config/config");

// FieldTechnicianDailyVisitReportService.js
async function addDailyVisitReportService(dvrData, detailsData) {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        
        // Insert into tbl_daily_visit_report
        const [reportResult] = await connection.execute(
            `INSERT INTO tbl_daily_visit_report (
                dvr_user_id, dvr_hq, dvr_date, dvr_working_day_no, dvr_cum_working_day_no,
                dvr_name, dvr_hq_name, dvr_km_traveled, dvr_cum_km_traveled, dvr_order_value,
                dvr_cum_order_value, dvr_area_visited, dvr_route_no, dvr_total_customer_visit,
                dvr_cum_total_customer_visit, dvr_agent_visit, dvr_cum_agent_visit, dvr_call_avg_cust_day
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                dvrData.dvr_user_id, dvrData.dvr_hq, dvrData.dvr_date, dvrData.dvr_working_day_no,
                dvrData.dvr_cum_working_day_no, dvrData.dvr_name, dvrData.dvr_hq_name,
                dvrData.dvr_km_traveled, dvrData.dvr_cum_km_traveled, dvrData.dvr_order_value,
                dvrData.dvr_cum_order_value, dvrData.dvr_area_visited, dvrData.dvr_route_no,
                dvrData.dvr_total_customer_visit, dvrData.dvr_cum_total_customer_visit,
                dvrData.dvr_agent_visit, dvrData.dvr_cum_agent_visit, dvrData.dvr_call_avg_cust_day
            ]
        );
        const dvrId = reportResult.insertId;

        // Insert into tbl_daily_visit_report_details
        for (const detail of detailsData) {
            await connection.execute(
                `INSERT INTO tbl_daily_visit_report_details (
                    dvr_daily_visit_id, dvr_customer_agent_id, dvr_visit_time, dvr_order_value, dvr_cum_cust_order_value
                ) VALUES (?, ?, ?, ?, ?)`,
                [dvrId, detail.client_id, detail.visitingTime, detail.orderValue, detail.cum_order_value]
            );
        }

        await connection.commit();
        return { message: "Daily visit report created successfully!", success: true };
    } catch (error) {
        if (connection) await connection.rollback();
        return { success: false, message: error.message };
    } finally {
        if (connection) connection.release();
    }
}


async function calculateWorkingDays(userId, hqId, targetDate) {
    let connection;
    try {
        connection = await pool.getConnection();
        const firstDayOfMonth = new Date(targetDate);
        firstDayOfMonth.setDate(1);
        
        const [rows] = await connection.execute(
            `SELECT IFNULL(SUM(dvr_working_day_no), 0) AS TotalWorkingDays 
             FROM tbl_daily_visit_report 
             WHERE dvr_user_id = ? AND dvr_hq = ? AND dvr_date BETWEEN ? AND ?`,
            [userId, hqId, firstDayOfMonth.toISOString().split('T')[0], targetDate]
        );
        return { TotalWorkingDays: rows[0].TotalWorkingDays };
    } catch (error) {
        throw new Error(error.message);
    } finally {
        if (connection) connection.release();
    }
}



async function calculateTotalKmTraveled(userId, hqId, targetDate) {
    let connection;
    try {
        connection = await pool.getConnection();

        // Convert target_date to the first day of the month
        const firstDayOfMonth = new Date(targetDate);
        firstDayOfMonth.setDate(1);
        const formattedFirstDay = firstDayOfMonth.toISOString().split('T')[0];

        // Determine the end date
        const formattedEndDate = targetDate === formattedFirstDay ? formattedFirstDay : targetDate;

        // Query to fetch total km traveled
        const [rows] = await connection.execute(
            `SELECT IFNULL(SUM(dvr_km_traveled), 0) AS TotalKmTraveled 
             FROM tbl_daily_visit_report 
             WHERE dvr_user_id = ? 
               AND dvr_hq = ? 
               AND dvr_date BETWEEN ? AND ?`,
            [userId, hqId, formattedFirstDay, formattedEndDate]
        );

        return { TotalKmTraveled: rows[0].TotalKmTraveled || 0 };
    } catch (error) {
        throw new Error(error.message);
    } finally {
        if (connection) connection.release();
    }
}



async function calculateTotalOrderValues(user_id, hq_id, target_date) {
    try {
        const connection = await pool.getConnection();
        try {
            const [rows] = await connection.query(`
                SELECT IFNULL(SUM(dvr_order_value), 0) AS TotalOrderValues
                FROM tbl_daily_visit_report
                WHERE dvr_user_id = ? 
                AND dvr_hq = ?
                AND dvr_date BETWEEN 
                    DATE_FORMAT(?, '%Y-%m-01') 
                    AND ?
            `, [user_id, hq_id, target_date, target_date]);

            return { TotalOrderValues: rows[0].TotalOrderValues };
        } finally {
            connection.release();
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

const calculateTotalAgentVisit = async (user_id, hq_id, target_date) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // Convert target_date to first day of the month
        const targetDateObj = new Date(target_date);
        const firstDayOfMonth = new Date(targetDateObj.getFullYear(), targetDateObj.getMonth(), 1);
        const formattedFirstDayOfMonth = firstDayOfMonth.toISOString().split("T")[0];

        // Determine the end date for calculation
        const endDate = target_date === formattedFirstDayOfMonth ? formattedFirstDayOfMonth : target_date;

        // Query to calculate total agent visits
        const query = `
            SELECT IFNULL(SUM(dvr_agent_visit), 0) AS TotalAgentVisit
            FROM tbl_daily_visit_report
            WHERE dvr_user_id = ? 
              AND dvr_hq = ?
              AND dvr_date BETWEEN ? AND ?
        `;

        const [rows] = await connection.execute(query, [user_id, hq_id, formattedFirstDayOfMonth, endDate]);

        return { TotalAgentVisit: rows[0].TotalAgentVisit };

    } catch (error) {
        throw new Error(error.message);
    } finally {
        if (connection) connection.release();
    }
};




const calculateTotalCustomerVisit = async (user_id, hq_id, target_date) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const firstDayOfMonth = new Date(target_date);
        firstDayOfMonth.setDate(1);
        const firstDayOfMonthStr = firstDayOfMonth.toISOString().split('T')[0];
        const endDate = target_date === firstDayOfMonthStr ? firstDayOfMonthStr : target_date;

        const query = `
            SELECT IFNULL(SUM(dvr_total_customer_visit), 0) AS TotalCustomerVisit
            FROM tbl_daily_visit_report
            WHERE dvr_user_id = ? 
              AND dvr_hq = ?
              AND dvr_date BETWEEN ? AND ?
        `;
        const [rows] = await connection.execute(query, [user_id, hq_id, firstDayOfMonthStr, endDate]);

        return { TotalCustomerVisit: rows[0].TotalCustomerVisit };
    } catch (error) {
        throw new Error(error.message);
    } finally {
        if (connection) connection.release();
    }
};

const fetchTourPlanOnDailyReportService = async (target_date, user_id, hq_id) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // ✅ Calculate the first day of the month
        const firstDayOfMonth = new Date(target_date);
        firstDayOfMonth.setDate(1);
        const start_date = firstDayOfMonth.toISOString().split('T')[0];
        const end_date = target_date;

        // ✅ Fetch aggregated order values
        const aggregatedQuery = `
            SELECT 
                rd.dvr_customer_agent_id,
                SUM(rd.dvr_order_value) AS TotalOrderValue
            FROM 
                tbl_daily_visit_report r
            INNER JOIN 
                tbl_daily_visit_report_details rd 
                ON r.id = rd.dvr_daily_visit_id
            WHERE 
                r.dvr_user_id = ? 
                AND r.dvr_hq = ?
                AND r.dvr_date BETWEEN ? AND ?
            GROUP BY 
                rd.dvr_customer_agent_id
            ORDER BY 
                r.id DESC
        `;
        const [aggregatedResults] = await conn.execute(aggregatedQuery, [user_id, hq_id, start_date, end_date]);

        // ✅ Store aggregated data in a dictionary
        const aggregatedData = {};
        aggregatedResults.forEach(row => {
            aggregatedData[row.dvr_customer_agent_id] = row.TotalOrderValue;
        });

        // ✅ Fetch client data
        const tourPlanQuery = `
            SELECT 
                tpd.client_id,
                cd.DistributionId,
                td.DistributionType,
                tp.route_id,
                rn.route_name,
                cd.ClientTypeId,
                ct.client_type,
                cd.OwnerName,
                cd.NameOfFarmer,
                cd.PhoneNumber1
            FROM 
                tbl_tour_plan_details tpd
            JOIN 
                tbl_tour_plan tp 
                ON tpd.tour_plan_id = tp.id
            JOIN 
                tbl_client_details cd
                ON tpd.client_id = cd.id
            LEFT JOIN 
                tbl_client_type ct
                ON cd.ClientTypeId = ct.id
            JOIN 
                tbl_distribution td
                ON cd.DistributionId = td.id
            JOIN 
                tbl_route rn 
                ON rn.id = tp.route_id
            WHERE 
                tp.FieldTechnicianId = ? 
                AND tp.holidays_dates = ? 
                AND tp.hq_id = ?
        `;
        const [rows] = await conn.execute(tourPlanQuery, [user_id, target_date, hq_id]);

        if (rows.length > 0) {
            const route_name = rows[0].route_name;
            const route_id = rows[0].route_id;

            const clientData = rows.map(row => ({
                client_id: row.client_id,
                client_type: row.client_type || null,
                DistributionType: row.DistributionType,
                DistributionId: row.DistributionId,
                OwnerName: row.OwnerName,
                NameOfFarmer: row.NameOfFarmer,
                PhoneNumber: row.PhoneNumber1,
                total_order_value: aggregatedData[row.client_id] || 0
            }));

            return {
                status: 200,               
                success: true,
                route_name,
                route_id,
                client_plane: clientData
            };
        } else {
            return {
                status: 404,
                data: { success: false, message: "No client details found for the given parameters" }
            };
        }
    } catch (error) {
        return { status: 400, data: { success: false, message: error.message } };
    } finally {
        if (conn) conn.release();
    }
};




// Service: Fetch daily visit reports
const fieldTechnicianDailyVisitReportService = async (userId, hqId) => {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const query = `
            SELECT id, dvr_user_id, dvr_hq, dvr_date, dvr_working_day_no, dvr_cum_working_day_no, 
                   dvr_name, dvr_hq_name, dvr_km_traveled, dvr_cum_km_traveled, dvr_order_value, 
                   dvr_cum_order_value, dvr_area_visited, dvr_route_no, dvr_total_customer_visit, 
                   dvr_cum_total_customer_visit, dvr_agent_visit, dvr_cum_agent_visit, 
                   dvr_call_avg_cust_day, CreationDate
            FROM tbl_daily_visit_report
            WHERE dvr_user_id = ? AND dvr_hq = ? 
            ORDER BY id DESC`;
        
        const [rows] = await connection.execute(query, [userId, hqId]);
        
        const dailyVisitReports = rows.map(row => ({
            id: row.id,
            user_id: row.dvr_user_id,
            hq_id: row.dvr_hq,
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
        }));

        return { success: true, daily_visit_reports: dailyVisitReports };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (connection) connection.release();
    }
};

async function fieldTechnicianDailyVisitReportFetchByIdService(dvrDailyVisitId) {
    let conn;
    try {
        conn = await pool.getConnection();

        const query = `
            SELECT 
                dvr.id,
                dvr.dvr_customer_agent_id AS customer_agent_id,
                c.DistributionId AS distribution_id,
                d.DistributionType AS distribution_type,
                c.NameOfShop AS name_of_shop,
                c.OwnerName AS owner_name,
                c.PhoneNumber1 AS phone_number,
                c.ClientTypeId AS client_type_id,
                ct.client_type AS client_type,
                c.NameOfFarmer AS name_of_farmer,
                TIME_FORMAT(dvr.dvr_visit_time, '%H:%i:%s') AS visit_time,
                dvr.dvr_order_value AS order_value,
                dvr.dvr_cum_cust_order_value AS cumulative_order_value,
                DATE_FORMAT(dvr.CreationDate, '%Y-%m-%d') AS creation_date,
                DATE_FORMAT(dvr.ModifiedDate, '%Y-%m-%d') AS modified_date
            FROM tbl_daily_visit_report_details dvr
            INNER JOIN tbl_client_details c ON dvr.dvr_customer_agent_id = c.id
            LEFT JOIN tbl_client_type ct ON c.ClientTypeId = ct.id
            INNER JOIN tbl_distribution d ON c.DistributionId = d.id
            WHERE dvr.dvr_daily_visit_id = ?
            ORDER BY dvr.id DESC
        `;

        const [rows] = await conn.execute(query, [dvrDailyVisitId]);

        if (rows.length === 0) {
            return { success: false, message: 'No visit reports found for the given ID' };
        }

        return { success: true, daily_visit_reports: rows };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
}


module.exports = { addDailyVisitReportService,calculateWorkingDays,calculateTotalKmTraveled,calculateTotalOrderValues,calculateTotalAgentVisit,calculateTotalCustomerVisit,fetchTourPlanOnDailyReportService,fieldTechnicianDailyVisitReportService, fieldTechnicianDailyVisitReportFetchByIdService };