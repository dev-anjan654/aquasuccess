const { rbmFetchAbmByRegionIdService, fetchRbmAllRegionByUserIdService } = require("../../services/rbm/RbmAbmService");

async function rbmFetchAbmByRegionIdController(req, res) {
    try {
        const { Region_id } = req.body;

        if (!Region_id) {
            return res.status(400).json({ message: "Region_id is required in the body!", su });
        }

        const result = await rbmFetchAbmByRegionIdService(Region_id);

        if (result.error) {
            return res.status(400).json({ message: result.error, success: false });
        }

        return res.status(200).json({...result, success: true});
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

async function fetchRbmAllRegionByUserIdController(req, res) {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({ message: "user_id is required!" });
        }

        const result = await fetchRbmAllRegionByUserIdService(user_id);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}

module.exports = { rbmFetchAbmByRegionIdController,fetchRbmAllRegionByUserIdController };