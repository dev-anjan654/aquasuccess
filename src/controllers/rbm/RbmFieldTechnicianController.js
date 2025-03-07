const { rbmFetchFieldTechnicianHQService } = require("../../services/rbm/RbmFieldTechnicianService");

async function rbmFetchFieldTechnicianHQController(req, res) {
    try {
        const { region_id, user_id } = req.body;

        if (!region_id || !user_id) {
            return res.status(400).json({ message: "Both region_id and user_id are required!" });
        }

        // Convert inputs to integers
        const regionId = parseInt(region_id);
        const userId = parseInt(user_id);

        if (isNaN(regionId) || isNaN(userId)) {
            return res.status(400).json({ message: "Invalid region_id or user_id. Must be integers!" });
        }

        // Call service function
        const result = await rbmFetchFieldTechnicianHQService(regionId, userId);

        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: result.message });
        }

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

module.exports = { rbmFetchFieldTechnicianHQController };
