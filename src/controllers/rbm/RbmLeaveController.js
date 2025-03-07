const { fetchRbmLeaveApplicationService, fetchAllRbmLeaveApplicationsService } = require("../../services/rbm/RbmLeaveService");

const fetchRbmLeaveApplicationController = async (req, res) => {
    try {
        const { user_id, region_id } = req.body;

        if (!user_id || !region_id) {
            return res.status(400).json({ error: "user_id and region_id are required!", success: false });
        }

        const response = await fetchRbmLeaveApplicationService(user_id, region_id);
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const fetchAllRbmLeaveApplicationsController = async (req, res) => {
    try {
        const { user_id, region_id } = req.body;

        if (!user_id || !region_id) {
            return res.status(400).json({ message: "user_id and region_id are required!", success: false });
        }

        const result = await fetchAllRbmLeaveApplicationsService(user_id, region_id);
        return res.status(result.status).json(result.data);
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};
module.exports = { fetchRbmLeaveApplicationController,fetchAllRbmLeaveApplicationsController };
