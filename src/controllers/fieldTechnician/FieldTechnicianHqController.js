const { fieldTechnicianHqFetchService } = require('../../services/fieldTechnician/FieldTechnicianHqService');

async function fieldTechnicianHqFetchController(req, res) {
    try {
        const { user_id } = req.body;

        const result = await fieldTechnicianHqFetchService(user_id);

        return res.status(result.status).json({...result.data, success: true});

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

module.exports = { fieldTechnicianHqFetchController };
