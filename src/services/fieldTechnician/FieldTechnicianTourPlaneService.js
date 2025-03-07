const {pool} = require("../../config/config");

async function fieldTechnicianClientDetailsFetchByTourPlaneService(route_id, user_id, hq_id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const query = `
        SELECT 
            c.id,
            ct.client_type, 
            c.DistributionId,
            d.DistributionType,
            c.OwnerName,
            c.NameOfShop,
            c.sub_route_name,
            tvn.village_name,
            c.NameOfFarmer
        FROM 
            tbl_client_details c
        LEFT JOIN 
            tbl_client_type ct 
            ON c.ClientTypeId = ct.id
            AND c.ClientTypeId IS NOT NULL 
        LEFT JOIN  
            tbl_village_name tvn 
            ON c.sub_route_name = tvn.id
        INNER JOIN 
            tbl_distribution d 
            ON c.DistributionId = d.id
        WHERE
            c.route_id = ? 
            AND c.FieldTechnicianId = ? 
            AND c.hq_id = ?
        ORDER BY c.id DESC
        `;

        const [rows] = await conn.execute(query, [route_id, user_id, hq_id]);

        return rows.length > 0 
            ? { success: true, client_plane: rows }
            : { success: false, message: "No client details found for the given parameters" };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
}

async function fieldTechnicianinsertTourPlanService(holidays_dates, route_id, user_id, hq_id, client_ids) {
    let conn;
    try {
        conn = await pool.getConnection();

        // Check if the tour plan already exists
        const [existing] = await conn.execute(
            `SELECT 1 FROM tbl_tour_plan WHERE holidays_dates = ? AND route_id = ? AND hq_id = ? AND FieldTechnicianId = ?`,
            [holidays_dates, route_id, hq_id, user_id]
        );

        if (existing.length > 0) {
            return { success: false, message: "Tour Plan date already exists. Please select a unique date." };
        }

        // Insert new tour plan
        const [result] = await conn.execute(
            `INSERT INTO tbl_tour_plan (holidays_dates, route_id, FieldTechnicianId, hq_id) VALUES (?, ?, ?, ?)`,
            [holidays_dates, route_id, user_id, hq_id]
        );

        const tour_plan_id = result.insertId;

        // Insert client IDs if provided
        if (client_ids.length > 0) {
            const clientData = client_ids.map(client_id => [client_id, tour_plan_id]);
            await conn.query(
                `INSERT INTO tbl_tour_plan_details (client_id, tour_plan_id) VALUES ?`,
                [clientData]
            );
        }

        return { success: true, message: "Tour Plan created successfully!" };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
}

async function fieldTechnicianTourPlaneUpdateService(tour_plan_id, user_id, hq_id, holidays_dates, route_id, client_ids) {
    let conn;
    try {
        conn = await pool.getConnection();

        // Check if the tour plan exists
        const [existingPlan] = await conn.execute(
            `SELECT id FROM tbl_tour_plan WHERE id = ? AND FieldTechnicianId = ? AND hq_id = ?`,
            [tour_plan_id, user_id, hq_id]
        );
        
        if (existingPlan.length === 0) {
            return { success: false, message: "Tour plan not found or unauthorized." };
        }

        // Update the tour plan
        await conn.execute(
            `UPDATE tbl_tour_plan SET holidays_dates = ?, route_id = ?, ModifiedDate = NOW() WHERE id = ? AND FieldTechnicianId = ? AND hq_id = ?`,
            [holidays_dates, route_id, tour_plan_id, user_id, hq_id]
        );

        // Delete existing client associations
        await conn.execute(`DELETE FROM tbl_tour_plan_details WHERE tour_plan_id = ?`, [tour_plan_id]);

        // Insert new client IDs
        if (client_ids && client_ids.length > 0) {
            const clientData = client_ids.map(client_id => [client_id, tour_plan_id]);
            await conn.query(`INSERT INTO tbl_tour_plan_details (client_id, tour_plan_id) VALUES ?`, [clientData]);
        }

        return { success: true, message: "Tour plan updated successfully!" };
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
}


async function fieldTechnicianTourPlaneFetchService(target_date, user_id, hq_id) {
    let connection;
    try {
        connection = await pool.getConnection();
        
        const query = `
            SELECT 
                tpd.client_id, 
                tp.route_id, 
                rn.route_name, 
                tp.id, 
                tp.holidays_dates
            FROM tbl_tour_plan_details tpd
            JOIN tbl_tour_plan tp ON tpd.tour_plan_id = tp.id
            JOIN tbl_route rn ON rn.id = tp.route_id
            WHERE tp.FieldTechnicianId = ? 
              AND tp.hq_id = ? 
              AND tp.holidays_dates = ?
            ORDER BY tp.id DESC;
        `;

        const [rows] = await connection.execute(query, [user_id, hq_id, target_date]);

        if (rows.length > 0) {
            return {
                success: true,
                holidays_dates: rows[0].holidays_dates,
                route_name: rows[0].route_name,
                route_id: rows[0].route_id,
                id: rows[0].id,
                client_plane: rows.map(row => row.client_id)
            };
        } else {
            return { success: false, message: "No client details found for the given parameters" };
        }
    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (connection) connection.release();
    }
}

module.exports = { fieldTechnicianClientDetailsFetchByTourPlaneService,fieldTechnicianinsertTourPlanService,fieldTechnicianTourPlaneUpdateService,fieldTechnicianTourPlaneFetchService};
