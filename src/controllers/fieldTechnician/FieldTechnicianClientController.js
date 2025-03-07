const { fieldTechnicianDistributionFetchService,fieldTechnicianClientDetailsInsertService,fetchFieldTechnicianClientTypesService,fetchFieldTechnicianClientDetailsByRouteService,fieldTechnicianClientDetailsUpdateService } = require('../../services/fieldTechnician/FieldTechnicianClientService');

function fieldTechnicianDistributionFetchController(req, res) {
    fieldTechnicianDistributionFetchService()
        .then(response => {
            res.status(response.success ? 200 : 400).json(response);
        })
        .catch(error => {
            res.status(500).json({ success: false, message: error.message });
        });
}

async function fieldTechnicianClientDetailsInsertController(req, res) {
    try {
        const data = req.body;
        const response = await fieldTechnicianClientDetailsInsertService(data);

        res.status(response.success ? 201 : 400).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const fieldTechnicianClientTypesFetchController = async (req, res) => {
    try {
        const response = await fetchFieldTechnicianClientTypesService();
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json({ message: response.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Fetch client details by route controller
const fieldTechnicianClientDetailsFetchByRouteController = async (req, res) => {
    try {
        const { route_id, sub_route_id, FieldTechnicianId, hq_id } = req.body;

        const response = await fetchFieldTechnicianClientDetailsByRouteService(route_id, sub_route_id, FieldTechnicianId, hq_id);
        
        if (response.success) {
            res.status(200).json(response);
        } else {
            res.status(400).json({ message: response.message });
        }
    } catch (error) {
        console.error("Controller Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const fieldTechnicianClientDetailsUpdateController = async (req, res) => {
    try {
        const clientId = req.body.id;
        if (!clientId) {
            return res.status(400).json({ success: false, message: "Client ID is required for update." });
        }

        const serviceResponse = await fieldTechnicianClientDetailsUpdateService(clientId, req.body);

        if (serviceResponse.success) {
            return res.status(200).json({ success: true, message: serviceResponse.message });
        } else {
            return res.status(400).json({ success: false, message: serviceResponse.message });
        }

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};



module.exports = { fieldTechnicianDistributionFetchController,fieldTechnicianClientDetailsInsertController,fieldTechnicianClientTypesFetchController, fieldTechnicianClientDetailsFetchByRouteController, fieldTechnicianClientDetailsUpdateController };

