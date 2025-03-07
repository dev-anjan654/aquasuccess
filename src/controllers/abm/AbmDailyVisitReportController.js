const { abmFetchFieldTechnicianDailyVisitReportService } = require("../../services/abm/AbmDailyVisitReportService");

async function abmFetchFieldTechnicianDailyVisitReportController(req, res) {
    try {
        const { user_id, abm_id } = req.body;

        if (!user_id || !abm_id) {
            return res.status(400).json({ message: "user_id and abm_id are required!", success: false });
        }

        const response = await abmFetchFieldTechnicianDailyVisitReportService(user_id, abm_id);
        
        if (!response.success) {
            return res.status(400).json(response);
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { abmFetchFieldTechnicianDailyVisitReportController };