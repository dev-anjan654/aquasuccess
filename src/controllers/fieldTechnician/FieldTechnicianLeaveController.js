const { fieldTechnicianLeaveTypeFetchService,fieldTechnicianLeaveApplicationInsertService,fieldTechnicianLeaveApplicationUpdateService,fetchFieldTechnicianLeaveApplicationsService } = require('../../services/fieldTechnician/FieldTechnicianLeaveService');

async function fieldTechnicianLeaveTypeFetchController(req, res) {
    try {
        const result = await fieldTechnicianLeaveTypeFetchService();

        return res.status(result.status).json({...result.data, success: true});

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

async function fieldTechnicianLeaveApplicationInsertController(req, res) {
    try {
        const { user_id, hq_id, leave_type, from_date, to_date, reason_of_leave = "", leave_status = "Pending" } = req.body;

        // Validate required fields
        if (!user_id || !hq_id || !leave_type || !from_date || !to_date) {
            return res.status(400).json({ message: "All required fields must be provided!" });
        }

        // Call the service function
        const result = await fieldTechnicianLeaveApplicationInsertService(user_id, hq_id, leave_type, reason_of_leave, from_date, to_date, leave_status);

        if (result.success) {
            return res.status(201).json({ message: result.message, success: true });
        } else {
            return res.status(400).json({ message: result.message, success: false });
        }

    } catch (error) {
        // console.error("Controller Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
}

async function fieldTechnicianLeaveApplicationUpdateController(req, res) {
    try {
        const { id, user_id, hq_id, leave_type, reason_of_leave, leave_status, from_date, to_date } = req.body;

        // Validate required fields
        if (!id || !user_id || !hq_id || !leave_type || !reason_of_leave || !leave_status || !from_date || !to_date) {
            return res.status(400).json({ success: false, message: "All fields are required!" });
        }

        const response = await fieldTechnicianLeaveApplicationUpdateService(id, user_id, hq_id, leave_type, reason_of_leave, leave_status, from_date, to_date);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


// Controller function to fetch leave applications
const fetchFieldTechnicianLeaveApplicationsController = async (req, res) => {
    try {
        const { user_id, hq_id } = req.body;

        const result = await fetchFieldTechnicianLeaveApplicationsService(user_id, hq_id);

        return res.status(result.success ? 200 : 400).json(result);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = { fieldTechnicianLeaveTypeFetchController,fieldTechnicianLeaveApplicationInsertController,fieldTechnicianLeaveApplicationUpdateController,fetchFieldTechnicianLeaveApplicationsController };
