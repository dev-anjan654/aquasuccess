const express = require("express");
const { fieldTechnicianDistributionFetchController, fieldTechnicianClientDetailsInsertController, fieldTechnicianClientTypesFetchController, fieldTechnicianClientDetailsFetchByRouteController, fieldTechnicianClientDetailsUpdateController } = require("../controllers/fieldTechnician/FieldTechnicianClientController");
const { fieldTechnicianHqFetchController } = require("../controllers/fieldTechnician/FieldTechnicianHqController");
const { fieldTechnicianLeaveTypeFetchController, fieldTechnicianLeaveApplicationInsertController, fieldTechnicianLeaveApplicationUpdateController, fetchFieldTechnicianLeaveApplicationsController } = require("../controllers/fieldTechnician/FieldTechnicianLeaveController");
const { fieldTechnicianRouteInsertController, fieldTechnicianRouteUpdateController, fieldTechnicianRouteFetchController } = require("../controllers/fieldTechnician/FieldTechnicianRouteController");
const { fieldTechnicianClientDetailsFetchByTourPlaneController, fieldTechnicianTourPlaneInsertController, fieldTechnicianTourPlaneUpdateController, fieldTechnicianTourPlaneFetchController } = require("../controllers/fieldTechnician/FieldTechnicianTourPlaneController");
const { addDailyVisitReport, fetchWorkingDays, fetchTotalKmTraveled, fetchTotalOrderValues, fetchTotalAgentVisit, fetchTotalCustomerVisit, fetchTourPlanOnDailyReport, fieldTechnicianDailyVisitReportController, fieldTechnicianDailyVisitReportFetchByIdController } = require("../controllers/fieldTechnician/FieldTechnicianDailyVisitReportController");



const router = express.Router();

// Define routes
router.get("/field-technician-fetch-distributions", fieldTechnicianDistributionFetchController);
router.post("/field-technician-add-client-details", fieldTechnicianClientDetailsInsertController);
router.get('/field-technician-fetch-client-types', fieldTechnicianClientTypesFetchController);
router.get('/field-technician-fetch-clients-by-route', fieldTechnicianClientDetailsFetchByRouteController);
router.put('/field-technician-update-client-details', fieldTechnicianClientDetailsUpdateController);
router.post("/field-technician-fetch-hq", fieldTechnicianHqFetchController);

router.get('/field-technician-fetch-all-leave-type', fieldTechnicianLeaveTypeFetchController);
router.post('/field-technician-add-leave-application', fieldTechnicianLeaveApplicationInsertController);
router.put('/field-technician-update-leave-application', fieldTechnicianLeaveApplicationUpdateController);
router.post("/field-technician-fetch-leave-application", fetchFieldTechnicianLeaveApplicationsController);

router.post('/field-technician-add-route', fieldTechnicianRouteInsertController);
router.put('/field-technician-edit-route', fieldTechnicianRouteUpdateController);
router.get('/field-technician-fetch-route', fieldTechnicianRouteFetchController);

router.post('/field-technician-fetch-client-by-route-by-tour-plane', fieldTechnicianClientDetailsFetchByTourPlaneController);
router.post('/field-technician-add-tour-plane', fieldTechnicianTourPlaneInsertController);
router.put('/field-technician-update-tour-plane', fieldTechnicianTourPlaneUpdateController);
router.post('/field-technician-fetch-all-tour-plane', fieldTechnicianTourPlaneFetchController);

router.post("/field-technician-add-daily-visit-report", addDailyVisitReport);
router.post("/field-technician-fetch-calculate-working-days", fetchWorkingDays);
router.post("/field-technician-fetch-calculate-km-traveleds", fetchTotalKmTraveled);
router.post("/field-technician-fetch-calculate-order-values", fetchTotalOrderValues);
router.post("/field-technician-fetch-calculate-agent-visit", fetchTotalAgentVisit);
router.post("/field-technician-fetch-calculate-customer-visit", fetchTotalCustomerVisit);
router.post("/field-technician-fetch-all-customer-on-daily-visit-report", fetchTourPlanOnDailyReport);
router.post("/field-technician-fetch-daily-visit-report", fieldTechnicianDailyVisitReportController);
router.post('/field-technician-fetch-daily-visit-report-by-id', fieldTechnicianDailyVisitReportFetchByIdController);


module.exports = router;
