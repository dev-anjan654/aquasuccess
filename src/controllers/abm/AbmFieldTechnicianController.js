const { abmFetchFieldTechnicianHqService } = require("../../services/abm/AbmFieldTechnicianService");

const abmFetchFieldTechnicianHqController = async (req, res) => {
    try {
        const { AbmArea_id } = req.body;

        if (!AbmArea_id) {
            return res.status(400).json({ message: "Invalid request! 'AbmArea_id' is required." });
        }

        const result = await abmFetchFieldTechnicianHqService(AbmArea_id);

        if (result.success) {
            return res.status(200).json({ technicians: result.data, success: true });
        } else {
            return res.status(400).json({ message: result.message, success: false });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { abmFetchFieldTechnicianHqController };
