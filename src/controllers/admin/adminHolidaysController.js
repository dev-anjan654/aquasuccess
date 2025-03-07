const { adminHolidayInsertService, adminHolidaysFetchService, adminHolidayUpdateService } = require('../../services/admin/adminHolidaysService');

// Insert a holiday
const adminHolidayInsertController = async (req, res) => {
    try {
        const { user_id, holidates, holidates_events } = req.body;

        if (!user_id || !holidates || !holidates_events) {
            return res.status(400).json({ success: false, message: "User ID, holiday date, and holiday event are required!" });
        }

        const serviceResponse = await adminHolidayInsertService(user_id, holidates, holidates_events);

        if (serviceResponse.success) {
            return res.status(201).json(serviceResponse);
        } else {
            return res.status(400).json(serviceResponse);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// Fetch all holidays
const adminHolidaysFetchController = async (req, res) => {
    try {
        const serviceResponse = await adminHolidaysFetchService();

        if (serviceResponse.success) {
            return res.status(200).json(serviceResponse);
        } else {
            return res.status(400).json(serviceResponse);
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

const adminHolidayUpdateController = async (req, res) => {
    try {
        const { id, user_id, holidates, holidates_events } = req.body;

        // Validate input fields
        if (!id || !user_id || !holidates || !holidates_events) {
            return res.status(400).json({ success: false, message: "All fields (id, user_id, holidates, holidates_events) are required." });
        }

        // Call the service function
        const { success, message, status } = await adminHolidayUpdateService(id, user_id, holidates, holidates_events);
        return res.status(status).json({ success, message });
    } catch (error) {
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
}

module.exports = { adminHolidayInsertController, adminHolidaysFetchController, adminHolidayUpdateController };
