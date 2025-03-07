const {pool} = require("../../config/config");

const fieldTechnicianRouteInsertService = async (user_id, hq_id, route_name, village_names) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Start a transaction
        await conn.beginTransaction();

        // Insert into tbl_route and get the inserted route_id
        const [routeResult] = await conn.execute(
            "INSERT INTO tbl_route (user_id, hq_id, route_name) VALUES (?, ?, ?)", 
            [user_id, hq_id, route_name]
        );
        const route_id = routeResult.insertId;

        // Insert multiple village names linked to the route_id
        const villageData = village_names.map(village => [route_id, village]);
        await conn.query("INSERT INTO tbl_village_name (route_id, village_name) VALUES ?", [villageData]);

        // Commit transaction
        await conn.commit();

        return { success: true, message: "Route and villages added successfully!" };

    } catch (error) {
        if (conn) await conn.rollback();
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
};


const fieldTechnicianRouteUpdateService = async (route_id, user_id, hq_id, route_name, village_names) => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Start transaction
        await conn.beginTransaction();

        // Check if the route exists
        const [existingRoute] = await conn.execute("SELECT id FROM tbl_route WHERE id = ?", [route_id]);
        if (existingRoute.length === 0) {
            return { success: false, message: "Route not found!" };
        }

        // Update the route details
        await conn.execute(
            "UPDATE tbl_route SET user_id = ?, hq_id = ?, route_name = ? WHERE id = ?", 
            [user_id, hq_id, route_name, route_id]
        );

        // Delete existing villages before inserting new ones
        await conn.execute("DELETE FROM tbl_village_name WHERE route_id = ?", [route_id]);

        // Insert new village names if provided
        if (village_names.length > 0) {
            const placeholders = village_names.map(() => "(?, ?)").join(", "); // Generates (?, ?), (?, ?), ...
            const values = village_names.flatMap(village => [route_id, village]); // Flatten values into one array

            await conn.query(`INSERT INTO tbl_village_name (route_id, village_name) VALUES ${placeholders}`, values);
        }

        // Commit transaction
        await conn.commit();
        return { success: true, message: "Route and villages updated successfully!" };

    } catch (error) {
        if (conn) await conn.rollback();
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
};


// Fetch all field technician routes
const fieldTechnicianRouteFetchService = async () => {
    let conn;
    try {
        conn = await pool.getConnection();

        // Fetch all routes
        const [routes] = await conn.query("SELECT id, user_id, hq_id, CreationDate, route_name FROM tbl_route ORDER BY id DESC");

        // Fetch all villages in a single query
        const [villageRows] = await conn.query("SELECT route_id, id, village_name FROM tbl_village_name");

        // Organize villages by route_id
        const villageMap = {};
        villageRows.forEach(village => {
            if (!villageMap[village.route_id]) {
                villageMap[village.route_id] = [];
            }
            villageMap[village.route_id].push({
                id: village.id,
                village_name: village.village_name
            });
        });

        // Construct response data
        const routeData = routes.map(route => ({
            id: route.id,
            user_id: route.user_id,
            hq_id: route.hq_id,
            CreationDate: route.CreationDate,
            route_name: route.route_name,
            villages: villageMap[route.id] || []
        }));

        return { success: true, routes: routeData };

    } catch (error) {
        return { success: false, message: error.message };
    } finally {
        if (conn) conn.release();
    }
};


module.exports = { fieldTechnicianRouteInsertService,fieldTechnicianRouteUpdateService,fieldTechnicianRouteFetchService };
