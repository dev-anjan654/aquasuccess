const { addDailyVisitReportService,calculateWorkingDays,calculateTotalKmTraveled,calculateTotalOrderValues,calculateTotalAgentVisit,calculateTotalCustomerVisit,fetchTourPlanOnDailyReportService,fieldTechnicianDailyVisitReportService, fieldTechnicianDailyVisitReportFetchByIdService } = require("../../services/fieldTechnician/FieldTechnicianDailyVisitReportService");

async function addDailyVisitReport(req, res) {
    try {
        const data = req.body;
        if (!data || !data.dvr_data || !data.details_data) {
            return res.status(400).json({ message: "Both report data and details data are required!" });
        }
        
        const result = await addDailyVisitReportService(data.dvr_data, data.details_data);
        if (result.success) {
            return res.status(201).json(result);
        } else {
            return res.status(400).json(result);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


async function fetchWorkingDays(req, res) {
    try {
        const { user_id, hq_id, target_date } = req.body;
        if (!user_id || !hq_id || !target_date) {
            return res.status(400).json({ message: "user_id, hq_id, and target_date are required!", success: false });
        }
        const result = await calculateWorkingDays(user_id, hq_id, target_date);
        res.status(200).json({...result, success: true});
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
}

const fetchTotalKmTraveled = async (req, res) => {
    try {
        const { user_id, hq_id, target_date } = req.body;

        if (!user_id || !hq_id || !target_date) {
            return res.status(400).json({ message: "user_id, hq_id, and target_date are required!", success: false });
        }

        // Call the service function
        const response = await calculateTotalKmTraveled(user_id, hq_id, target_date);
        return res.status(200).json({...response, success: true});

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};




async function fetchTotalOrderValues(req, res) {
    try {
        const { user_id, hq_id, target_date } = req.body;

        if (!user_id || !hq_id || !target_date) {
            return res.status(400).json({ message: "user_id, hq_id, and target_date are required!", success: false });
        }

        const result = await calculateTotalOrderValues(user_id, hq_id, target_date);
        return res.status(200).json({...result, success: true});
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


const fetchTotalAgentVisit = async (req, res) => {
    try {
        const { user_id, hq_id, target_date } = req.body;

        if (!user_id || !hq_id || !target_date) {
            return res.status(400).json({ message: "user_id, hq_id, and target_date are required!", success: false });
        }

        // Call the service function to fetch the total agent visit count
        const result = await calculateTotalAgentVisit(user_id, hq_id, target_date);

        return res.status(200).json({...result, success: true});
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const fetchTotalCustomerVisit = async (req, res) => {
    try {
        const { user_id, hq_id, target_date } = req.body;

        if (!user_id || !hq_id || !target_date) {
            return res.status(400).json({ message: "user_id, hq_id, and target_date are required!", success: false });
        }

        // Call service function to get total customer visit count
        const result = await calculateTotalCustomerVisit(user_id, hq_id, target_date);

        return res.status(200).json({...result, success: true});
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const fetchTourPlanOnDailyReport = async (req, res) => {
    try {
        const { target_date, user_id, hq_id } = req.body;

        if (!target_date || !user_id || !hq_id) {
            return res.status(400).json({ message: "target_date, user_id, and hq_id are required!", success: false });
        }

        const result = await fetchTourPlanOnDailyReportService(target_date, user_id, hq_id);
        return res.status(result.status).json(result);

    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

const fieldTechnicianDailyVisitReportController = async (req, res) => {
    try {
        const { user_id, hq_id } = req.body;

        if (!user_id || !hq_id) {
            return res.status(400).json({ message: "user_id and hq_id are required!" });
        }

        const result = await fieldTechnicianDailyVisitReportService(user_id, hq_id);
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json({ message: result.message, success: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

async function fieldTechnicianDailyVisitReportFetchByIdController(req, res) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ message: 'id is required!', success: false });
        }

        const result = await fieldTechnicianDailyVisitReportFetchByIdService(id);

        if (!result.success) {
            return res.status(404).json({ message: result.message, success: false });
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
}


module.exports = { addDailyVisitReport,fetchWorkingDays,fetchTotalKmTraveled,fetchTotalOrderValues,fetchTotalAgentVisit,fetchTotalCustomerVisit,fetchTourPlanOnDailyReport,fieldTechnicianDailyVisitReportController, fieldTechnicianDailyVisitReportFetchByIdController };