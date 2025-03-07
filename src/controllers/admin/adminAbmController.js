const { adminAbmAreaInsertService, adminAbmAreaUpdateService, adminFetchAbmAreaService } = require("../../services/admin/adminAbmService");

const adminAbmAreaInsertController = async (req, res) => {
    try {
        const { region_id, abm_area } = req.body;

        if (!region_id || !abm_area) {
            return res.status(400).json({ success: false, message: "Both region_id and abm_area are required!" });
        }

        const response = await adminAbmAreaInsertService(region_id, abm_area);

        if (response.success) {
            return res.status(201).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed"});
    }
};

const adminAbmAreaUpdateController = async (req, res) => {
    try {
        const { id, region_id, AbmArea } = req.body;

        if (!id || !region_id || !AbmArea) {
            return res.status(400).json({ success: false, message: "id, region_id, and AbmArea are required" });
        }

        const response = await adminAbmAreaUpdateService(id, region_id, AbmArea);

        if (response.success) {
            return res.status(200).json(response);
        } else {
            return res.status(400).json(response);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed"});
    }
};

const adminFetchAbmAreaController = async (req, res) => {
    try {
        const { region_id } = req.body;

        // Validate region_id
        if (!region_id || region_id <= 0) {
            return res.status(400).json({ success: false, message: "Invalid region ID." });
        }

        // Call service
        const response = await adminFetchAbmAreaService(region_id);
        return res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

module.exports = { adminAbmAreaInsertController, adminAbmAreaUpdateController, adminFetchAbmAreaController };
