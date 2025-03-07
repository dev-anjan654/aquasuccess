const { fieldTechnicianClientDetailsFetchByTourPlaneService,fieldTechnicianinsertTourPlanService,fieldTechnicianTourPlaneUpdateService,fieldTechnicianTourPlaneFetchService } = require('../../services/fieldTechnician/FieldTechnicianTourPlaneService');

async function fieldTechnicianClientDetailsFetchByTourPlaneController(req, res) {
    try {
        const { route_id, user_id, hq_id } = req.body;

        if (!route_id || !user_id || !hq_id) {
            return res.status(400).json({ message: "route_id, user_id, and hq_id are required!" });
        }

        const result = await fieldTechnicianClientDetailsFetchByTourPlaneService(route_id, user_id, hq_id);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function fieldTechnicianTourPlaneInsertController(req, res) {
    try {
        const { holidays_dates, route_id, user_id, hq_id, client_ids } = req.body;

        if (!holidays_dates || !route_id || !user_id || !hq_id || !client_ids) {
            return res.status(400).json({ message: "User ID, HQ ID, route name ID, and client IDs are required!" });
        }

        // Ensure client_ids is an array
        const clientIdsArray = Array.isArray(client_ids) ? client_ids : client_ids.split(',').map(id => parseInt(id.trim()));

        // Call the service function
        const response = await fieldTechnicianinsertTourPlanService(holidays_dates, route_id, user_id, hq_id, clientIdsArray);
        
        return res.status(response.success ? 201 : 400).json(response);

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}




async function fieldTechnicianTourPlaneUpdateController(req, res) {
    try {
        const { id, user_id, hq_id, holidays_dates, route_id, client_ids } = req.body;

        // Validate required fields
        if (!id || !user_id || !hq_id || !holidays_dates || !route_id) {
            return res.status(400).json({ success: false, message: "All fields (id, user_id, hq_id, holidays_dates, route_id) are required." });
        }

        // Validate client_ids (must be an array)
        if (client_ids && !Array.isArray(client_ids)) {
            return res.status(400).json({ success: false, message: "client_ids must be an array." });
        }

        const result = await fieldTechnicianTourPlaneUpdateService(id, user_id, hq_id, holidays_dates, route_id, client_ids);
        return res.status(result.success ? 200 : 400).json(result);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function fieldTechnicianTourPlaneFetchController(req, res) {
    try {
        const { target_date, user_id, hq_id } = req.body;

        if (!target_date || !user_id || !hq_id) {
            return res.status(400).json({ success: false, message: "target_date, user_id, and hq_id are required!" });
        }

        const result = await fieldTechnicianTourPlaneFetchService(target_date, user_id, hq_id);
        return res.status(result.success ? 200 : 400).json(result);

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}


module.exports = { fieldTechnicianClientDetailsFetchByTourPlaneController,fieldTechnicianTourPlaneInsertController,fieldTechnicianTourPlaneUpdateController,fieldTechnicianTourPlaneFetchController };
