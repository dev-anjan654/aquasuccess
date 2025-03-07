const { adminFetchFieldTechnicianDailyVisitReport } = require("../../services/admin/adminDailyVisitReportService");

async function adminFetchFieldTechnicianDailyVisitReportController(req, res) {
    try {
        const response = await adminFetchFieldTechnicianDailyVisitReport();
        res.status(response.success ? 200 : 500).json(response);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = { adminFetchFieldTechnicianDailyVisitReportController };