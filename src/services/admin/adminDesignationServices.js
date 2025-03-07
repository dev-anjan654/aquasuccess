const { pool } = require("../../config/config");
const { formatResponse } = require('../../utils/responseHelper');

const adminFetchDesignationsService = async () => {
    let conn;
    try {
        // Get a connection from the pool
        conn = await pool.getConnection();

        // Query the database using the connection from the pool
        const [rows] = await conn.execute("SELECT id, DesignationType FROM tbl_designation");

        // Format the response and return it
        return formatResponse({ designations: rows }, 200);
    } catch (error) {
        // Handle any errors that occur
        return formatResponse({ error: error.message }, 400);
    } finally {
        // Release the connection back to the pool
        if (conn) conn.release();
    }
};

module.exports = { adminFetchDesignationsService };