const { adminFetchDesignationsService } = require("../../services/admin/adminDesignationServices");

const adminFetchDesignationsController = async (req, res) => {
    try {
        const response = await adminFetchDesignationsService();
        return res.status(response.status).json({...response.message, success: true});
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = { adminFetchDesignationsController };