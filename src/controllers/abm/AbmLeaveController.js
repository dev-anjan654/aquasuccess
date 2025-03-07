const { abmfetchFieldTechnicianLeaveApplicationsService, updateLeaveApplicationStatus, fetchAbmLeaveApplicationsService } = require("../../services/abm/AbmLeaveService");

const abmfetchFieldTechnicianLeaveApplicationsController = async (req, res) => {
    try {
        const { user_id, abm_id } = req.body;

        if (!user_id || !abm_id) {
            return res.status(400).json({ message: "user_id and abm_id are required!", success: false });
        }

        const response = await abmfetchFieldTechnicianLeaveApplicationsService(user_id, abm_id);
        return res.json(response);

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const fetchAbmLeaveApplicationsController = async (req, res) => {
    try {
        const { user_id, AreaArea_id } = req.body;

        if (!user_id || !AreaArea_id) {
            return res.status(400).json({ message: "user_id and AreaArea_id are required!", success: false });
        }

        const result = await fetchAbmLeaveApplicationsService(user_id, AreaArea_id);
        return res.status(result.status).json(result.data);

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};


const updateLeaveApplicationStatusController = async (req, res) => {
    try {
        const { id, user_id, hq_id, leave_status } = req.body;

        if (!id || !user_id || !hq_id || !leave_status) {
            return res.status(400).json({ message: "All fields (id, user_id, hq_id, leave_status) are required!", success: false });
        }

        const response = await updateLeaveApplicationStatus(id, user_id, hq_id, leave_status);
        return res.json(response);

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    abmfetchFieldTechnicianLeaveApplicationsController,
    updateLeaveApplicationStatusController,
    fetchAbmLeaveApplicationsController
};
