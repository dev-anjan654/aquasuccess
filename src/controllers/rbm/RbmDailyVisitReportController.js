const { rbmFetchFieldTechnicianDailyVisitReportService } = require("../../services/rbm/RbmDailyVisitReportService");

const rbmFetchFieldTechnicianDailyVisitReportController = async (req, res) => {
    try {
        const { user_id, region_id } = req.body;

        if (!user_id || !region_id) {
            return res.status(400).json({ message: "user_id and region_id are required!", success: false });
        }

        const result = await rbmFetchFieldTechnicianDailyVisitReportService(region_id, user_id);
        res.status(result.status).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message, success: false});
    }
};

module.exports = { rbmFetchFieldTechnicianDailyVisitReportController };
