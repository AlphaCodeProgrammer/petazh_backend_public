const Model = require("../models/model");
const User = require("../models/user")
const data = require("../data")


const postOnGetModels = async (req, res) => {
  try {
    let isMan = req.body.isMan;
    let models = await Model.find({ forMen: isMan, type: req.body.type });
    res.json({
      success: true,
      models: models,
    });

  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};


//get single favorite barber for show
const postOnGetSingleFavoriteModel = async (req, res) => {
  try {
    let model = await Model.find({ _id: req.body.modelId });
    res.json({
      success: true,
      model: model,
    });

  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};




// POST FAVORITE MODEL
const postFavoriteModelController = async (req, res) => {
  try {
    let userInfo = await User.findOne({
      _id: req.body.userId,
    })
    let favoriteModelId = req.body.favoriteModelId;
    let favoriteModelsArray = userInfo.favoriteModels

    function ExistFavoriteModel(isExist) {
      return isExist === favoriteModelId;
    }
    let isExistFavoriteModel = favoriteModelsArray.find(ExistFavoriteModel)
    if (isExistFavoriteModel === favoriteModelId) {
      res.json({
        status: false,
        msg: "Exist",
        isExistFavoriteModel: isExistFavoriteModel

      });
    } else {
      let allFavoriteModels = userInfo.favoriteModels;
      allFavoriteModels.push(favoriteModelId);
      userInfo.save();
      res.json({
        status: true,
        msg: "saved",
        userInfo: userInfo
      });

    }

  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};




//GET FAVORITE MODEL
const getFavoriteModelController = async (req, res) => {
  try {
    let getFavoriteModels = await User.findOne({ _id: req.body.userId });
    let getFavoriteModelsArray = getFavoriteModels.favoriteModels;
    const favoriteModelInfoArray = await Model.find({ _id: { $in: getFavoriteModelsArray } });
    res.json({
      success: true,
      favoriteModelInfoArray: favoriteModelInfoArray,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};




//DELET FAVORITE MODEL BY USER

const postOnDeleteFavoriteModelController = async (req, res) => {
  try {
    let userInfo = await User.findOne({
      _id: req.body.userId,
    })
    let modelId = req.body.modelId
    let favoriteModelsArray = userInfo.favoriteModels;
    const index = favoriteModelsArray.indexOf(modelId);
    if (index > -1) {
      favoriteModelsArray.splice(index, 1);
      userInfo.save();
    }
    res.json({
      status: true,
      userInfo: userInfo,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};




module.exports = {
  postOnGetModels: postOnGetModels,
  postFavoriteModelController: postFavoriteModelController,
  getFavoriteModelController: getFavoriteModelController,
  postOnDeleteFavoriteModelController: postOnDeleteFavoriteModelController,
  postOnGetSingleFavoriteModel: postOnGetSingleFavoriteModel

};
