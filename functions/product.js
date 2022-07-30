
const lodash = require("lodash");

let cosmeticAndCareCommissionCommission = 5;
let electricalCommission = 7;
const gerProductsIdArray = (productsList) => {
  let productsIdArray = [];
  for (let i = 0; i < productsList.length; i++) {
    productsIdArray.push(productsList[i].productId)
  }
  return productsIdArray;
};



const checkCheckoutOrderValidation = (checkoutsOrder, userRejectionOrders) => {
  info = {
    isValid: true,
    minusSellersPayment: [
      // {
      //     sellerId: "",
      //     minusPayment: 0,
      //     rejectedProducts: []
      // }
    ]
  }




  for (let i = 0; i < userRejectionOrders.length; i++) {

    let sellerIndex = checkoutsOrder.findIndex((checkout) => checkout.sellerId == userRejectionOrders[i].sellerId);
    if (sellerIndex < 0) {
      info.isValid = false;
    }
    let productIndex = checkoutsOrder[sellerIndex].productsList.findIndex((productInfo) => productInfo.productId == userRejectionOrders[i].productId && productInfo.color == userRejectionOrders[i].color && productInfo.quantity >= userRejectionOrders[i].quantity);
    if (productIndex < 0) {
      info.isValid = false;

    }
    checkoutsOrder[sellerIndex].productsList[productIndex].quantity = userRejectionOrders[i].quantity;

    let speceficProduct = checkoutsOrder[sellerIndex].productsList[productIndex];
    let valueInfo = checkoutsOrder[sellerIndex].productsList[productIndex].value;
    let payment = 0;
    let existSellerInArray = info.minusSellersPayment.findIndex((info) => info.sellerId == checkoutsOrder[sellerIndex].productsList[productIndex].sellerId);
    if (existSellerInArray >= 0) {
      if (speceficProduct.group == "لوازم آرایشی" || speceficProduct.group == "لوازم بهداشتی") {
        payment = Math.floor(((valueInfo.price * ((100 - (valueInfo.off)) / 100)) * speceficProduct.quantity) * ((100 - cosmeticAndCareCommissionCommission) / 100));
      } else {
        payment = Math.floor(((valueInfo.price * ((100 - (valueInfo.off)) / 100)) * speceficProduct.quantity) * ((100 - electricalCommission) / 100));
      }
      info.minusSellersPayment[existSellerInArray].minusPayment += payment;
      info.minusSellersPayment[existSellerInArray].rejectedProducts.push(speceficProduct);
    } else {
      if (speceficProduct.group == "لوازم آرایشی" || speceficProduct.group == "لوازم بهداشتی") {
        payment = Math.floor(((valueInfo.price * ((100 - (valueInfo.off)) / 100)) * speceficProduct.quantity) * ((100 - cosmeticAndCareCommissionCommission) / 100));
      } else {
        payment = Math.floor(((valueInfo.price * ((100 - (valueInfo.off)) / 100)) * speceficProduct.quantity) * ((100 - electricalCommission) / 100));
      }
      info.minusSellersPayment.push(
        {
          sellerId: checkoutsOrder[sellerIndex].productsList[productIndex].sellerId,
          minusPayment: payment,
          rejectedProducts: [speceficProduct]
        })
    }







  }


  return info;
};



async function getSellersIdInArray(avilableSeller) {
  let sellersArray = [];
  if (avilableSeller.length > 0) {
    for (let i = 0; i < avilableSeller.length; i++) {
      for (let j = 0; j < avilableSeller[i].sellersInfo.length; j++) {
        sellersArray.push(avilableSeller[i].sellersInfo[j].sellerId);
      }
    }
  } else {
    sellersArray = [];
  }


  return sellersArray;
}


const checkOrderValid = (orginalProducts, userProducts) => {
  let result = { "isValid": true, "message": "خرید با موفقیت انجام شد", totalPriceByOffCalculated: 0, updateUserProducts: [], sellersIdArray: [], sendPrice: 0, totalWeight: 0 };

  for (let i = 0; i < userProducts.length; i++) {
    let findOrginalProduct = orginalProducts.find(function (product) {
      return product._id == userProducts[i].productId
    });
    if (findOrginalProduct != undefined) {


      ///check is off price and quantity is correct      
      let existThisColor = findOrginalProduct.sellers.find(function (sellersInfo) {
        return sellersInfo.color == userProducts[i].color && sellersInfo.colorName == userProducts[i].colorName

      });
      if (existThisColor != undefined) {
        let existQuantity = existThisColor.sellersInfo.find(function (sellersMoreInfo) {
          return sellersMoreInfo.balance >= userProducts[i].quantity && sellersMoreInfo.sellerId == userProducts[i].sellerId
        });


        if (existQuantity != undefined) {
          if (!result.sellersIdArray.includes(existQuantity.sellerId)) {
            result.sellersIdArray.push(existQuantity.sellerId);
          }
          if (existQuantity.balance > 0) {
            result.totalWeight += findOrginalProduct.weight;

            let currentPrice = existQuantity.price;
            let currentOff = existQuantity.off;
            let currentQuantity = userProducts[i].quantity;
            let getPercentage = (100 - currentOff) / 100;
            result.totalPriceByOffCalculated += Math.ceil((currentPrice * getPercentage) * currentQuantity);
            userProducts[i].payment = Math.ceil((currentPrice * getPercentage) * currentQuantity);
            result.updateUserProducts.push(userProducts[i]);
          } else {

            result.isValid = false;
            result.message = "اتمام محصول"
          }

        } else {
          result.isValid = false;
          result.message = "موجودیت تعداد کالاهای خود را برسی کنید"
        }
      } else {
        result.isValid = false;
        result.message = "موجودیت کالاهای خود را برسی کنید"
      }
    } else {
      result.isValid = false;
      result.message = "محصول انتخابی شما وجود ندارد"
    }
  }
  if (result.totalPriceByOffCalculated > 500000) {
    result.sendPrice = 0;
  } else {
    if (result.totalWeight > 0 &&
      result.totalWeight <= 500) {
      result.sendPrice = 23900;
    } else if (result.totalWeight > 500 &&
      result.totalWeight <= 1500) {
      result.sendPrice = 32700;
    } else if (result.totalWeight > 1500 &&
      result.totalWeight <= 2000) {
      result.sendPrice = 35000;
    } else if (result.totalWeight > 2000 &&
      result.totalWeight <= 3000) {
      result.sendPrice = 36500;
    } else if (result.totalWeight > 3000 &&
      result.totalWeight <= 4000) {
      result.sendPrice = 38000;
    } else if (result.totalWeight > 4000 &&
      result.totalWeight <= 5000) {
      result.sendPrice = 39000;
    } else if (result.totalWeight > 5000 &&
      result.totalWeight <= 6000) {
      result.sendPrice = 40000;
    } else if (result.totalWeight > 6000 &&
      result.totalWeight <= 7000) {
      result.sendPrice = 41000;
    } else if (result.totalWeight > 7000 &&
      result.totalWeight <= 8000) {
      result.sendPrice = 42000;
    } else if (result.totalWeight > 8000 &&
      result.totalWeight <= 9000) {
      result.sendPrice = 43000;
    } else if (result.totalWeight > 9000 &&
      result.totalWeight <= 10000) {
      result.sendPrice = 44000;
    } else if (result.totalWeight > 10000 &&
      result.totalWeight <= 6000) {
      result.sendPrice = 11000;
    } else if (result.totalWeight > 11000 &&
      result.totalWeight <= 6000) {
      result.sendPrice = 46500;
    } else if (result.totalWeight > 12000 &&
      result.totalWeight <= 12000) {
      result.sendPrice = 47000;
    } else if (result.totalWeight > 13000 &&
      result.totalWeight <= 13000) {
      result.sendPrice = 48500;
    } else if (result.totalWeight > 14000 &&
      result.totalWeight <= 14000) {
      result.sendPrice = 450000;
    } else if (result.totalWeight > 15000 &&
      result.totalWeight <= 15000) {
      result.sendPrice = 52000;
    } else if (result.totalWeight > 16000 &&
      result.totalWeight <= 16000) {
      result.sendPrice = 57000;
    } else if (result.totalWeight > 17000 &&
      result.totalWeight <= 18000) {
      result.sendPrice = 59000;
    } else if (result.totalWeight > 18000 &&
      result.totalWeight <= 19000) {
      result.sendPrice = 62000;
    } else if (result.totalWeight > 19000 &&
      result.totalWeight <= 20000) {
      result.sendPrice = 63000;
    } else if (result.totalWeight > 20000 &&
      result.totalWeight <= 21000) {
      result.sendPrice = 65000;
    } else if (result.totalWeight > 21000 &&
      result.totalWeight <= 22000) {
      result.sendPrice = 67000;
    } else if (result.totalWeight > 22000 &&
      result.totalWeight <= 23000) {
      result.sendPrice = 69000;
    } else if (result.totalWeight > 23000 &&
      result.totalWeight <= 25000) {
      result.sendPrice = 72500;
    } else if (result.totalWeight > 25000 &&
      result.totalWeight <= 26000) {
      result.sendPrice = 75000;
    } else if (result.totalWeight > 26000 &&
      result.totalWeight <= 27000) {
      result.sendPrice = 80000;
    } else if (result.totalWeight > 27000 &&
      result.totalWeight <= 28000) {
      result.sendPrice = 85000;
    } else if (result.totalWeight > 28000 &&
      result.totalWeight <= 29000) {
      result.sendPrice = 89000;
    } else if (result.totalWeight > 29000 &&
      result.totalWeight <= 6000) {
      result.sendPrice = 95000;
    }


    result.totalPriceByOffCalculated += result.sendPrice;

  }


  return result;
};


const orderIdGenerator = () => {
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
  const firstWord = alphabet[Math.floor(Math.random() * 26)];
  const secondWord = alphabet[Math.floor(Math.random() * 26)];
  const number = Math.floor(Math.random() * 9000000) + 10000;
  const orderId = firstWord + number.toString() + secondWord;
  return orderId;
};


const changeRatingProduct = (productsInfo, ratingDate) => {
  for (let i = 0; i < productsInfo.length; i++) {
    let newRateIndex = ratingDate.findIndex((product) =>
      product.productId == productsInfo[i]["_id"]
    );

    if (newRateIndex >= 0) {
      let ratingQuantity = productsInfo[i].rating.quantity;
      let beforeCalculate = productsInfo[i].rating.rate * ratingQuantity;
      productsInfo[i].rating.quantity = productsInfo[i].rating.quantity + 1;
      productsInfo[i].rating.rate = (productsInfo[i].rating.rate + ratingDate[newRateIndex].rating) / productsInfo[i].rating.quantity;



    }
  }
  return productsInfo;

};





module.exports = {
  gerProductsIdArray: gerProductsIdArray,
  checkCheckoutOrderValidation: checkCheckoutOrderValidation,
  getSellersIdInArray: getSellersIdInArray,
  checkOrderValid: checkOrderValid,
  orderIdGenerator: orderIdGenerator,
  changeRatingProduct: changeRatingProduct


};
