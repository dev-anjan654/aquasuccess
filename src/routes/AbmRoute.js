const express = require("express");
const { abmFetchAbmAreaController } = require("../controllers/abm/AbmAreaController");
const { abmFetchFieldTechnicianDailyVisitReportController } = require("../controllers/abm/AbmDailyVisitReportController");
const { abmFetchFieldTechnicianHqController } = require("../controllers/abm/AbmFieldTechnicianController");
const { abmfetchFieldTechnicianLeaveApplicationsController, updateLeaveApplicationStatusController, fetchAbmLeaveApplicationsController } = require("../controllers/abm/AbmLeaveController");

const router = express.Router();

// Route for fetching AbmArea
router.post("/abm-fetch-abm-area", abmFetchAbmAreaController);
router.post("/abm-fetch-daily-visit-report", abmFetchFieldTechnicianDailyVisitReportController);
router.post("/abm-fetch-field-technician-hq", abmFetchFieldTechnicianHqController);
router.post("/abm-fetch-leave-applications", fetchAbmLeaveApplicationsController);
router.post("/abm-fetch-field-tech-leave-application", abmfetchFieldTechnicianLeaveApplicationsController);
router.put("/abm-update-leave-application-status", updateLeaveApplicationStatusController);


module.exports = router;
