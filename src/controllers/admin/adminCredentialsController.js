const { adminRegisterService, adminLoginService, empLoginService } = require('../../services/admin/adminCredentialsServices');
const jwt = require('jsonwebtoken');

// Admin Registration Controller
const adminRegisterController = async (req, res) => {
    try {
        const { role, username, password } = req.body;

        if (!role || !username || !password) {
            return res.status(400).json({
                message: 'Role, username, and password are required!',
                success: false
            });
        }

        const response = await adminRegisterService(role, username, password);

        if (response.success) {
            return res.status(201).json({
                message: 'Admin registered successfully!',
                success: true
            });
        } else {
            return res.status(400).json({
                message: response.message || 'Registration failed.',
                success: false
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

// Admin Login Controller
const adminLoginController = async (req, res) => {
    try {
        // Extract role, username, and password from the incoming request body
        const { role, username, password } = req.body;

        if (!role || !username || !password) {
            return res.status(400).json({
                message: 'Role, username, and password are required!',
                success: false
            });
        }

        // Call the service function to handle login
        const response = await adminLoginService(role, username, password);

        const token = jwt.sign({username}, "myjwtsecret");

        if (response.success) {
            return res.status(200).json({
                message: 'Login successful',
                user_id: response.user_id,
                role: response.role,
                token,
                success: true
            });
        } else {
            return res.status(401).json({
                message: response.message || 'Login failed.',
                success: false
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};

//employee login
const empLoginController = async (req, res) => {
    try {
        const { role, username, password } = req.body;

        if (!role || !username || !password) {
            return res.status(400).json({
                message: "Role, username, and password are required!",
                success: false
            });
        }

        const token = jwt.sign({username}, "myjwtsecret");

        const loginResponse = await empLoginService(role, username, password);
        return res.status(loginResponse.status).json({...loginResponse, token});

    } catch (error) {
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
};


const logoutController = async (req, res) => {
    try {
        res.status(200).json({success: true, message: 'Logout Successful!'});
    } catch (error) {
        res.status(500).json({message: 'Logout failed', success: false});
    }
}

module.exports = { adminRegisterController, adminLoginController, logoutController, empLoginController };
