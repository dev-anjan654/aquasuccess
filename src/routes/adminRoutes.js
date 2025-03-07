const express = require("express");
const { adminFetchDesignationsController } = require("../controllers/admin/adminDesignationController");
const { adminRegisterController, adminLoginController, logoutController, empLoginController } = require("../controllers/admin/adminCredentialsController");
const { adminHolidayInsertController, adminHolidaysFetchController, adminHolidayUpdateController } = require("../controllers/admin/adminHolidaysController");
const { adminRegionInsertController, adminRegionUpdateController, adminFetchAllRegionsController } = require("../controllers/admin/adminRegionController");
const { adminFetchRBMLeaveApplicationsController } = require("../controllers/admin/adminLeaveController");
const { adminAbmAreaInsertController, adminAbmAreaUpdateController, adminFetchAbmAreaController } = require("../controllers/admin/adminAbmController");
const { adminFieldTechnicianInsertController, adminFieldTechnicianUpdateController } = require("../controllers/admin/adminFieldTechnicianController");
const { adminFetchAbmWithRegionController, adminFetchFieldTechnicianHqWithAbmWithRegionController, adminFetchFieldTechnicianHqByAbmAreaController } = require("../controllers/admin/adminFetchController");
const { adminFetchAllClientDetailsController } = require("../controllers/admin/adminClientController");
const { adminFetchEmployeesController, adminEmployeesUpdateCredentialsController, adminInsertEmployeesController, adminUpdateEmployeesController } = require("../controllers/admin/adminEmpController");
const { adminFetchFieldTechnicianDailyVisitReportController } = require("../controllers/admin/adminDailyVisitReportController");

const router = express.Router();

// Define routes
router.get("/admin-fetch-designation", adminFetchDesignationsController);
router.post("/admin-register", adminRegisterController);
router.post("/admin-login", adminLoginController);
router.post('/employee-login', empLoginController);
router.post('/admin/admin-logout', logoutController);
router.post("/admin-insert-holiday", adminHolidayInsertController);
router.get("/admin-fetch-holiday", adminHolidaysFetchController);
router.post("/admin-update-holiday", adminHolidayUpdateController);
router.get("/admin-fetch-rbm-leave-applications", adminFetchRBMLeaveApplicationsController);
router.post("/admin-insert-region", adminRegionInsertController);
router.put('/admin-update-region', adminRegionUpdateController);
router.get('/admin-fetch-region', adminFetchAllRegionsController);
router.post("/admin-add-abm-area", adminAbmAreaInsertController);
router.put("/admin-update-abm-area", adminAbmAreaUpdateController);
router.post("/admin-fetch-abm-area-by-region", adminFetchAbmAreaController);
router.post("/admin-add-field-HQ", adminFieldTechnicianInsertController);
router.put("/admin-update-field-HQ", adminFieldTechnicianUpdateController);
router.get("/admin-fetch-all-abms-area", adminFetchAbmWithRegionController);
router.get("/admin-fetch-all-field-technician-hq", adminFetchFieldTechnicianHqWithAbmWithRegionController);
router.post("/admin-fetch-field-technician-hq-by-abm-area", adminFetchFieldTechnicianHqByAbmAreaController);
router.get('/admin-fetch_all_clients', adminFetchAllClientDetailsController);
router.get('/admin-fetch-employees', adminFetchEmployeesController);
router.post("/admin-update-credentials", adminEmployeesUpdateCredentialsController);
router.post("/admin-add-employee", adminInsertEmployeesController);
router.put('/admin-update-employee', adminUpdateEmployeesController);
router.get("/admin-fetch-daily-visit-report", adminFetchFieldTechnicianDailyVisitReportController);

module.exports = router;