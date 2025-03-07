const { adminFetchAbmWithRegionService, adminFetchFieldTechnicianHqWithAbmWithRegionService, adminFetchFieldTechnicianHqByAbmAreaService } = require("../../services/admin/adminFetchService");

const adminFetchAbmWithRegionController = async (req, res) => {
    try {
        const { success, data, status } = await adminFetchAbmWithRegionService();
        return res.status(status).json({ success, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};


const adminFetchFieldTechnicianHqWithAbmWithRegionController = async (req, res) => {
    try {
        const { success, data, status } = await adminFetchFieldTechnicianHqWithAbmWithRegionService();
        return res.status(status).json({ success, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};


const adminFetchFieldTechnicianHqByAbmAreaController = async (req, res) => {
    try {
        const { abm_area_id } = req.body;

        // Validate abm_area_id
        if (!abm_area_id || abm_area_id <= 0) {
            return res.status(400).json({ success: false, message: "Invalid AbmArea ID." });
        }

        // Call the service function
        const { success, data, status } = await adminFetchFieldTechnicianHqByAbmAreaService(abm_area_id);
        return res.status(status).json({ success, data });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};


module.exports = { adminFetchAbmWithRegionController, adminFetchFieldTechnicianHqWithAbmWithRegionController, adminFetchFieldTechnicianHqByAbmAreaController };





