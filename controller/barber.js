const Barber = require("../models/barber");
const Turn = require("../models/turn");
const User = require("../models/user");
const Stylist = require("../models/stylist");
const lodash = require("lodash");
const Annu = require("../models/annu");
const data = require("../data")
const barberFunctions = require("../functions/barber");

//GET all barbers


const postOnGetBarbersController = async (req, res) => {
  try {

    let barbers = await Barber.find({
      Men: req.body.isMan,
      show: true,
      ban: false,
      barberCity: req.body.barberCity,
      "stylists.permisionByBarber": { $in: true },
      "stylists.stylistIsReady": { $in: true },

    });
    let readyToSendFrontend = await barberFunctions.getReadyBarbersForShow(
      barbers
    );
    res.json({
      success: true,
      barbers: readyToSendFrontend,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};


const firstGetBarbers = async (req, res) => {
  try {

    let barbers = await Barber.find({
      Men: req.body.isMan,
      show: true,
      ban: false,
      barberCity: req.body.barberCity,
      "stylists.permisionByBarber": { $in: true },
      "stylists.stylistIsReady": { $in: true },

    });

    if (barbers.length > 0) {

      let readyToSendFrontend = await barberFunctions.getReadyBarbersForShow(
        barbers
      );

      res.json({
        success: true,
        barbers: readyToSendFrontend,
      });
    } else {
      let replaceBarbers = await Barber.find({
        Men: req.body.isMan,
        show: true,
        ban: false,
        barberCity: "اصفهان",
        "stylists.permisionByBarber": { $in: true },
        "stylists.stylistIsReady": { $in: true },
      });
      let readyToSendFrontend = await barberFunctions.getReadyBarbersForShow(
        replaceBarbers
      );
      res.json({
        success: true,
        barbers: readyToSendFrontend,
      });
    }

  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};



//GET single Barber and stylist info in same request
const getSingleBarberController = async (req, res) => {
  try {
    let barber = await Barber.findOne({
      _id: req.params.id,
      show: true,
      ban: false,
    });

    if (lodash.isEmpty(barber) || barber.Men !== req.body.userIsMan) {
      res.json({
        success: false,
        msg: "مشکلی پیش آمده بعدا امتحان کنید",
      });
    } else {

      let barberStylistsArray = barber.stylists;
      let newBarberStylistsArray = await barberStylistsArray.filter(function (
        s
      ) {
        return s.permisionByBarber === true && s.stylistIsReady === true;
      });
      async function pureNumberStylists() {
        const stylistsObjects = await newBarberStylistsArray;
        let stylistNumberArray = [];
        for (let i = 0; i < stylistsObjects.length; i++) {
          await stylistNumberArray.push(stylistsObjects[i].number);
        }
        return stylistNumberArray;
      }
      let pureNumberStylistsArray = await pureNumberStylists();
      const barberStylist = await Stylist.find({
        stylistPhone: { $in: pureNumberStylistsArray },
        show: true,
        ban: false,
      });

      async function masterStylistInfoPush() {
        const stylistsInfo = await barberStylist;
        let stylistArrayInfo = [];
        for (let i = 0; i < stylistsInfo.length; i++) {
          if (stylistsInfo[i].stylistPhone === barber.masterPhone) {
            await stylistArrayInfo.push(stylistsInfo[i]);
          }
        }
        for (let i = 0; i < stylistsInfo.length; i++) {
          if (stylistsInfo[i].stylistPhone !== barber.masterPhone) {
            await stylistArrayInfo.push(stylistsInfo[i]);
          }
        }
        return stylistArrayInfo;
      }
      let masterStylistInfoArray = await masterStylistInfoPush();

      async function mappingData() {
        const beforMapping = await masterStylistInfoArray;
        const stylistVSelectArray = await beforMapping.map((a) => {
          return {
            id: a._id,
            stylistName: a.stylistName + " " + a.stylistLastName,
            stylistPhone: a.stylistPhone,
            stylistPhoto: a.stylistPhoto
          };
        });
        barber.stylists = [""];
        barber.barberPhone = "";
        barber.licenseNumber = "";
        if (masterStylistInfoArray.length > 0) {
          masterStylistInfoArray[0].password = "";
          masterStylistInfoArray[0].commission = 0;
          masterStylistInfoArray[0].sheba = "";
          masterStylistInfoArray[0].nationalId = "";
          masterStylistInfoArray[0].email = "";
          masterStylistInfoArray[0].wallet = 0;
        }
        return stylistVSelectArray;
      }

      let vSelectIsReady = await mappingData();
      const masterStylistTurnsOnTable = await Turn.find({
        stylistId: masterStylistInfoArray[0].id,
        selfAdded: false,
        Accepted: true,
        "userChanged.rejected": false,
        "stylistChanged.rejected": false,
      }).limit(50);

      const turnDate = [];
      for (
        let indexOfTurns = 0;
        indexOfTurns < masterStylistTurnsOnTable.length;
        indexOfTurns++
      ) {
        const getInfoTurnInPublic = {
          Accepted: masterStylistTurnsOnTable[indexOfTurns].Accepted,
          StartIn: masterStylistTurnsOnTable[indexOfTurns].turnDate.StartIn,
          EndIn: masterStylistTurnsOnTable[indexOfTurns].turnDate.EndIn,
          ColorTurn: masterStylistTurnsOnTable[indexOfTurns].turnDate.ColorTurn,
          name: "رزور شده",
        };
        turnDate.push(getInfoTurnInPublic);
      }

      res.json({
        success: true,
        barber: barber,
        stylist: vSelectIsReady,
        masterStylistInfo: masterStylistInfoArray[0],
        turnsOfPublic: turnDate,

      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

//get single select stylist

const getSingleStylistController = async (req, res) => {
  try {
    const styler = await Stylist.findOne({ _id: req.body.stylistIdFront });
    if (lodash.isEmpty(styler)) {
      res.json({
        success: false,
        msg: "there is not such this id for barber",
      });
    } else {
      const masterStylistTurnsOnTable = await Turn.find({
        stylistId: req.body.stylistIdFront,
        selfAdded: false,
        Accepted: true,
        "userChanged.rejected": false,
        "stylistChanged.rejected": false,
      });

      const turnDate = [];
      for (
        let indexOfTurns = 0;
        indexOfTurns < masterStylistTurnsOnTable.length;
        indexOfTurns++
      ) {
        const getInfoTurnInPublic = {
          Accepted: masterStylistTurnsOnTable[indexOfTurns].Accepted,
          StartIn: masterStylistTurnsOnTable[indexOfTurns].turnDate.StartIn,
          EndIn: masterStylistTurnsOnTable[indexOfTurns].turnDate.EndIn,
          ColorTurn: masterStylistTurnsOnTable[indexOfTurns].turnDate.ColorTurn,
          name: "رزور شده",
        };
        turnDate.push(getInfoTurnInPublic);
      }
      res.json({
        success: true,
        styler: styler,
        masterStylistTurnsOnTable: masterStylistTurnsOnTable,
        turnsOfPublic: turnDate,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

//post favorite barber
const postFavoriteBarberController = async (req, res) => {
  try {
    let userInfo = await User.findOne({
      _id: req.body.userId,
    });
    let favoriteBarberId = req.body.favoriteBarberId;
    let favoriteBarbersArray = userInfo.favoriteBarbers;

    function ExistFavoriteBarber(isExist) {
      return isExist === favoriteBarberId;
    }
    let isExistFavoriteBarber = favoriteBarbersArray.find(ExistFavoriteBarber);
    if (isExistFavoriteBarber === favoriteBarberId) {
      res.json({
        status: false,
        msg: "Exist",
        isExistFavoriteBarber: isExistFavoriteBarber,
      });
    } else {
      let allFavoriteBarbers = userInfo.favoriteBarbers;
      allFavoriteBarbers.push(favoriteBarberId);
      userInfo.save();

      let userInfo = await User.findOne({
        _id: req.body.userId,
      });
      res.json({
        status: true,
        msg: "saved",
        userInfo: userInfo,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

//delete favorite barber
const postOnDeleteFavoriteBarberController = async (req, res) => {
  try {
    let userInfo = await User.findOne({
      _id: req.body.userId,
    });
    let barberId = req.body.barberId;
    let favoriteBarbersArray = userInfo.favoriteBarbers;

    const index = favoriteBarbersArray.indexOf(barberId);
    if (index > -1) {
      favoriteBarbersArray.splice(index, 1);
      userInfo.save();
    }
    res.json({
      success: true,
      userInfo: userInfo,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

// get stylist turn
const getStylistTurnController = async (req, res) => {
  try {
    let turns = await Turn.find({ stylistId: req.body.stylistId });
    const allTurns = turns;
    const allTurnsLength = turns.length;
    const turnDate = [];
    for (let indexOfTurns = 0; indexOfTurns < allTurnsLength; indexOfTurns++) {
      const getInfoTurnInPublic = {
        Accepted: allTurns[indexOfTurns].Accepted,
        StartIn: allTurns[indexOfTurns].turnDate.StartIn,
        EndIn: allTurns[indexOfTurns].turnDate.EndIn,
        ColorTurn: allTurns[indexOfTurns].turnDate.ColorTurn,
        name: "رزور شده",
      };
      if (getInfoTurnInPublic.Accepted) {
        turnDate.push(getInfoTurnInPublic);
      }
    }
    res.json({
      success: true,
      turnsOfPublic: turnDate,
      // turns:turns
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const getFilterBarber = async (req, res) => {
  try {
    let speceficBarbers = await Barber.find({
      Men: req.body.isMan,
      show: true,
      ban: false,
      barberCity: req.body.barberCity,
      "stylists.permisionByBarber": { $in: true },
      "stylists.stylistIsReady": { $in: true },
    });
    if (!req.body.searchBox.isEmpty) {
      let filteredBarbers = await barberFunctions.barberFilterSearchBox(
        speceficBarbers,
        req.body.searchBox
      );
      res.json({
        success: true,
        speceficBarbers: filteredBarbers,
      });
    } else {
      res.json({
        success: true,
        speceficBarbers: speceficBarbers,
      });
    }
  } catch (err) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const getFavoriteBarberController = async (req, res) => {
  try {
    let userInfo = await User.findOne({
      _id: req.body.userId,
    });
    let barberFavoritesId = userInfo.favoriteBarbers;
    let getFavoriteBarbersArray = await Barber.find({
      _id: { $in: barberFavoritesId },
      show: true,
      ban: false,
    });
    let finalFavoriteBarbers = barberFunctions.getReadyBarbersForShow(
      getFavoriteBarbersArray
    );

    res.json({
      success: true,
      getFavoriteBarbersArray: finalFavoriteBarbers,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const getAnn = async (req, res) => {
  try {
    const ann = await Annu.find();
    res.json({
      success: true,
      ann: ann,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};
const postReadNotification = async (req, res) => {
  try {
    const postAnn = await Annu.findOne({ _id: req.body.notificationId });
    let exist = postAnn.readed.includes(req.body.userId);
    if (exist) {
      res.json({
        success: false,
        postAnn: postAnn,
      });
    } else {
      let posted = await postAnn.readed.push(req.body.userId);
      await postAnn.save();
      res.json({
        success: true,
        posted: posted,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

module.exports = {
  postOnGetBarbersController: postOnGetBarbersController,
  getSingleBarberController: getSingleBarberController,
  postFavoriteBarberController: postFavoriteBarberController,
  postOnDeleteFavoriteBarberController: postOnDeleteFavoriteBarberController,
  getFavoriteBarberController: getFavoriteBarberController,
  getStylistTurnController: getStylistTurnController,
  getSingleStylistController: getSingleStylistController,
  getFilterBarber: getFilterBarber,
  getAnn: getAnn,
  postReadNotification: postReadNotification,
  firstGetBarbers: firstGetBarbers
};
