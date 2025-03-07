const { adminFetchAllClientDetailsService } = require('../../services/admin/adminClientService');


const adminFetchAllClientDetailsController = async (req, res) => {
    try {
        const response = await adminFetchAllClientDetailsService();
        res.status(response.status).json(response);
    } catch (error) {
        res.status(500).json({ success: false, status: 500, message: error.message });
    }
};


module.exports = { adminFetchAllClientDetailsController };