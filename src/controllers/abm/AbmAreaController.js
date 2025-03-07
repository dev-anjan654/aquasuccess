const abmFetchAbmAreaService = require("../../services/abm/AbmAreaService");


const abmFetchAbmAreaController = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                message: "user_id is required!",
                success: false
            });
        }

        // Call service function
        const serviceResponse = await abmFetchAbmAreaService(user_id);
        return res.status(serviceResponse.status).json(serviceResponse);

    } catch (error) {
        return res.status(500).json({
            message: `Unexpected error: ${error.message}`,
            success: false
        });
    }
};

module.exports = { abmFetchAbmAreaController };
