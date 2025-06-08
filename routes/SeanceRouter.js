const express = require("express");
const router = express.Router();
const SeanceController = require("../controllers/SeanceController");

router.post("/addseance", SeanceController.addseance);
router.get("/getAllSeances", SeanceController.getAllSeances);
router.get("/getAllSeancesWithReservationCount", SeanceController.getSeancesWithReservationCount);
router.get('/getSeanceById/:id',SeanceController.getSeanceById);
router.put('/updateSeance/:id',SeanceController.updateSeance);
router.delete('/deleteSeanceById/:id',SeanceController.deleteSeanceById);
router.put('/affect',SeanceController.affect);
router.get('/getSeancesByActivite/:activiteId', SeanceController.getSeancesByActivite);
//router.get('/getCoachSeances/:coachId', SeanceController.getCoachSeances);




module.exports = router;