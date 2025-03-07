const { adminFetchEmployeesService,adminInsertEmployeesService,adminUpdateEmployeesService,adminEmployeesUpdateCredentialsService } = require('../../services/admin/adminEmpService');

const adminFetchEmployeesController = async (req, res) => {
    try {
        const result = await adminFetchEmployeesService();
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(400).json({ error: result.error });
        }
    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};


const adminInsertEmployeesController = async (req, res) => {
    try {
        const { emp_password, confirm_emp_password, ...employeeData } = req.body;
        
        if (!emp_password || !confirm_emp_password || emp_password !== confirm_emp_password) {
            return res.status(400).json({ success: false, message: "Passwords do not match or are missing." });
        }
        
        const result = await adminInsertEmployeesService({ ...employeeData, emp_password });
        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};


async function adminUpdateEmployeesController(req, res) {
    try {
        const employeeData = req.body;
        const response = await adminUpdateEmployeesService(employeeData);
        res.status(response.success ? 200 : 400).json(response);
    } catch (error) {
        console.error("Error in adminUpdateEmployeesController:", error);
        res.status(500).json({ success: false, message: `Unexpected error: ${error.message}` });
    }
}

const adminEmployeesUpdateCredentialsController = async (req, res) => {
    try {
        const { id, emp_username, emp_password, confirm_emp_password } = req.body;

        // Basic validation
        if (!id || !emp_username || !emp_password || !confirm_emp_password) {
            return res.status(400).json({ success: false, message: "All fields (id, emp_username, emp_password, confirm_emp_password) are required." });
        }

        if (typeof id !== "number") {
            return res.status(400).json({ success: false, message: "Employee ID must be a number." });
        }

        if (emp_password !== confirm_emp_password) {
            return res.status(400).json({ success: false, message: "Passwords do not match." });
        }

        const result = await adminEmployeesUpdateCredentialsService(id, emp_username, emp_password);

        return res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
module.exports = { adminFetchEmployeesController,adminInsertEmployeesController,adminUpdateEmployeesController,adminEmployeesUpdateCredentialsController };


