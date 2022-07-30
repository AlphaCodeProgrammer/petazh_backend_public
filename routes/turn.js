const router = require("express").Router();
const turnController = require("../controller/turn");


router.post("/turn-for-rate", turnController.postToGetTurnCheckRateController);


//reject for rating by user
// router.post("/reject-rating", turnController.rejectRating);


//post for rating tated: false => true and post rate (1,2,3,4,5)
router.post("/post-turn-rating", turnController.postRating);


//Reject Turn By User
router.post(
  "/reject-turn-by-user",
  turnController.postOnRejectTurnByUserController
);


// post turn from user to barber  
router.post("/turn", turnController.postBarberTurn);


router.post("/update-floatingPrice", turnController.updateFloatingPrice);


router.post("/edite-turn-services", turnController.getInfoEditeTurnServices);


router.post("/update-turn-service", turnController.updateTurnServicesByUser);


//Get user Requests for user side
router.post("/get-turns", turnController.getTurnController);


//Get single Turn
router.post("/turndetails/:id", turnController.getSingleTurnController);

// off code saved in turn for off 
router.post("/post-moocut-off-code", turnController.postMoocutOff);

router.post("/turn-wallet-payment", turnController.turnPaymentWalletMethod);


// getTurnNotifications for badge
router.post("/turn-notification", turnController.getTurnNotifications);


//disable trun notification for single turn
router.post("/disable-turn-notification/:id", turnController.disableNotificationByUser);


//disable trun notification for single turn rejected 
router.post("/disable-rejected-notification/:id", turnController.disableRejectedNotification);

router.post("/get-rating-turn", turnController.getUnratedTurns);


router.post("/turn-details-rating/:id", turnController.turnDetailsRating);

module.exports = router;
