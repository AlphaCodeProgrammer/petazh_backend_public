const Model = require("../models/model");
const Turn = require("../models/turn");
const User = require("../models/user");
const Admin = require("../models/admin");
const Barber = require("../models/barber");
const Stylist = require("../models/stylist");
const turnFunctions = require("../functions/turn");
const Income = require("../models/income");
const data = require("../data");
const dataFunction = require("../functions/dataFunction");

//reject turn by user
const postOnRejectTurnByUserController = async (req, res) => {
  try {
    let rejectTurnByUser = await Turn.findOne({
      _id: req.body._id,
      finished: false,
    });
    if (rejectTurnByUser) {
      rejectTurnByUser.userChanged.changed = true;
      rejectTurnByUser.userChanged.rejected = true;
      rejectTurnByUser.userChanged.time = new Date().toISOString();
      rejectTurnByUser.endTime = new Date().toISOString();

      await rejectTurnByUser.save();

      res.json({
        success: true,
        rejectTurnByUser: rejectTurnByUser,
        msg: "نوبت با موفقیت لغو شد",
      });
    } else {
      res.json({
        success: true,
        msg: "این نوبت در دسترس نیست",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const postBarberTurn = async (req, res) => {
  try {
    let frontendServices = req.body.services;
    let hasTurn = await Turn.find({
      userId: req.body.userId,
      finished: false,
      "userChanged.rejected": false,
      "stylistChanged.rejected": false,
    });

    if (hasTurn.length >= 1) {
      return res.json({
        success: true,
        mobileSuccess: false,
        msg: "hasTurn",
        message: "شما در حال حاضر یک نوبت فعال دارید ",
        hasTurn: hasTurn,
        turnId: hasTurn[0]._id,
      });
    } else {
      let userInfo = await User.findOne({ _id: req.body.userId });
      let userDidUsedReferral = await Turn.find({
        userId: req.body.userId,
        finished: true,
        onlinePaid: true,
        offReferral: true,
      });
      let invitedUsers = await User.find({
        invitationCode: userInfo.referralCode,
      })
        .where("date")
        .gte(new Date("2029-01-30T03:30:00.345+00:00"));

      //.gte filter users that registered after that time for example "2025-01-30T03:30:00.345+00:00"
      let getStylist = await Stylist.findOne({ _id: req.body.stylistId });
      let stylistServices = getStylist.services;
      let checkoutResult = await turnFunctions.checkServices(
        frontendServices,
        stylistServices
      );

      // finalServices
      if (checkoutResult.isValid == true) {
        let totalPrice = await turnFunctions.calculateTotalPrice(
          checkoutResult.finalServices
        );
        let turn = new Turn();
        turn.barberId = req.body.barberId;
        turn.userId = req.body.userId;
        turn.barberName = req.body.barberName;
        turn.stylistId = req.body.stylistId;
        turn.textToStylist = req.body.textToStylist;
        turn.modelImages = req.body.modelImages;
        turn.username = userInfo.username;
        turn.services = checkoutResult.finalServices;
        turn.totalServicesPrice = totalPrice;
        turn.offReferral =
          userDidUsedReferral.length > 0 || invitedUsers.length < 2
            ? false
            : true;
        turn.requestDate = new Date().toISOString();

        await turn.save();
        res.json({
          status: true,
          mobileSuccess: true,
          msg: "turn Successfully saved",
          message: "نوبت شما با موفقیت ثبت شد"
        });
      } else {
        res.json({
          success: true,
          message: "بعضی از خدمات توسط آرایشگر از دسترس خارج شده است"
        });
      }


    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const getTurnController = async (req, res) => {
  try {
    let getTurnsInfo = await Turn.find({
      userId: req.body.userId,
      show: true,
      "userChanged.rejected": false,
      selfAdded: false,
    });
    if (getTurnsInfo.length >= 1) {
      let getTurnUserId = getTurnsInfo[0].userId;
      let getUserPasswordChecker = await User.findOne({ _id: getTurnUserId });

      if (getUserPasswordChecker.password === req.body.password) {

        return res.json({
          success: true,
          getTurnsInfo: getTurnsInfo,
        });
      }
    } else {
      return res.json({
        success: false,
        getTurnsInfo: [],
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};



const updateFloatingPrice = async (req, res) => {
  try {
    let getfloatingPrice = req.body.floatingPrice;
    let getUserInfo = await User.findOne({
      _id: req.body.userId,
      password: req.body.password,
    });
    if (getUserInfo != null && typeof getfloatingPrice === "number" && !isNaN(getfloatingPrice)) {
      let getTurnsInfo = await Turn.findOneAndUpdate({
        userId: req.body.userId,
        show: true,
        "userChanged.rejected": false,
        "stylistChanged.rejected": false,
        selfAdded: false,
        onlinePaid: false,
        _id: req.body.turnId
      }, { floatingPrice: getfloatingPrice });

      if (getTurnsInfo != null) {

        res.json({
          success: true,
        });

      }
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};


const getInfoEditeTurnServices = async (req, res) => {
  try {

    let getUserInfo = await User.findOne({
      _id: req.body.userId,
      password: req.body.password,
    });
    if (getUserInfo != null) {
      let getTurnsInfo = await Turn.findOne({
        userId: req.body.userId,
        show: true,
        "userChanged.rejected": false,
        "stylistChanged.rejected": false,
        selfAdded: false,
        _id: req.body.turnId
      });

      let getStylistInfo = await Stylist.findOne({
        _id: getTurnsInfo.stylistId,

      });


      if (getTurnsInfo != null) {

        res.json({
          success: true,
          getTurnsInfo: getTurnsInfo,
          getStylisServices: getStylistInfo.services
        });

      }
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};


const updateTurnServicesByUser = async (req, res) => {
  try {

    let getUserInfo = await User.findOne({
      _id: req.body.userId,
      password: req.body.password,
    });
    if (getUserInfo != null) {
      let newServices = req.body.servicesForUpdate;
      let stylistInfo = await Stylist.findOne({
        _id: req.body.stylistId,
      });
      if (stylistInfo != null) {
        let checkoutResult = await turnFunctions.checkServices(
          newServices,
          stylistInfo.services
        );
        // finalServices
        if (checkoutResult.isValid == true) {
          let totalPrice = await turnFunctions.calculateTotalPrice(
            checkoutResult.finalServices
          );

          let turnInfo = await Turn.findOne({
            _id: req.body.turnId,
          });
          turnInfo.floatingPrice = 0;
          turnInfo.services = checkoutResult.finalServices;
          turnInfo.totalServicesPrice = totalPrice;
          turnInfo.userChanged.changed = true;
          turnInfo.lastModify = new Date().toISOString();

          await turnInfo.save();

          res.json({
            success: true,

          });


        } else {
          res.json({
            success: false,

          });

        }
      } else {
        res.json({
          success: false,

        });

      }

    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};



const turnPaymentWalletMethod = async (req, res) => {
  try {
    let getUserInfo = await User.findOne({
      _id: req.body.userId,
      password: req.body.password,

    });
    if (getUserInfo != null) {
      let turnInfo = await Turn.findOne({
        userId: req.body.userId,
        _id: req.body.turnId
      });

      let totalPriceOfTurn = await (turnInfo.totalServicesPrice + turnInfo.floatingPrice);
      if (turnInfo != null && getUserInfo.wallet >= totalPriceOfTurn) {

        let updateUserWallet = await User.findOneAndUpdate({
          _id: turnInfo.userId,
          password: req.body.password,
        }, { $inc: { wallet: - totalPriceOfTurn } });

        if (updateUserWallet != null) {
          await Turn.updateOne({
            _id: req.body.turnId,
            "userChanged.rejected": false,
            "stylistChanged.rejected": false,
            selfAdded: false,
            show: true,
            Accepted: true,
            onlinePaid: false,
          }, { onlinePaid: true, finished: true });


          let calculateStylistPrice = await dataFunction.calculateCommission(totalPriceOfTurn);

          let stylistPayment = calculateStylistPrice.stylistPayment;
          let stylist = await Stylist.findOneAndUpdate({
            _id: turnInfo.stylistId,
          }, { $inc: { wallet: + stylistPayment } });

          let newIncome = new Income({
            stylistInfo: stylist.wallet,
            userInfo: getUserInfo.wallet,
            turnInfo: turnInfo,
            income: calculateStylistPrice.commissionPriceOfPetazh

          })
          await newIncome.save();
          res.json({
            success: true,
            msg: "با موفقیت پرداخت شد"
          });

        } else {
          res.json({
            success: false,
            msg: "خطایی رخ داده است"
          });
        }

      } else {
        res.json({
          success: false,
          msg: "موجودی ناکافی"

        });

      }

    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};



const getSingleTurnController = async (req, res) => {
  try {
    let turn = await Turn.findOne({ _id: req.params.id });
    let stylist = await Stylist.findOne({ _id: turn.stylistId });
    const getFullModelImages = await Model.find({
      _id: { $in: turn.modelImages },
    });



    let userIdForCheck = turn.userId;
    let validUser = await User.findOne({ _id: userIdForCheck });

    if (validUser.password === req.body.password) {
      return res.json({
        success: true,
        stylistPhoto: stylist.stylistPhoto,
        stylistName: stylist.stylistName + stylist.stylistLastName,
        turn: turn,
        turnImages: getFullModelImages,
        msg: "کاربر مجاز",
      });
    } else {
      return res.json({
        success: false,
        msg: "کاربر غیر مجاز",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const postMoocutOff = async (req, res) => {
  try {
    let adminPhone = "09134931360";
    let adminOff = await Admin.findOne({ phone: adminPhone });
    if (
      adminOff.offCode.enable !== true ||
      adminOff.offCode.code !== req.body.moocutOffCode
    ) {
      res.json({
        success: false,
        msg: "کد تخفیف اشتباه است",
      });
    } else {
      let getTurnsInfo = await Turn.findOne({ _id: req.body.turnId });
      getTurnsInfo.offMoocutCode = req.body.moocutOffCode;
      getTurnsInfo.save();
      res.json({
        success: true,
        msg: "کد تخفیف با موفقیت ثبت شد",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const getTurnNotifications = async (req, res) => {
  try {
    let turnsNotification = await Turn.findOne({
      userId: req.body.userId,
      "stylistChanged.changed": true,
      show: true,
    });
    if (turnsNotification) {
      res.json({
        success: true,
        turnsNotification: turnsNotification,
      });
    } else {
      res.json({
        success: false,
        turnsNotification: {
          stylistChanged: {
            changed: false,
          },
        },
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const disableNotificationByUser = async (req, res) => {
  try {
    let turnsNotification = await Turn.findOne({ _id: req.params.id });
    turnsNotification.stylistChanged.changed = false;
    turnsNotification.save();
    res.json({
      success: true,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const disableRejectedNotification = async (req, res) => {
  try {
    let turnsNotification = await Turn.findOne({ _id: req.params.id });
    turnsNotification.stylistChanged.changed = false;
    turnsNotification.show = false;
    turnsNotification.save();
    res.json({
      success: true,
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};
//get turn for check user rated
const postToGetTurnCheckRateController = async (req, res) => {
  try {
    let turnUuRated = await Turn.findOne({
      userId: req.body.userId,
      rated: false,
      finished: true,
    });
    if (turnUuRated !== null) {
      let stylistTurn = await Stylist.findOne({ _id: turnUuRated.stylistId });
      let barberInfo = await Barber.findOne({ _id: turnUuRated.barberId });

      return res.json({
        success: true,
        info: {
          turnId: turnUuRated._id,
          stylistInfo: {
            stylistFullName:
              stylistTurn.stylistName + " " + stylistTurn.stylistLastName,
            stylistPhoto: stylistTurn.stylistPhoto,
          },
          barberInfo: {
            barberName: barberInfo.barberName,
            barberPhoto: barberInfo.barberPhoto,
          },
        },
      });
    } else {
      return res.json({
        success: false,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};

const postRating = async (req, res) => {
  try {
    const turnId = req.body.turnId;
    let ratingDate = req.body.ratingDate;
    let checkRatedBefore = await Turn.findOne({ _id: turnId });


    if (checkRatedBefore.rated === true) {
      res.json({
        success: false,
        msg: "قبلا امتیاز داده شده است",
      });
    } else {
      let userInfo = await User.findOne({ _id: checkRatedBefore.userId, password: req.body.password });
      if (userInfo != null) {
        let barberInfo = await Barber.findOne({ _id: checkRatedBefore.barberId });

        let pushRates = () => {
          var design = ratingDate.barberRating.barberDesign;
          var pastRating = barberInfo.rating.barberDesign.quantity * barberInfo.rating.barberDesign.rate;
          barberInfo.rating.barberDesign.quantity += 1;
          pastRating += design;
          barberInfo.rating.barberDesign.rate = (pastRating / barberInfo.rating.barberDesign.quantity).toFixed(1);

          var access = ratingDate.barberRating.accessible;
          var pastRatingA = barberInfo.rating.accessible.quantity * barberInfo.rating.accessible.rate;
          barberInfo.rating.accessible.quantity += 1;
          pastRatingA += access;

          barberInfo.rating.accessible.rate += access;
          barberInfo.rating.accessible.rate = (pastRatingA / barberInfo.rating.accessible.quantity).toFixed(1);
        };
        await pushRates();
        checkRatedBefore.rated = true;
        await checkRatedBefore.save();
        await barberInfo.save();

        let stylistInfo = await Stylist.findOne({
          _id: checkRatedBefore.stylistId,
        });
        // console.log(stylistInfo);

        let stylistChanges = () => {
          for (let i = 0; i < ratingDate.serviceRating.length; i++) {
            let index = stylistInfo.services.findIndex((service) => service.id == ratingDate.serviceRating[i].id);
            if (index >= 0) {
              var newRate = ratingDate.serviceRating[i].rating;
              var pastRating = stylistInfo.services[index].rating.quantity * stylistInfo.services[index].rating.rate;
              stylistInfo.services[index].rating.quantity += 1;
              pastRating += newRate;
              stylistInfo.services[index].rating.rate = (pastRating / stylistInfo.services[index].rating.quantity).toFixed(1);
            }
          }
          var newGreeting = ratingDate.stylistRating.greeting;
          var pastRating = stylistInfo.rating.greeting.quantity * stylistInfo.rating.greeting.rate;
          stylistInfo.rating.greeting.quantity += 1;
          pastRating += newGreeting;
          stylistInfo.rating.greeting.rate = (pastRating / stylistInfo.rating.greeting.quantity).toFixed(1);

          var newMatching = ratingDate.stylistRating.matching;
          var pastRatingM = stylistInfo.rating.matching.quantity * stylistInfo.rating.matching.rate;
          stylistInfo.rating.matching.quantity += 1;
          pastRatingM += newMatching;
          stylistInfo.rating.matching.rate = (pastRatingM / stylistInfo.rating.matching.quantity).toFixed(1);

          var newSatisfaction = ratingDate.stylistRating.satisfaction;
          var pastRatingS = stylistInfo.rating.satisfaction.quantity * stylistInfo.rating.satisfaction.rate;
          stylistInfo.rating.satisfaction.quantity += 1;
          pastRatingS += newSatisfaction;
          stylistInfo.rating.satisfaction.rate = (pastRatingS / stylistInfo.rating.satisfaction.quantity).toFixed(1);

          return stylistInfo;
        };
        let newStylistInfo = await stylistChanges();

        await Stylist.updateOne({
          _id: checkRatedBefore.stylistId,
        }, {
          services: newStylistInfo.services, "rating.greeting": newStylistInfo.rating.greeting, "rating.matching": newStylistInfo.rating.matching, "rating.satisfaction": newStylistInfo.rating.satisfaction
        });

        res.json({
          success: true,
          msg: "امتیاز شما با موفقیت ثبت شد",
        });
      } else {
        res.json({
          success: false,
          msg: "مشکلی پیش آمده است",
        });
      }

    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
};



const getUnratedTurns = async (req, res) => {
  try {
    let turns = await Turn.find({ userId: req.body.userId, finished: true, rated: false });

    res.json({
      success: true,
      turns: turns
    });

  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
  });  }
};



const turnDetailsRating = async (req, res) => {
  try {
    let turn = await Turn.findOne({ _id: req.params.id });
    let stylist = await Stylist.findOne({ _id: turn.stylistId });


    let userIdForCheck = turn.userId;
    let validUser = await User.findOne({ _id: userIdForCheck });

    if (validUser.password === req.body.password) {
      return res.json({
        success: true,
        stylistPhoto: stylist.stylistPhoto,
        stylistName: stylist.stylistName + stylist.stylistLastName,
        turn: turn,
        msg: "کاربر مجاز",
      });
    } else {
      return res.json({
        success: false,
        msg: "کاربر غیر مجاز",
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
  postOnRejectTurnByUserController: postOnRejectTurnByUserController,
  postBarberTurn: postBarberTurn,
  getTurnController: getTurnController,
  getSingleTurnController: getSingleTurnController,
  postMoocutOff: postMoocutOff,
  postRating: postRating,
  // rejectRating: rejectRating,
  postToGetTurnCheckRateController: postToGetTurnCheckRateController,
  getTurnNotifications: getTurnNotifications,
  disableNotificationByUser: disableNotificationByUser,
  disableRejectedNotification: disableRejectedNotification,
  updateFloatingPrice: updateFloatingPrice,
  getInfoEditeTurnServices: getInfoEditeTurnServices,
  updateTurnServicesByUser: updateTurnServicesByUser,
  turnPaymentWalletMethod: turnPaymentWalletMethod,
  getUnratedTurns: getUnratedTurns,
  turnDetailsRating: turnDetailsRating
};
