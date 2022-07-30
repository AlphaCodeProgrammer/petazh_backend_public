const router = require("express").Router();
const productController = require("../controller/product");


router.post("/get-filtered-products", productController.getFilteredProducts);


router.post("/get-basics", productController.getBasics);

// router.post("/get-products", productController.getProducts);

router.post("/get-home-products", productController.getHomeProducts);


router.post("/get-product-details", productController.getProductDetails);

router.post("/add-to-user-cart", productController.addToCart);

router.post("/remove-from-user-cart", productController.removeFromCard);

router.post("/add-to-user-cart-grid", productController.addToCartFromGrid);

router.post("/remove-from-user-cart-grid-in-basket", productController.removeFromCardInGridInBasket);

router.post("/remove-from-user-cart-grid", productController.removeFromCardInGrid);

router.post("/add-favorite-product", productController.addProductToFavorite);

router.post("/remove-favorite-product", productController.removeForomFavoriteProducts);

router.post("/check-cart-balance", productController.checkCartBalance);

router.post("/get-cart-info", productController.getReadyOrderBasket);

router.post("/get-favorite-products", productController.getFavoriteProducts);

router.post("/add-seen", productController.addSeen);
router.post("/search-product", productController.searchBoxFilter);


router.post("/order-products", productController.orderProducts);

router.post("/get-orders", productController.getOrders);

router.post("/show-off-order", productController.showOffOrder);

router.post("/user-recived-order", productController.userRecivedOrder);


router.post("/user-reject-order", productController.userCancelOrder);

router.post("/get-canceled-orders", productController.getCanceledOrders);

router.post("/get-rejected-orders", productController.getRejectedOrders);

router.post("/rejection-request", productController.rejectionRequest);

router.post("/get-product-unrating", productController.getUnratedProducts);



router.post("/post-product-rating", productController.postRatingProduct);

module.exports = router;
