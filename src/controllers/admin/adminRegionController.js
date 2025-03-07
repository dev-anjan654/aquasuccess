const { adminRegionInsertService, adminRegionUpdateService, adminFetchAllRegionsService } = require("../../services/admin/adminRegionService");


const adminRegionInsertController = async (req, res) => {
    try {
        const { region } = req.body;
        if (!region) {
            return res.status(400).json({ success: false, message: "Region name is required!" });
        }
        
        const serviceResponse = await adminRegionInsertService(region);
        
        if (serviceResponse.success) {
            return res.status(201).json(serviceResponse);
        } else {
            return res.status(400).json(serviceResponse);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

const adminRegionUpdateController = async (req, res) => {
    try {
        const { id, region } = req.body;
        if (!id || !region) {
            return res.status(400).json({ message: "Region ID and name are required.", success: false });
        }

        const response = await adminRegionUpdateService(id, region);
        if (!response.success) {
            return res.status(400).json(response);
        }       
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const adminFetchAllRegionsController = async (req, res) => {
    try {
        const response = await adminFetchAllRegionsService();
        if (response.success) {
            return res.status(200).json(response);
        }
        return res.status(400).json(response);
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

module.exports = { adminRegionInsertController, adminRegionUpdateController, adminFetchAllRegionsController };