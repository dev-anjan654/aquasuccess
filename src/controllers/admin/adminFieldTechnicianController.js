const { adminFieldTechnicianInsertService, adminFieldTechnicianUpdateService} = require("../../services/admin/adminFieldTechnicianService");

const adminFieldTechnicianInsertController = async (req, res) => {
    try {
        const { region_id, abm_area_id, field_technician_hq } = req.body;

        // Validate required fields
        if (!region_id) {
            return res.status(400).json({ success: false, message: "Region ID is required!" });
        }
        if (!abm_area_id) {
            return res.status(400).json({ success: false, message: "ABM Area ID is required!" });
        }
        if (!field_technician_hq || !field_technician_hq.trim()) {
            return res.status(400).json({ success: false, message: "Field Technician HQ is required!" });
        }

        // Call service function
        const response = await adminFieldTechnicianInsertService(region_id, abm_area_id, field_technician_hq);

        return res.status(response.success ? 201 : 400).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};



const adminFieldTechnicianUpdateController = async (req, res) => {
    try {
        const { id, region_id, AbmArea_id, FieldTechnicianHq } = req.body;

        // Validate required fields
        if (!id || !region_id || !AbmArea_id || !FieldTechnicianHq) {
            return res.status(400).json({ success: false, message: "ID, Region, ABM Area, and Field Technician HQ are required" });
        }

        // Call the service function
        const { success, message, status } = await adminFieldTechnicianUpdateService(id, region_id, AbmArea_id, FieldTechnicianHq);

        return res.status(status).json({ success, message });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};


module.exports = { adminFieldTechnicianInsertController, adminFieldTechnicianUpdateController };


