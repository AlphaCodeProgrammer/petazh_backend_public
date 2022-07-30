const lodash = require("lodash");



const getReadyBarbersForShow = (barbers) => {
    let readyBarbers = [];
    for (let i = 0; i < barbers.length; i++) {
        barbers[i].stylists = [];
        barbers[i].barberPhone = "";
        barbers[i].licenseNumber = "";
        barbers[i].masterPhone = "";
        readyBarbers.push(barbers[i]);
    }

    return readyBarbers;
};



const barberFilterSearchBox = (barberArray, searchBox) => {
    let filteredBarbers = [];
    for (let i = 0; i < barberArray.length; i++) {
      let barberNameSearch = barberArray[i].barberName;
      let barberAreaSearch = barberArray[i].barberArea;
      let barberAddressSearch = barberArray[i].barberAddress;
      let isThere =
        barberNameSearch.includes(searchBox) ||
        barberAreaSearch.includes(searchBox) ||
        barberAddressSearch.includes(searchBox);
      if (isThere) {
        if (filteredBarbers.length == 0) {
          (barberArray[i].masterPhone = ""),
            (barberArray[i].licenseNumber = ""),
            (barberArray[i].barberPhone = ""),
            (barberArray[i].stylists = []),
            filteredBarbers.push(barberArray[i]);
        } else {
          for (let j = 0; j < filteredBarbers.length; j++) {
            if (barberArray[i].id != filteredBarbers[j].id) {
              (barberArray[i].masterPhone = ""),
                (barberArray[i].licenseNumber = ""),
                (barberArray[i].barberPhone = ""),
                (barberArray[i].stylists = []),
                filteredBarbers.push(barberArray[i]);
            }
          }
        }
      }
    }
    return filteredBarbers;
  };
  



module.exports = {

    getReadyBarbersForShow: getReadyBarbersForShow,
    barberFilterSearchBox:barberFilterSearchBox

};
