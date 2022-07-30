
const turnCommissionBasic = 2;
const turnCommissionFloatLevelOne = 1;
const turnCommissionFloatLevelTwo = 0.5;
const limitBasicCommissionLevelTwo = 500000;
const limitBasicCommissionLevelOne = 100000;


// between 0 and 100k commission 2% and more than 100 k until 500k commission 1% and more than 500k 0.5%






const calculateCommission = (totalPriceOfTurn) => {
    let info = {};
    let stylistPayment = 0;
    let commissionPriceOfPetazh = 0;
    if (totalPriceOfTurn <= limitBasicCommissionLevelOne) {
        stylistPayment = Math.floor(totalPriceOfTurn * ((100 - turnCommissionBasic) / 100));
        commissionPriceOfPetazh = totalPriceOfTurn - stylistPayment;
    } else if (totalPriceOfTurn > limitBasicCommissionLevelOne && totalPriceOfTurn <= limitBasicCommissionLevelTwo) {
        let basicPetazhCommission = Math.ceil(limitBasicCommissionLevelOne * (turnCommissionBasic / 100));
        let moreThanLimitPrice = totalPriceOfTurn - limitBasicCommissionLevelOne;
        let floatPetazhCommission = Math.ceil(moreThanLimitPrice * (turnCommissionFloatLevelOne / 100));
        commissionPriceOfPetazh = floatPetazhCommission + basicPetazhCommission;
        stylistPayment = totalPriceOfTurn - (floatPetazhCommission + basicPetazhCommission);

    } else {
        let basicPetazhCommission = Math.ceil(limitBasicCommissionLevelOne * (turnCommissionBasic / 100));
        let moreThanLimitPrice = limitBasicCommissionLevelTwo - limitBasicCommissionLevelOne;
        let floatPetazhCommission = Math.ceil(moreThanLimitPrice * (turnCommissionFloatLevelOne / 100));
        let moreThanLimitPriceLevelTwo = totalPriceOfTurn - (limitBasicCommissionLevelTwo);
        let floatPetazhCommissionLevelTwo = Math.ceil(moreThanLimitPriceLevelTwo * (turnCommissionFloatLevelTwo / 100));
        commissionPriceOfPetazh = floatPetazhCommission + basicPetazhCommission + floatPetazhCommissionLevelTwo;
        stylistPayment = totalPriceOfTurn - (floatPetazhCommission + basicPetazhCommission + floatPetazhCommissionLevelTwo);
    }
    info.stylistPayment = stylistPayment;
    info.commissionPriceOfPetazh = commissionPriceOfPetazh;
    return info;
};



module.exports = {
    turnCommissionBasic: turnCommissionBasic,
    turnCommissionFloatLevelTwo: turnCommissionFloatLevelTwo,
    turnCommissionFloatLevelOne: turnCommissionFloatLevelOne,
    limitBasicCommissionLevelTwo: limitBasicCommissionLevelTwo,
    limitBasicCommissionLevelOne: limitBasicCommissionLevelOne,
    calculateCommission: calculateCommission
};
