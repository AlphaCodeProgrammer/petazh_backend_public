const router = require("express").Router();
const barberController = require("../controller/barber");





//post for get turns that didn't rated

// get all barbers
router.post("/get-barbers-list", barberController.postOnGetBarbersController);


router.post("/first-get-barbers-info", barberController.firstGetBarbers);

// get a single barber

router.post("/barbers/:id", barberController.getSingleBarberController);

//get single stylist select
router.post("/stylist/single-stylist-info", barberController.getSingleStylistController);


//Post Favorite Barbers
router.post("/favorite-barbers", barberController.postFavoriteBarberController);

//get favorite barbers
router.post("/get-favorite-barber-user", barberController.getFavoriteBarberController);

//Delete favorite barbers
router.post(
  "/delete-favorite-barber",
  barberController.postOnDeleteFavoriteBarberController
);

//Stylist Routes
//stylist/turn/:id
router.post("/stylistturn", barberController.getStylistTurnController);

//get filter
router.post("/filter-barber", barberController.getFilterBarber);

// get announcments
router.get("/get-ann", barberController.getAnn);

//post for read ann
router.post("/post-read-notification", barberController.postReadNotification);


module.exports = router;
