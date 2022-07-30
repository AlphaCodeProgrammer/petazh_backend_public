const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/user");
const Offer = require("../models/offer");
const Intro = require("../models/intro");
const Otp = require("../models/otp");
const validRegisterOtp = require("../models/validRegisterOtp");
const validForgetPassOtp = require("../models/validForgetPass");
const key = require("../config/keys").secret;
const axios = require("axios");
const userFunctions = require("../functions/user");
const Product = require("../models/product");
const Order = require("../models/order");
const userPayment = require("../models/userPayment");

const dataFunction = require("../functions/dataFunction");

dotenv.config();





router.post("/register/check", async (req, res) => {
  try {
    let phone = req.body.phone;
    if (phone.length === 11) {
      let userInfo = await User.findOne({ phone: phone });
      if (userInfo) {
        return res.json({
          success: false,
          msg: "این شماره قبلا ثبت نام شده است",
          showForm: false,
        });
      }
      if (!userInfo) {
        let findValidOtp = await validRegisterOtp.findOne({
          phone: req.body.phone,
        });
        if (findValidOtp) {
          res.json({
            success: true,
            msg: "نام کاربری و رمز عبور خود را وارد کنید",
            showForm: true,
          });
        } else {
          let existInOtpCollection = await Otp.findOne({
            phone: req.body.phone,
          });
          if (existInOtpCollection) {
            let nexSendOtpCode = await userFunctions.nextSendCode(
              existInOtpCollection.createdAt
            );
            return res.json({
              success: true,
              msg: `کد برای شما ارسال شده است و شما میتوانید تا ${nexSendOtpCode} دیگر دوباره درخواست دهید`,
              showForm: false,
            });
          } else {
            let generatedCode = await userFunctions.otpCodeGenerator();
            let newOtp = new Otp({
              phone: req.body.phone,
              code: generatedCode,
            });
            let savedOtp = await newOtp.save();
            if (savedOtp) {
              // let uri = `https://raygansms.com/SendMessageWithCode.ashx?Username=${process.env.RAYGAN_SMS_USERNAME}&Password=${process.env.RAYGAN_SMS_PASSWORD}&Mobile=${req.body.phone}&Message=کد ورود به پیتاژ :${generatedCode}`
              // const encodedURI =await axios.get(encodeURI(uri)) ;
              res.json({
                showForm: false,
                success: true,
                msg: "کد 5 رقمی ارسال شده را وارد کنید",
              });
            }
          }
        }
      }
    } else {
      return res.json({
        success: false,
        msg: "شماره تلفن باید 11 رقم باشد",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.post("/post_forget_password", async (req, res) => {
  try {
    let existPhoneInOtp = await validForgetPassOtp.findOne({
      phone: req.body.phone,
    });
    if (existPhoneInOtp) {
      if (req.body.password.length < 5) {
        res.json({
          success: false,
          msg: "رمز ورود باید حداقل 6 کاراکتر باشد",
        });
      } else {
        if (req.body.password === req.body.confirm_password) {
          let findUser = await User.findOne({ phone: req.body.phone });
          bcrypt.genSalt(10, async (err, salt) => {
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
              if (err) throw err;
              findUser.password = hash;
              let savedUser = await findUser.save();
              if (savedUser) {
                res.json({
                  success: true,
                  msg: "تغیر رمزعبور با موفقت انجام شد",
                });
              } else {
                res.json({
                  success: false,
                  msg: "تغیر رمزعبور با موفقت انجام نشد",
                });
              }
            });
          });
        } else {
          res.json({
            success: false,
            msg: "رمز ها برابر نیستند",
          });
        }
      }
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }

});

router.post("/otp-forget-code", async (req, res) => {
  try {
    let existPhoneInOtp = await Otp.findOne({ phone: req.body.forgotPhone });
    console.log(existPhoneInOtp)
    if (existPhoneInOtp) {
      if (existPhoneInOtp.code === req.body.code) {
        let newValidOtp = new validForgetPassOtp({
          phone: req.body.forgotPhone,
        });
        await newValidOtp.save();
        res.json({
          success: true,
          msg: "لطفا رمز عبور جدید خود را وارد کنید",
        });
      } else {
        res.json({
          success: false,
          msg: "کدوارد شده صحیح نمیباشد",
        });
      }
    } else {
      let generatedCode = await userFunctions.otpCodeGenerator();
      let newOtp = new Otp({
        phone: req.body.forgotPhone,
        code: generatedCode,
      });
      let savedOtp = await newOtp.save();
      if (savedOtp) {
        // let uri = `https://raygansms.com/SendMessageWithCode.ashx?Username=${process.env.RAYGAN_SMS_USERNAME}&Password=${process.env.RAYGAN_SMS_PASSWORD}&Mobile=${req.body.registerPhone}&Message=کد ورود به پیتاژ :${generatedCode}`
        // const encodedURI =await axios.get(encodeURI(uri)) ;
        res.json({
          success: true,
          msg: "کد 5 رقمی ارسال شده را وارد کنید",
        });
      } else {
        res.json({
          success: false,
          msg: "مشکلی پیش آمده بعدا دوباره تلاش کنید",
        });
      }
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }

});

router.post("/forget-password", async (req, res) => {
  try {
    let phone = req.body.phone;
    if (phone.length === 11) {
      let userInfo = await User.findOne({ phone: phone });
      if (!userInfo) {
        return res.json({
          success: false,
          msg: "این شماره ثبت نام نشده است لطفا ثبت نام کنید",
          showPassForm: false,
        });
      }
      if (userInfo) {
        let findValidOtp = await validForgetPassOtp.findOne({
          phone: req.body.phone,
        });
        if (findValidOtp) {
          res.json({
            success: true,
            msg: "رمز عبور جدید را وارد کنید",
            showPassForm: true,
          });
        } else {
          let existInOtpCollection = await Otp.findOne({
            phone: req.body.phone,
          });
          if (existInOtpCollection) {
            let nexSendOtpCode = await userFunctions.nextSendCode(
              existInOtpCollection.createdAt
            );
            return res.json({
              success: true,
              msg: `کد برای شما ارسال شده است و شما میتوانید تا ${nexSendOtpCode} دیگر دوباره درخواست دهید`,
              showPassForm: false,
            });
          } else {
            let generatedCode = await userFunctions.otpCodeGenerator();
            let newOtp = new Otp({
              phone: req.body.phone,
              code: generatedCode,
            });
            let savedOtp = await newOtp.save();
            if (savedOtp) {
              // let uri = `https://raygansms.com/SendMessageWithCode.ashx?Username=${process.env.RAYGAN_SMS_USERNAME}&Password=${process.env.RAYGAN_SMS_PASSWORD}&Mobile=${req.body.phone}&Message=کد ورود شما به سامانه :${generatedCode}`
              // const encodedURI =await axios.get(encodeURI(uri)) ;
              res.json({
                success: true,
                msg: "کد 5 رقمی ارسال شده را وارد کنید",
                showPassForm: false,
              });
            }
          }
        }
      }
    } else {
      return res.json({
        success: false,
        msg: "شماره تلفن باید 11 رقم باشد",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.post("/register", async (req, res) => {
  try {
    let {
      phone,
      username,
      password,
      confirm_password,
      isMan,
      invitationCode,
    } = req.body;

    let referralCode = await userFunctions.referralCodeGenerator();
    let isInValidOtp = await validRegisterOtp.findOne({ phone: req.body.phone });
    if (isInValidOtp) {
      if (req.body.password.length <= 5) {
        res.json({
          success: false,
          otp: false,
          msg: "رمز ورود باید حداقل 6 کاراکتر باشد",
        });
      } else {
        if (password !== confirm_password) {
          res.json({
            success: false,
            otp: false,
            msg: "رمز عبور ها را به درستی وارد کنید",
          });
        } else {
          let userIsExist = await User.findOne({ phone: phone });
          if (userIsExist) {
            res.json({
              otp: false,
              success: false,
              msg: "با این شماره قبلا ثبت نام کرده اید",
            });
          } else {
            let findInValidOtpInfo = await validRegisterOtp.findOne({
              phone: req.body.phone,
            });
            if (findInValidOtpInfo) {
              let newUser = new User({
                phone,
                username,
                password,
                isMan,
                referralCode: referralCode,
                invitationCode,
              });
              bcrypt.genSalt(10, async (err, salt) => {
                bcrypt.hash(newUser.password, salt, async (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  let savedUser = await newUser.save();
                  if (savedUser) {
                    res.json({
                      otp: true,
                      success: true,
                      msg: "ثبت نام با موفقت انجام شد",
                    });
                  } else {
                    res.json({
                      otp: false,
                      success: false,
                      msg: "ثبت نام با موفقت انجام نشد",
                    });
                  }
                });
              });
            } else {
              res.json({
                success: false,
                msg: "به مراحل عقب بازگشته و شماره تلفن را دوباره واردکنید",
              });
            }
          }
        }
      }
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }


});

router.post("/otp-code", async (req, res) => {
  try {
    let existPhoneInOtp = await Otp.findOne({ phone: req.body.registerPhone });
    if (existPhoneInOtp) {
      if (existPhoneInOtp.code === req.body.code) {
        let newValidOtp = new validRegisterOtp({
          phone: req.body.registerPhone,
        });
        await newValidOtp.save();
        res.json({
          success: true,
          msg: "برای اتمام ثبت نام لطفا اطلاعات خود را وارد کنید",
        });
      } else {
        res.json({
          success: false,
          msg: "کدوارد شده صحیح نمیباشد",
        });
      }
    } else {
      let generatedCode = await userFunctions.otpCodeGenerator();
      let newOtp = new Otp({
        phone: req.body.registerPhone,
        code: generatedCode,
      });
      let savedOtp = await newOtp.save();
      if (savedOtp) {
        // let uri = `https://raygansms.com/SendMessageWithCode.ashx?Username=${process.env.RAYGAN_SMS_USERNAME}&Password=${process.env.RAYGAN_SMS_PASSWORD}&Mobile=${req.body.registerPhone}&Message=کد ورود  به پیتاژ :${generatedCode}`
        // const encodedURI =await axios.get(encodeURI(uri)) ;
        res.json({
          success: false,
          msg: "کد 5 رقمی ارسال شده را وارد کنید",
        });
      } else {
        res.json({
          success: false,
          msg: "مشکلی پیش آمده بعدا دوباره تلاش کنید",
        });
      }
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }

});

router.post("/login", (req, res) => {
  try {
    User.findOne({ phone: req.body.phone }).then((user) => {
      if (!user) {
        return res.json({
          msg: "با این شماره ثبت نام نکرده اید",
          success: false,
        });
      }
      bcrypt.compare(req.body.password, user.password).then((isMatch) => {
        if (isMatch) {
          const payload = {
            _id: user._id,
            phone: user.phone,
            username: user.username,
          };
          jwt.sign(payload, key, { expiresIn: 604800 }, (err, token) => {
            res.json({
              success: true,
              user: user,
              // logingDate: new Date().toISOString(),
              token: `Bearer ${token}`,
              msg: "با موفقیت وارد شدید",
              encryptedPass: user.password,
            });
          });
        } else {
          res.json({
            success: false,
            msg: "رمز عبور اشتباه است",
          });
        }
      });
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }

});

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    return res.json({
      user: req.user,
    });
  }
);

router.post("/get-profile-mobile", async (req, res) => {
  try {
    phone = req.body.phone;
    passwod = req.body.password;

    let user = await User.findOne({
      phone: req.body.phone,
    });


    if (user.password === req.body.password) {
      res.json({
        success: true,
        user: [user],
      });
    } else {
      res.json({
        success: false,
        msg: "",
        user: {},
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.put("/profile", async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          postalCode: req.body.postalCode,
          address: req.body.address,
        },
      },
      { upsert: true }
    );
    res.json({
      success: true,
      updateUser: user,
      msg: "اطلاعات با موفیت ثبت شد",
    });
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.post("/change-username", async (req, res) => {
  try {
    newUsername = req.body.username;


    if (newUsername.length > 2) {
      let user = await User.findOne({
        _id: req.body.userId,
      });
      if (user.password == req.body.password) {
        await User.updateOne({
          _id: req.body.userId,
        }, { username: newUsername });
        res.json({
          success: true,
          msg: "نام کاربری با موفقیت ثبت شد",
          newUsername: newUsername
        });
      } else {
        res.json({
          success: false,
          msg: "خطایی در احراز هویت ",
        });
      }
    } else {
      res.json({
        success: false,
        msg: "نام و نام خانوادگی باید بیشتر از 2 حرف باشد",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.post("/change-email", async (req, res) => {
  try {
    newEmail = req.body.email;
    if (newEmail.length > 10) {
      let user = await User.findOne({
        _id: req.body.userId,
      });
      if (user.password === req.body.password) {
        await User.updateOne({
          _id: req.body.userId,
        }, { email: newEmail });
        res.json({
          success: true,
          msg: "ایمیل  با موفقیت ثبت شد",
        });
      } else {
        res.json({
          success: false,
          msg: "",
        });
      }
    } else {
      res.json({
        success: false,
        msg: "ایمیل خود را به درستی وارد کنید",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.post("/change-city", async (req, res) => {
  try {

    newCity = req.body.city

    let user = await User.findOne({
      _id: req.body.userId,
    });
    if (user.password === req.body.password) {
      if (newCity.toString().length > 1) {
        await User.updateOne({
          _id: req.body.userId,
        }, { city: newCity });
      }
      res.json({
        success: true,
        msg: "آدرس  با موفقیت ثبت شد",
      });
    } else {
      res.json({
        success: false,
        msg: "",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.post("/offer", async (req, res) => {
  try {
    let { offerContent, emailOrPhone } = req.body;

    if (offerContent.length > 5 && emailOrPhone.length > 8) {
      let newOffer = Offer({
        emailOrPhone,
        offerContent,
      });
      let offer = await newOffer.save();
      res.json({
        success: true,
        offer: offer,
      });
    } else {
      res.json({
        success: false,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});

router.post("/intro", async (req, res) => {
  try {
    let { introContent, introType, emailOrPhone } = req.body;

    if (introContent.length > 5 && emailOrPhone.length > 10) {
      let newIntro = Intro({
        emailOrPhone,
        introContent,
        introType,
      });
      let intro = await newIntro.save();
      res.json({
        success: true,
        intro: intro,
      });
    } else {
      res.json({
        success: false,
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});



router.post("/change-address", async (req, res) => {
  try {
    newAddress = req.body.address;
    newPostalCode = req.body.postalCode;
    newCity = req.body.city,
      newReciverName = req.body.reciverName,
      newReciverPhone = req.body.reciverPhone

    let user = await User.findOne({
      _id: req.body.userId,
    });


    if (user.password === req.body.password) {
      let randomNumber = await userFunctions.generateRandomNumber();
      if (newPostalCode.length == 10 && newAddress.length < 101 && newCity.toString().length > 1 && newReciverName.length > 4 && newReciverPhone.length == 11) {
        newAddressInfo = {
          "_id": randomNumber.toString(),
          "city": newCity,
          "address": newAddress,
          "postalCode": newPostalCode,
          "reciverName": newReciverName,
          "reciverPhone": newReciverPhone,
        }

        user.address.push(newAddressInfo)
        await user.save();
        res.json({
          success: true,
          msg: "آدرس  با موفقیت ثبت شد",
        });
      }
      else {
        res.json({
          success: false,
          msg: "اطلاعات را به درستی وارد کنید",
        });
      }

    } else {
      res.json({
        success: false,
        msg: "",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});


router.post("/update-single-address", async (req, res) => {
  try {

    userId = req.body.userId;
    addressInfo = req.body.addressInfo

    let user = await User.findOne({
      _id: req.body.userId,
    });


    if (user.password === req.body.password) {
      if (addressInfo.postalCode.length == 10 && addressInfo.address.length < 101 && addressInfo.city.toString().length > 1 && addressInfo.reciverName.length > 4 && addressInfo.reciverPhone.length == 11) {
        for (let i = 0; i < user.address.length; i++) {
          if (addressInfo._id == user.address[i]._id) {
            user.address[i] = addressInfo;
          }
        }
        user.markModified('address');
        await user.save();
        res.json({
          success: true,
          msg: "آدرس  با موفقیت ثبت شد",
        });
      }
      else {
        res.json({
          success: false,
          msg: "اطلاعات را به درستی وارد کنید",
        });
      }

    } else {
      res.json({
        success: false,
        msg: "",
      });
    }
  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});


router.post("/delete-address", async (req, res) => {
  try {
    let user = await User.findOne({
      _id: req.body.userId,
    });
    if (user.password === req.body.password) {
      for (let i = 0; i < user.address.length; i++) {
        if (user.address[i]._id == req.body.addressId) {
          user.address.splice(i, 1);
        }

      }
      user.markModified('address');
      await user.save();
    }
    res.json({
      success: true,
      msg: "",
    });

  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});


router.post("/for-test", async (req, res) => {
  try {

    dataFunction.calculateCommission(1000000);


    res.json({
      success: true,
    });

    ////////////////////////////////////////////////////////////////////////
    // let getOrder = await Order.findOneAndUpdate({
    //   deleteOrderByUser: false,
    //   postManSending: false,
    //   petazhPost: false,
    //   recivedByUser: false

    // },

    //   { $inc: { sendPrice: - 1 } }


    // );
    // let getsecod = await Order.findOne({
    // });

    // console.log("out", getsecod.sendPrice)


    /////////////////////////////////////////////////////////
    // let getPassword = "$2a$10$rtyoNH5eMwowqP/Nv7SXBuCmHEnKR4k8JicEpcg/qj3eduslshhuS"
    // const userInfo = await User.findOneAndUpdate({ _id: "6278ce70f0eb4434701fd082", password: getPassword, wallet: { $gte: 10 } }, { phone: "09134931360" }, { useFindAndModify: false });
    // res.json({
    //   userInfo: userInfo,
    // });
    // let propertiesFilterArray = [];



    // let property = [{ "name": "کشور مبدا برند", "value": ["ایران"] },{ "name": "حجم(میلی لیتر)", "value": ["35"] }]
    // for (let i = 0; i < property.length; i++) {
    //   let defaultSchema = {
    //     properties: {

    //       $elemMatch: {
    //         name: { $in: [] },
    //         value: { $in: [] }
    //       },

    //     },
    //   }
    //   let name = [];
    //   let value = [];
    //   name = [property[i].name];
    //   value = property[i].value;
    //   defaultSchema.properties.$elemMatch.name.$in = name
    //   defaultSchema.properties.$elemMatch.value.$in = value
    //   propertiesFilterArray.push(defaultSchema);

    // }

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // let basic = [{ group: { $in: ["لوازم آرایشی"] } }, { category: { $in: ["آرایش صورت"] } }, { subCategory: { $in: ["کرم پودر"] } }, { "lowestPrice": { "$gt": 0 } },
    // { "lowestPrice": { "$lte": 100000000000 } }];
    // let final = basic.concat(propertiesFilterArray);
    // console.log(final)


    // products = await Product.find({
    //   $and: final
    // }).limit(2);
    // console.log(products)


  } catch (e) {
    res.json({
      success: false,
      msg: data.catchError,
    });
  }
});
module.exports = router;


