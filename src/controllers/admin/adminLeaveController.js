const { adminFetchRBMLeaveApplicationsService } = require("../../services/admin/adminLeaveService");

// Fetch RBM leave applications
const adminFetchRBMLeaveApplicationsController = async (req, res) => {
    try {
        const serviceResponse = await adminFetchRBMLeaveApplicationsService();

        if (serviceResponse.success) {
            return res.status(200).json(serviceResponse);
        } else {
            return res.status(400).json(serviceResponse);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

module.exports = { adminFetchRBMLeaveApplicationsController };
