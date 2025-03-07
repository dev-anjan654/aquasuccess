const { fieldTechnicianRouteInsertService,fieldTechnicianRouteUpdateService,fieldTechnicianRouteFetchService } = require('../../services/fieldTechnician/FieldTechnicianRouteService');

const fieldTechnicianRouteInsertController = async (req, res) => {
    try {
        const { user_id, hq_id, route_name, village_names } = req.body;

        if (!user_id || !hq_id || !route_name || !Array.isArray(village_names) || village_names.length === 0) {
            return res.status(400).json({ message: "User ID, HQ ID, Route Name, and Village Names are required!" });
        }

        const result = await fieldTechnicianRouteInsertService(user_id, hq_id, route_name, village_names);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};


const fieldTechnicianRouteUpdateController = async (req, res) => {
    try {
        const { route_id, user_id, hq_id, route_name, village_names } = req.body;

        if (!route_id || !user_id || !hq_id || !route_name || !Array.isArray(village_names) || village_names.length === 0) {
            return res.status(400).json({ message: "Route ID, User ID, HQ ID, Route Name, and Village Names are required!" });
        }

        const result = await fieldTechnicianRouteUpdateService(route_id, user_id, hq_id, route_name, village_names);

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};


const fieldTechnicianRouteFetchController = async (req, res) => {
    try {
        const result = await fieldTechnicianRouteFetchService();

        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



module.exports = { fieldTechnicianRouteInsertController,fieldTechnicianRouteUpdateController,fieldTechnicianRouteFetchController };
