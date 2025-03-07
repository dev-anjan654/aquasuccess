const {pool} = require("../../config/config");

const abmFetchAbmAreaService = async (user_id) => {
    let connection;
    try {
        connection = await pool.getConnection();

        // Execute SQL query
        const query = `
            SELECT a.AbmArea, a.id
            FROM tbl_employees e
            INNER JOIN tbl_abm_area a ON e.AbmArea_id = a.id
            WHERE e.id = ?
        `;
        const [rows] = await connection.execute(query, [user_id]);

        if (rows.length > 0) {
            const { AbmArea, id } = rows[0];

            return {
                status: 200,
                success: true,
                AbmArea: AbmArea,
                id: id 
            };
        } else {
            return {
                status: 404,
                success: false,
                message: "No AbmArea found for the given user_id"
            };
        }

    } catch (error) {
        return {
            status: 500,
            success: false,
            message: `Database error: ${error.message}`
        };
    } finally {
        if (connection) connection.release();
    }
};

module.exports = abmFetchAbmAreaService;
