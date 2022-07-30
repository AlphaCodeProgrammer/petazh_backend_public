const router = require("express").Router();
const modelController = require("../controller/model");



router.post("/get-models",modelController.postOnGetModels);

//get single favorite barber
router.post("/get-single-model",modelController.postOnGetSingleFavoriteModel);


//Post Favorite model
router.post("/post-favorite-model", modelController.postFavoriteModelController);

//Get favorites models
router.post("/get-favorite-model", modelController.getFavoriteModelController);


router.post(
    "/delete-favorite-model",
    modelController.postOnDeleteFavoriteModelController
  );


module.exports = router;
