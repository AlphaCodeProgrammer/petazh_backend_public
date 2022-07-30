const lodash = require("lodash");

const referralCodeGenerator = () => {
  const alphabet = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "H",
  ];
  const word = alphabet[Math.floor(Math.random() * 26)];
  const referralNumbers = Math.floor(Math.random() * 90000) + 10000;
  const finalReferralCode = word + referralNumbers.toString();
  return finalReferralCode;
};


const generateRandomNumber = () => {

  const referralNumbers = Math.floor(Math.random() * 90000) + 10000;
  return referralNumbers;
};


const nextSendCode = (getDateTimeOtp) => {
  let nowDate = Date.now();
  let millisecondCreatedAt = new Date(getDateTimeOtp).getTime();
  let differenceSec = (nowDate - millisecondCreatedAt - 5000) / 1000;
  let floatDifference = differenceSec / 60;
  let intMin = parseInt(differenceSec / 60);
  let intSec = parseInt((floatDifference - intMin) * 60);
  let min = 3 - intMin;
  let sec = 60 - intSec;
  return min + ":" + sec;
};

const otpCodeGenerator = async () => {
  let generatedCode = (await Math.floor(Math.random() * 90000)) + 10000;
  return generatedCode;
};




const getReadyFilterProducts = () => {
  let readyProducts = [];


  return readyProducts;
};





module.exports = {
  referralCodeGenerator: referralCodeGenerator,
  otpCodeGenerator: otpCodeGenerator,
  nextSendCode: nextSendCode,
  generateRandomNumber: generateRandomNumber,
  getReadyFilterProducts: getReadyFilterProducts,
};
