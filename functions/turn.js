





const lodash = require("lodash");



const checkServices = (servicesFromFrontend, servicesFromBackend) => {
  let info = {};
  let isValid = true;
  let finalServices = [];
  // console.log(servicesFromFrontend)

  for (let i = 0; i < servicesFromFrontend.length; i++) {

    var indexOfService = servicesFromBackend.findIndex(service => { return service.id == servicesFromFrontend[i].id && service.ready == true });
    if (indexOfService >= 0) {
      servicesFromBackend[indexOfService].quantity = servicesFromFrontend[i].quantity;
      finalServices.push(servicesFromBackend[indexOfService]);
    } else {
      isValid = false;
    }

    info.isValid = isValid;
    info.finalServices = finalServices;


  }

  return info;
};



const calculateTotalPrice = (finalServices) => {
  let arrayPrices = [];
  for (let i = 0; i < finalServices.length; i++) {
    let percentOfOff = finalServices[i].off;

    if (finalServices[i].floating.has == false) {
      let PriceWithoutOff = finalServices[i].price;
      let priceWithOff = parseInt(
        PriceWithoutOff * ((100 - percentOfOff) / 100)
      );
      let priceByQuantity = priceWithOff * finalServices[i].quantity;
      arrayPrices.push(priceByQuantity);
      // console.log(arrayPrices);
    } else {
      let PriceWithoutOff = finalServices[i].floating.min;
      let priceWithOff = parseInt(
        PriceWithoutOff * ((100 - percentOfOff) / 100)
      );
      // console.log(finalServices[i].quantity)
      // console.log(priceWithOff)

      let priceByQuantity = priceWithOff * finalServices[i].quantity;
      arrayPrices.push(priceByQuantity);

    }

  }
  let totalPriceByOffs = lodash.sum(arrayPrices);

  return totalPriceByOffs;
};


module.exports = {
  checkServices: checkServices,
  calculateTotalPrice: calculateTotalPrice


};
