const express = require("express");
const { rbmFetchFieldTechnicianHQController } = require("../controllers/rbm/RbmFieldTechnicianController");
const { rbmFetchFieldTechnicianDailyVisitReportController } = require("../controllers/rbm/RbmDailyVisitReportController");
const { fetchRbmLeaveApplicationController, fetchAllRbmLeaveApplicationsController } = require("../controllers/rbm/RbmLeaveController");
const { rbmFetchAbmByRegionIdController, fetchRbmAllRegionByUserIdController } = require("../controllers/rbm/RbmAbmController");

const router = express.Router();

// Change GET to POST because you're expecting JSON body
router.post("/rbm-fetch-abm-region", rbmFetchAbmByRegionIdController);
router.post("/rbm-fetch-rbm-region", fetchRbmAllRegionByUserIdController);
router.post("/rbm-fetch-field-technician-hq", rbmFetchFieldTechnicianHQController);
router.post("/rbm-fetch-daily-visit-report", rbmFetchFieldTechnicianDailyVisitReportController);
router.post("/rbm-fetch-abm-leave-application", fetchRbmLeaveApplicationController);
router.post("/rbm-fetch-rbm-leave-application", fetchAllRbmLeaveApplicationsController);


module.exports = router;
