const Product = require("../models/product");
const Seller = require("../models/seller");
const User = require("../models/user");
const Basic = require("../models/basic");
const Order = require("../models/order");
const cancelOrder = require("../models/cancelOrder");
const productFunctions = require("../functions/product");
const checkoutOrder = require("../models/checkoutOrder");
const checkoutRejectOrder = require("../models/checkoutRejectOrder");
const rejectedOrder = require("../models/rejectedOrder");
const data = require("../data")
const brand = data.brands;
const productStructure = data.productStructures;

const getBasics = async (req, res) => {
    try {
        // let editedProperty = await  properties


        let basic = await Basic.findOne({ specialId: "petazh" });
        let addInfo = basic.basicInfo.addProductsInfo;
        let filterProductsInfo = basic.basicInfo.filterProducts;
        let brands = basic.basicInfo.brands;
        res.json({
            success: true,
            brands: brands,
            filterProductsInfo: filterProductsInfo,
            addInfo: addInfo,
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};

const addSeen = async (req, res) => {
    try {
        let productId = req.body.productId;
        let ProductInfo = await Product.findOne({ _id: productId });
        ProductInfo.seen += 1;
        await ProductInfo.save();
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};

const getFilteredProducts = async (req, res) => {

    try {
        let getGroup = req.body.group;
        let onlyExistProducts = req.body.onlyExistProducts;
        let getBrandsArray = req.body.selectedBrands;
        let getCategoriesArray = req.body.selectedCategories;
        let getSubCategories = req.body.selectedSubCategories;
        let getProperties = req.body.selectedProperties;
        let calculateSortValue = req.body.sortValue;

        let lowestPrice = req.body.lowestPrice;
        let maxPrice = req.body.maxPrice;

        let onlyExistProductsArray = ["true"];
        if (onlyExistProducts == false) {
            onlyExistProductsArray.push("false", "true")
        }
        if (getGroup.length == 0) {
            for (var i = 0; i < productStructure.length; i++) {
                getGroup.push(productStructure[i].group);
            }
        }
        if (getCategoriesArray.length == 0) {
            for (var i = 0; i < productStructure.length; i++) {
                for (var j = 0; j < productStructure[i].category.length; j++) {
                    getCategoriesArray.push(productStructure[i].category[j]);

                }
            }
        }

        if (getBrandsArray.length == 0) {
            for (var i = 0; i < brand.length; i++) {
                if (getGroup[0] == brand[i].group) {
                    getBrandsArray = brand[i].brandsArray

                }

            }
        }

        if (getSubCategories.length == 0) {
            for (var i = 0; i < productStructure.length; i++) {

                for (var j = 0; j < productStructure[i].subCategory.length; j++) {
                    getSubCategories.push(productStructure[i].subCategory[j]);

                }

            }
        }


        let startProductIndex = req.body.page
        let allPages = 0;

        if (getProperties.length == 0) {
            let basicFiltetInfo = [{ group: { $in: getGroup } }, { category: { $in: getCategoriesArray } }, { subCategory: { $in: getSubCategories } }, { brand: { $in: getBrandsArray } }, { "lowestPrice": { "$gt": lowestPrice } },
            { "lowestPrice": { "$lte": maxPrice } }, { exist: { $in: onlyExistProductsArray } }];

            let products = [];


            /// with properties filter
            if (calculateSortValue == 1) {
                productsCount = await Product.countDocuments({
                    $and: basicFiltetInfo
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });
                products = await Product.find({
                    $and: basicFiltetInfo

                }).skip(startProductIndex * 20 - 20).sort({ seen: -1 }).limit(20);
            } else if (calculateSortValue == 2) {
                let exist = [{ exist: true }]
                let checkExist = exist.concat(basicFiltetInfo);
                productsCount = await Product.countDocuments({
                    $and: checkExist
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });


                products = await Product.find({
                    $and: checkExist

                }).skip(startProductIndex * 20 - 20).sort({ lowestPrice: -1 }).limit(20);
            } else if (calculateSortValue == 3) {
                let exist = [{ exist: true }]
                let checkExist = exist.concat(basicFiltetInfo);
                productsCount = await Product.countDocuments({
                    $and: checkExist
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });



                products = await Product.find({
                    $and: checkExist

                }).skip(startProductIndex * 20 - 20).sort({ lowestPrice: 1 }).limit(20);
            } else {
                productsCount = await Product.countDocuments({
                    $and: basicFiltetInfo
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });
                products = await Product.find({
                    $and: basicFiltetInfo

                }).skip(startProductIndex * 20 - 20).sort({ soldCount: -1 }).limit(20);
            }


            res.json({
                success: true,
                products: products,
                allPages: allPages,

                msg: "انجام شد",
            });
        } else {
            let propertiesFilterArray = [];
            let basicFilter = [{ group: { $in: getGroup } }, { category: { $in: getCategoriesArray } }, { subCategory: { $in: getSubCategories } }, { brand: { $in: getBrandsArray } }, { "lowestPrice": { "$gt": lowestPrice } },
            { "lowestPrice": { "$lte": maxPrice } }, { exist: { $in: onlyExistProductsArray } }]

            for (let i = 0; i < getProperties.length; i++) {
                let defaultSchema = {
                    properties: {

                        $elemMatch: {
                            name: { $in: ["کشور مبدا برند"] },
                            value: { $in: ["ایران"] }
                        },

                    },
                }
                let name = [];
                let value = [];
                name = [getProperties[i].name];
                value = getProperties[i].value;
                defaultSchema.properties.$elemMatch.name.$in = name
                defaultSchema.properties.$elemMatch.value.$in = value
                propertiesFilterArray.push(defaultSchema);

            }

            let concatedTwoArrays = propertiesFilterArray.concat(basicFilter);


            let products = [];



            if (calculateSortValue == 1) {
                productsCount = await Product.countDocuments({
                    $and: concatedTwoArrays,
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });
                products = await Product.find({
                    $and: concatedTwoArrays

                }).skip(startProductIndex * 20 - 20).sort({ seen: -1 }).limit(20);
            } else if (calculateSortValue == 2) {
                let exist = [{ exist: true }]
                let checkExist = exist.concat(concatedTwoArrays);
                productsCount = await Product.countDocuments({
                    $and: checkExist,
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });


                products = await Product.find({
                    $and: checkExist

                }).skip(startProductIndex * 20 - 20).sort({ lowestPrice: -1 }).limit(20);
            } else if (calculateSortValue == 3) {
                let exist = [{ exist: true }]
                let checkExist = exist.concat(concatedTwoArrays);
                productsCount = await Product.countDocuments({
                    $and: checkExist,
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });


                products = await Product.find({
                    $and: checkExist

                }).skip(startProductIndex * 20 - 20).sort({ lowestPrice: 1 }).limit(20);
            } else {
                productsCount = await Product.countDocuments({
                    $and: concatedTwoArrays,
                }, function (err, count) {
                    allPages = Math.ceil(count / 20);
                });
                products = await Product.find({
                    $and: concatedTwoArrays

                }).skip(startProductIndex * 20 - 20).sort({ soldCount: -1 }).limit(20);
            }




            res.json({
                success: true,
                products: products,
                allPages: allPages,
                propertiesFilterArray: propertiesFilterArray,

                msg: "انجام شد",
            });
        }

    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }

    //user send


};

const getHomeProducts = async (req, res) => {
    try {
        let cosmetic = await Product.find({ group: "لوازم آرایشی", exist: true });
        let care = await Product.find({ group: "لوازم بهداشتی", exist: true });
        let machine = await Product.find({ group: "لوازم شخصی برقی", exist: true });
        let cosmeticSend = [];
        let careSend = [];
        let machineSend = [];

        for (var i = 0; i < cosmetic.length; i++) {
            if (cosmetic[i].sellers.length > 0) {
                cosmeticSend.push(cosmetic[i]);
                if (cosmeticSend.length > 9) {
                    break;
                }
            }
        }
        for (var i = 0; i < care.length; i++) {
            if (care[i].sellers.length > 0) {
                careSend.push(care[i]);
                if (careSend.length > 9) {
                    break;
                }
            }
        }
        for (var i = 0; i < machine.length; i++) {
            if (machine[i].sellers.length > 0) {
                machineSend.push(machine[i]);
                if (machineSend.length > 9) {
                    break;
                }
            }
        }




        res.json({
            success: true,
            cosmetic: cosmeticSend,
            care: careSend,
            machine: machineSend,
            msg: "انجام شد",
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }


};

const addToCartFromGrid = async (req, res) => {
    try {
        let userId = req.body.userId;
        let productId = req.body.productId;
        let sellerId = req.body.sellerId;
        let colorValue = req.body.colorValue;
        ///start to find product
        let user = await User.findOne({ _id: userId });
        let indexOfProduct = user.cart.findIndex((product) => { return product.productId == productId && product.sellerId == sellerId && product.color == colorValue });
        if (indexOfProduct >= 0) {
            user.cart[indexOfProduct].quantity += 1;
            user.markModified('cart');
            await user.save();
            res.json({
                success: true,
                userCart: user.cart
            });
        } else {
            user.cart.push({
                "productId": productId, "sellerId": sellerId, "color": colorValue, "quantity": 1,
            })
            user.markModified('cart');
            await user.save();
            res.json({
                success: true,
                userCart: user.cart

            });
        }
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }





};

const addToCart = async (req, res) => {
    try {
        let userId = req.body.userId;
        let productId = req.body.productId;
        let sellerId = req.body.sellerId;
        let colorValue = req.body.colorValue;
        ///start to find product
        let user = await User.findOne({ _id: userId });
        let indexOfProduct = user.cart.findIndex((product) => { return product.productId == productId && product.sellerId == sellerId && product.color == colorValue });
        if (indexOfProduct >= 0) {
            user.cart[indexOfProduct].quantity += 1;
            user.markModified('cart');
            await user.save();
            res.json({
                success: true,
                userCart: user.cart


            });
        } else {
            user.cart.push({
                "productId": productId, "sellerId": sellerId, "color": colorValue, "quantity": 1,
            })
            user.markModified('cart');
            await user.save();
            res.json({
                success: true,
                userCart: user.cart


            });
        }
    } catch (err) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }





};

const removeFromCardInGrid = async (req, res) => {

    try {
        let userId = req.body.userId;
        let productId = req.body.productId;

        ///start to find product

        let user = await User.findOne({ _id: userId });
        let minusOne = false;

        for (let i = 0; i < user.cart.length; i++) {
            if (minusOne == false) {
                if (user.cart[i].productId == productId && user.cart[i].quantity > 1) {
                    user.cart[i].quantity = user.cart[i].quantity - 1;
                    minusOne = true;
                } else {
                    user.cart.splice(i, 1);
                    minusOne = true;
                }
            }


        }
        user.markModified('cart');
        await user.save();
        res.json({
            success: true,
            msg: "انجام شد",
            userCart: user.cart,
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }


};

const removeFromCardInGridInBasket = async (req, res) => {

    try {
        let userId = req.body.userId;
        let productId = req.body.productId;
        let sellerId = req.body.sellerId;
        let color = req.body.color

        ///start to find product

        let user = await User.findOne({ _id: userId });
        for (let i = 0; i < user.cart.length; i++) {
            if (productId == user.cart[i].productId && sellerId == user.cart[i].sellerId && color == user.cart[i].color) {
                if (user.cart[i].productId == productId && user.cart[i].quantity > 1) {
                    user.cart[i].quantity = user.cart[i].quantity - 1;
                } else {
                    user.cart.splice(i, 1);
                }

            }
        }


        user.markModified('cart');
        await user.save();
        res.json({
            success: false,
            msg: data.catchError,
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }


};



const removeFromCard = async (req, res) => {
    try {
        let userId = req.body.userId;
        let productId = req.body.productId;
        let sellerId = req.body.sellerId;
        let colorValue = req.body.colorValue;
        ///start to find product

        let user = await User.findOne({ _id: userId });
        for (let i = 0; i < user.cart.length; i++) {
            if (user.cart[i].productId === productId && user.cart[i].sellerId === sellerId && user.cart[i].quantity >= 0 && user.cart[i].color == colorValue) {
                if (user.cart[i].quantity <= 1) {
                    user.cart.splice(i, 1);
                } else {
                    user.cart[i].quantity -= 1;
                }
                user.markModified('cart');
                await user.save();
            }

        }
        res.json({
            success: true,
            msg: "انجام شد",
            userCart: user.cart,
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }


};

const addProductToFavorite = async (req, res) => {
    try {
        let userId = req.body.userId;
        let productId = req.body.productId;

        let user = await User.findOne({ _id: userId });
        if (user.favoriteProducts.includes(productId)) {
            res.json({
                success: true,
                msg: "انجام شد",
                userFavoriteProducts: user.favoriteProducts,
            });
        } else {
            user.favoriteProducts.push(productId);
            await user.save();

            res.json({
                success: true,
                msg: "انجام شد",
                userFavoriteProducts: user.favoriteProducts,
            });
        }
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }




};

const removeForomFavoriteProducts = async (req, res) => {

    try {
        let userId = req.body.userId;
        let productId = req.body.productId;

        let user = await User.findOne({ _id: userId });
        for (let i = 0; i < user.favoriteProducts.length; i++) {
            if (user.favoriteProducts[i] == productId) {

                user.favoriteProducts.splice(i, 1);
                await user.save();
            }
        }

        res.json({
            success: true,
            msg: "انجام شد",
            userFavoriteProducts: user.favoriteProducts,
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }



};

const getProductDetails = async (req, res) => {
    try {
        let product = await Product.findOne({ _id: req.body.productId });
        let sellersId = await productFunctions.getSellersIdInArray(product.sellers);
        let sellersInformation = await Seller.find({
            _id: { $in: sellersId },
            ban: false
        });

        let sellerFrontInfo = await sellersInformation.map((seller) => {

            return {
                "sellerId": seller._id,
                "shopName": seller.shopName,
                "rating": seller.rating,
            }

        });
        if (product) {
            res.json({
                success: true,
                product: product,
                sellersInfo: sellerFrontInfo,
                msg: "انجام شد",
            });

        } else {
            res.json({
                success: false,
                msg: "انجام نشد",
            })
        };
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }

}

const checkCartBalance = async (req, res) => {

    try {
        userId = req.body.userId;

        let user = await User.findOne({ _id: userId });

        let productsArray = [];
        for (let i = 0; i < user.cart.length; i++) {
            productsArray.push(user.cart[i].productId)
        }
        let products = await Product.find({
            _id: { $in: productsArray },
        });
        if (productsArray.length > 0) {
            for (let m = 0; m < user.cart.length; m++) {
                let productIndex = products.findIndex((info) => {
                    return info._id == user.cart[m].productId;

                });
                if (productIndex >= 0) {

                    let existThisColorIndex = products[productIndex].sellers.findIndex((info) => {
                        return info.color == user.cart[m].color

                    });
                    if (existThisColorIndex >= 0) {
                        let sellerIndex = products[productIndex].sellers[existThisColorIndex].sellersInfo.findIndex((info) => {
                            return info.sellerId >= user.cart[m].sellerId;

                        });
                        if (sellerIndex >= 0) {
                            if (products[productIndex].sellers[existThisColorIndex].sellersInfo[sellerIndex].balance < user.cart[m].quantity) {
                                user.cart[m].quantity = products[productIndex].sellers[existThisColorIndex].sellersInfo[sellerIndex].balance;

                            }

                        } else {
                            user.cart.splice(m, 1);
                        }
                    } else {
                        user.cart.splice(m, 1);
                    }
                } else {
                    user.cart.splice(m, 1);
                }

            }

        }
        res.json({
            success: true,
            msg: "انجام شد",
        })
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }

}

const getReadyOrderBasket = async (req, res) => {
    try {
        let userId = req.body.userId;
        let productsId = [];
        let sellersId = [];
        let readyCart = [];
        let user = await User.findOne({ _id: userId });
        if (user.cart.length == 0) {
            res.json({
                success: true,
                readyCart: readyCart,
                userCart: user.cart,
                msg: "انجام شد",
            });
        } else {
            for (let i = 0; i < user.cart.length; i++) {
                productsId.push(user.cart[i].productId);
            }



            let products = await Product.find({ _id: { $in: productsId } });

            ///GET ALL INFO ABOUT SELLERS
            for (let i = 0; i < products.length; i++) {
                for (let j = 0; j < products[i].sellers.length; j++) {
                    for (let k = 0; k < products[i].sellers[j].sellersInfo.length; k++) {
                        if (!sellersId.includes(products[i].sellers[j].sellersInfo[k].sellerId))
                            sellersId.push(products[i].sellers[j].sellersInfo[k].sellerId);
                    }
                }
            }
            let sellersArray = await Seller.find({ _id: { $in: sellersId } });

            for (let j = 0; j < user.cart.length; j++) {
                for (let k = 0; k < products.length; k++) {
                    if (user.cart[j].productId == products[k]._id) {
                        if (products[k].sellers.length == 0) {
                            user.cart.splice(j, 1);
                            user.markModified('cart');
                            await user.save();
                            res.json({
                                success: true,
                                readyCart: readyCart,
                                userCart: user.cart,
                                msg: "انجام شد",
                            });

                        } else {
                            for (let m = 0; m < products[k].sellers.length; m++) {
                                let colorExist = false;

                                if (products[k].sellers[m].color == user.cart[j].color) {
                                    colorExist = true;
                                    for (let n = 0; n < products[k].sellers[m].sellersInfo.length; n++) {
                                        if (products[k].sellers[m].sellersInfo[n].sellerId == user.cart[j].sellerId) {
                                            let shopNameSeller = "";
                                            for (let p = 0; p < sellersArray.length; p++) {
                                                if (sellersArray[p]._id == products[k].sellers[m].sellersInfo[n].sellerId) {
                                                    shopNameSeller = sellersArray[p].shopName;
                                                }
                                            }

                                            if (products[k].sellers[m].sellersInfo[n].balance < user.cart[j].quantity) {

                                                user.cart[j].quantity = products[k].sellers[m].sellersInfo[n].balance;
                                            }
                                            user.markModified('cart');
                                            await user.save();
                                            readyCart.push({
                                                "productId": user.cart[j].productId,
                                                "productName": products[k].name,
                                                "productImage": products[k].images[0],
                                                "productWeight": products[k].weight,
                                                "sellerId": user.cart[j].sellerId,
                                                "group": products[k].group,
                                                "shopNameSeller": shopNameSeller,
                                                "color": user.cart[j].color,
                                                "colorName": products[k].sellers[m].colorName,
                                                "quantity": user.cart[j].quantity,
                                                "value": {
                                                    "balance": products[k].sellers[m].sellersInfo[n].balance,
                                                    "price": products[k].sellers[m].sellersInfo[n].price,
                                                    "off": products[k].sellers[m].sellersInfo[n].off,
                                                }

                                            });
                                        }

                                    }
                                }

                            }
                        }
                    }
                }
            }
            res.json({
                success: true,
                readyCart: readyCart,
                userCart: user.cart,
                msg: "انجام شد",
            });


        }
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }


};

const getFavoriteProducts = async (req, res) => {
    try {
        let getFavoriteProducts = await User.findOne({ _id: req.body.userId });
        let getFavoriteProductssArray = getFavoriteProducts.favoriteProducts;
        const favoriteProductsInfoArray = await Product.find({ _id: { $in: getFavoriteProductssArray } });
        res.json({
            success: true,
            favoriteProductsInfoArray: favoriteProductsInfoArray,
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};

const searchBoxFilter = async (req, res) => {
    try {
        let searchKey = req.body.name;
        let searchFilter = [];

        for (let i = 0; i < searchKey.length; i++) {
            let exist = { name: { $regex: searchKey[i] } };
            searchFilter.push(exist);
        }
        let products = await Product.find({
            $and: searchFilter
        }).limit(30);

        res.json({
            success: true,
            products: products,
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};

const orderProducts = async (req, res) => {
    try {
        let productsArrayInfo = req.body.productsArray;
        let address = req.body.address;
        let sendTime = req.body.sendTime;
        let userId = req.body.userId;
        let getPassword = req.body.password;
        let walletPayment = req.body.walletPayment;


        /// 
        let sellersId = [];
        let productsArrayForSearch = [];
        let finalMessage = "";
        if (walletPayment == true) {
            for (let i = 0; i < productsArrayInfo.length; i++) {
                productsArrayForSearch.push(productsArrayInfo[i].productId);
            }
            const getProductsForCheck = await Product.find({ _id: { $in: productsArrayForSearch } });
            let checkBuyIsValid = await productFunctions.checkOrderValid(getProductsForCheck, productsArrayInfo);
            finalMessage = checkBuyIsValid.message;
            if (checkBuyIsValid.isValid === true) {
                const userInfo = await User.findOneAndUpdate({ _id: userId, password: getPassword, wallet: { $gte: checkBuyIsValid.totalPriceByOffCalculated } }, { $inc: { wallet: - checkBuyIsValid.totalPriceByOffCalculated } }, { useFindAndModify: false });
                if (userInfo !== null) {
                    address.backupPhone = userInfo.phone;
                    sellersId = checkBuyIsValid.sellersIdArray;
                    let orderId = await productFunctions.orderIdGenerator();
                    let updateBalance = await updateProductsAFterOrder(getProductsForCheck, productsArrayInfo);
                    if (updateBalance == true) {
                        let newOrder = new Order({
                            specialId: orderId,
                            sellersId: sellersId,
                            productsList: checkBuyIsValid.updateUserProducts,
                            payment: checkBuyIsValid.totalPriceByOffCalculated,
                            sendPrice: checkBuyIsValid.sendPrice,
                            totalWeight: checkBuyIsValid.totalWeight,
                            sendAddress: address,
                            sendTime: sendTime,
                            userId: userId,
                            didNotSeenSellers: sellersId,
                        });
                        userInfo.cart = [];
                        await userInfo.save();
                        // await getProductsForCheck.save();
                        await newOrder.save()
                        res.json({
                            success: true,
                            msg: finalMessage,
                        });
                    } else {
                        await User.updateOne({ _id: userId, password: getPassword, }, { wallet: { $inc: wallet + checkBuyIsValid.totalPriceByOffCalculated } }, { useFindAndModify: false });
                        res.json({
                            success: false,
                            msg: "سبد خرید خود را به روز کنید"
                        });
                    }
                } else {
                    res.json({
                        success: false,
                        msg: "موجودی کیف پول شما کافی نیست"
                    });
                }
            } else {
                res.json({
                    success: false,
                    msg: finalMessage
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

const updateProductsAFterOrder = async (productsUpdateArray, userProducts) => {
    try {
        let didValidChange = true;


        for (let i = 0; i < userProducts.length; i++) {
            let findOrginalProduct = await Product.findOne({ _id: userProducts[i].productId });

            if (findOrginalProduct != undefined) {

                ///check is off price and quantity is correct      
                let existThisColor = findOrginalProduct.sellers.find(function (sellersInfo) {
                    return sellersInfo.color == userProducts[i].color && sellersInfo.colorName == userProducts[i].colorName
                });
                if (existThisColor != undefined) {
                    let indexOfColor = findOrginalProduct.sellers.findIndex((sellerInfo) => { return sellerInfo.color == userProducts[i].color });
                    let existQuantity = existThisColor.sellersInfo.find(function (sellersMoreInfo) {
                        return sellersMoreInfo.balance >= userProducts[i].quantity && sellersMoreInfo.sellerId == userProducts[i].sellerId
                    });
                    if (existQuantity != undefined) {
                        let indexOfSeller = findOrginalProduct.sellers[indexOfColor].sellersInfo.findIndex((sellersMoreInfo) => {
                            return sellersMoreInfo.sellerId == userProducts[i].sellerId
                        });
                        if (existQuantity.balance > 1) {
                            let currentQuantity = userProducts[i].quantity;
                            findOrginalProduct.sellers[indexOfColor].sellersInfo[indexOfSeller].balance = existQuantity.balance - currentQuantity;
                            findOrginalProduct.markModified('sellers');
                            await findOrginalProduct.save()
                        } else {
                            if (findOrginalProduct.sellers[indexOfColor].sellersInfo.length > 1) {
                                findOrginalProduct.sellers[indexOfColor].sellersInfo.splice(findOrginalProduct.sellers[indexOfColor].sellersInfo[indexOfSeller], 1);
                                findOrginalProduct.markModified('sellers');
                                await findOrginalProduct.save()
                            } else {
                                findOrginalProduct.sellers.splice(findOrginalProduct.sellers[indexOfColor], 1);
                                findOrginalProduct.markModified('sellers');
                                await findOrginalProduct.save()
                            }


                        }

                    } else {
                        didValidChange = false;

                    }
                } else {
                    didValidChange = false;
                }
            } else {
                didValidChange = false;

            }
        }
        return didValidChange;
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};

const getOrders = async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId
        });
        if (user.password == req.body.password) {
            let orders = await Order.find({
                userId: req.body.userId,
                recivedByUser: req.body.recivedByUser,
                show: true,
                deleteOrderByUser: false

            }).limit(40).sort({
                orderDate: -1
            });

            res.json({
                success: true,
                orders: orders,
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
};

const getCanceledOrders = async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId
        });
        if (user.password == req.body.password) {
            let canceledOrders = await Order.find({
                userId: req.body.userId,
                deleteOrderByUser: true

            }).limit(40).sort({
                orderDate: -1
            });

            res.json({
                success: true,
                orders: canceledOrders,
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
};

const getRejectedOrders = async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId, password: req.body.password
        });
        if (user != null) {
            let getRejectedOrders = await rejectedOrder.find({
                userId: req.body.userId,

            }).limit(40).sort({
                date: -1
            });

            res.json({
                success: true,
                orders: getRejectedOrders,
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
};

const showOffOrder = async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId
        });
        if (user.password == req.body.password) {
            let order = await Order.findOne({
                _id: req.body.orderId,
                declinedAnySeller: true

            });
            order.show = false;

            await order.save();

        }

    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};

const userRecivedOrder = async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId
        });
        if (user.password == req.body.password) {
            let order = await Order.findOne({
                _id: req.body.orderId,
                postManSending: true,
                show: true

            });
            order.recivedByUser = true;

            await order.save();
            res.json({
                success: true,
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
};

const userCancelOrder = async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId, password: req.body.password
        });
        if (user !== null) {
            let nowDate = new Date();
            let oneHourAgo = nowDate.setHours(nowDate.getHours() - 1);
            let standartForamt = new Date(oneHourAgo)
            let order = await Order.findOneAndUpdate({
                _id: req.body.orderId,
                orderDate: {
                    $gte: new Date(standartForamt).toISOString(),
                },
                userId: req.body.userId,
                deleteOrderByUser: false,
                postManSending: false,
                petazhPost: false,
                recivedByUser: false

            }, {
                deleteOrderByUser: true,
                finishedProcess: true
            });

            if (order !== null) {
                let newCancelOrder = new cancelOrder({
                    orderId: order._id,
                    payment: order.payment,
                    userId: user._id,

                });
                await newCancelOrder.save();

                // let getUseruser = await User.findOneAndUpdate({
                //     _id: req.body.userId, password: req.body.password
                // }, { $inc: { wallet: +  order.payment } });
                // let balance = getUseruser.wallet + order.payment;
                res.json({
                    success: true,
                    // walletBalance: balance,
                    msg: "سفارش با موفقیت لغو شد وجه پرداختی به حساب شما برگردانده خواهد شد"
                });

            } else {
                res.json({
                    success: false,
                    msg: "تا یک ساعت پس از نهایی کردن خرید میتوان سفارش را لغو کرد"
                });
            }


        } else {
            res.json({
                success: false,
                msg: "مشکلی رخ داده است"
            });
        }


    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};

const rejectionRequest = async (req, res) => {
    try {
        let user = await User.findOne({
            _id: req.body.userId, password: req.body.password
        });
        let arrayOfProductsExist = await productFunctions.gerProductsIdArray(req.body.rejectionProducts);
        if (user !== null) {
            let nowDate = new Date();
            let order = await Order.findOneAndUpdate({
                validRejectionData: {
                    $gt: nowDate,
                },
                "productsList.productId": { $in: arrayOfProductsExist },
                _id: req.body.orderId,
                deleteOrderByUser: false,
                postManSending: true,
                petazhPost: true,
                rejection: false,
                userId: req.body.userId,
                recivedByUser: true

            }, {
                rejection: true,  /// change to true
            });

            if (order !== null) {

                let checkoutOrders = await checkoutOrder.find({
                    orderId: req.body.orderId,
                    withdrawTime: {
                        $gt: nowDate,
                    },
                });



                let checkOrderValidation = productFunctions.checkCheckoutOrderValidation(checkoutOrders, req.body.rejectionProducts);
                if (checkOrderValidation.isValid == true) {
                    let rejectionProductsArray = [];
                    for (let k = 0; k < checkOrderValidation.minusSellersPayment.length; k++) {
                        let findcheckoutOrder = await checkoutOrder.findOne({
                            orderId: req.body.orderId,
                            sellerId: checkOrderValidation.minusSellersPayment[k].sellerId,
                            paymentValue: {
                                $gte: checkOrderValidation.minusSellersPayment[k].minusPayment,
                            },
                            show: true
                        });
                        if (findcheckoutOrder != null) {
                            findcheckoutOrder.rejectionPart = true;
                            findcheckoutOrder.paymentValue -= checkOrderValidation.minusSellersPayment[k].minusPayment;
                            if (findcheckoutOrder.paymentValue <= 0) {
                                findcheckoutOrder.show = false
                            }
                            let newCheckoutRejectOrder = new checkoutRejectOrder({
                                orderId: req.body.orderId,
                                sellerId: checkOrderValidation.minusSellersPayment[k].sellerId,
                                productsList: checkOrderValidation.minusSellersPayment[k].rejectedProducts,
                                paymentValue: checkOrderValidation.minusSellersPayment[k].minusPayment,
                            });
                            await newCheckoutRejectOrder.save();
                            rejectionProductsArray.push(...checkOrderValidation.minusSellersPayment[k].rejectedProducts);
                            await findcheckoutOrder.save();

                        }

                    }

                    let newRejectedOrder = new rejectedOrder({
                        orderId: req.body.orderId,
                        rejectedProducts: rejectionProductsArray,
                        userId: req.body.userId,
                        explain: req.body.explain,
                        specialId: order.specialId,
                        sendAddress: order.sendAddress
                    })
                    await newRejectedOrder.save();
                    res.json({
                        success: true,
                        msg: "درخواست شما با موفقیت ثبت شد"
                    });
                } else {
                    res.json({
                        success: false,
                        msg: "درخواست نامعتبر"
                    });
                }



            } else {
                res.json({
                    success: false,
                    msg: "تا یک ساعت پس از نهایی کردن خرید میتوان سفارش را لغو کرد"
                });
            }


        } else {
            res.json({
                success: false,
                msg: "مشکلی رخ داده است"
            });
        }


    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};



const postRatingProduct = async (req, res) => {
    try {
        const orderId = req.body.orderId;
        let ratingDate = req.body.ratingDate;
        let checkRatedBefore = await Order.findOne({ _id: orderId });


        if (checkRatedBefore.rated === true) {
            res.json({
                success: false,
                msg: "قبلا امتیاز داده شده است",
            });
        } else {
            let userInfo = await User.findOne({ _id: checkRatedBefore.userId, password: req.body.password });
            if (userInfo != null) {
                let productsId = [];

                let getReady = () => {
                    for (let i = 0; i < ratingDate.length; i++) {
                        productsId.push(ratingDate[i].productId);
                    }
                };
                await getReady();
                let products = await Product.find({
                    "_id": { $in: productsId },
                });
                let finalResult = productFunctions.changeRatingProduct(products, ratingDate);
                // console.log(finalResult)

                for (let j = 0; j < finalResult.length; j++) {
                    await Product.updateOne({ _id: finalResult[j]._id, }, { rating: finalResult[j].rating });
                }
                checkRatedBefore.rated = true;
                await checkRatedBefore.save();

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



const getUnratedProducts = async (req, res) => {
    try {
        let orders = await Order.find({
            userId: req.body.userId, rated: false, recivedByUser: true
        });
        res.json({
            success: true,
            orders: orders
        });
    } catch (e) {
        res.json({
            success: false,
            msg: data.catchError,
        });
    }
};



module.exports = {
    getFilteredProducts: getFilteredProducts,
    // getProducts: getProducts,
    getProductDetails: getProductDetails,
    getHomeProducts: getHomeProducts,
    addToCart: addToCart,
    addToCartFromGrid: addToCartFromGrid,
    removeFromCard: removeFromCard,
    addProductToFavorite: addProductToFavorite,
    removeForomFavoriteProducts: removeForomFavoriteProducts,
    removeFromCardInGrid: removeFromCardInGrid,
    checkCartBalance: checkCartBalance,
    getReadyOrderBasket: getReadyOrderBasket,
    removeFromCardInGridInBasket: removeFromCardInGridInBasket,
    getFavoriteProducts: getFavoriteProducts,
    getBasics: getBasics,
    addSeen: addSeen,
    searchBoxFilter: searchBoxFilter,
    orderProducts: orderProducts,
    getOrders: getOrders,
    showOffOrder: showOffOrder,
    userRecivedOrder: userRecivedOrder,
    userCancelOrder: userCancelOrder,
    getCanceledOrders: getCanceledOrders,
    rejectionRequest: rejectionRequest,
    getRejectedOrders: getRejectedOrders,
    getUnratedProducts: getUnratedProducts,
    postRatingProduct: postRatingProduct

};

