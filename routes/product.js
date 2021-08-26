const { Router } = require("express");
const { check } = require("express-validator");

const {
  isRoleValid,
  isEmailExist,
  isUniqueEmail,
  isProductExist,
  isUniqueProductName,
  isCategoryExist,
} = require("../helpers/db-validators");

const {
  validFields,
  validJWT,
  validPageAndLimit,
  isAdmin,
  hasRole,
} = require("../middlewares");

const ProductController = require("../controllers/product");
class ProductRouter {
  constructor() {
    this.router = Router();
    this.productController = new ProductController();

    this.initRouter();
  }

  initRouter() {
    this.router.get(
      "/",
      [validJWT, validPageAndLimit],
      this.productController.getProducts
    );

    this.router.post(
      "/",
      [
        validJWT,
        check("name", "Name is required").not().isEmpty(),
        check("category", "This Id not valid mongoDB").isMongoId(),
        check("category").custom(isCategoryExist),
        validFields,
      ],
      this.productController.postProduct
    );

    this.router.put(
      "/:id",
      [
        validJWT,
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isProductExist),
        check("id").custom((id, { req }) => isUniqueProductName(id, req)),
        check("category", "This Id not valid mongoDB")
          .if((value) => !!value)
          .isMongoId(),
        check("category")
          .if((value) => !!value)
          .custom(isCategoryExist),
        validFields,
      ],
      this.productController.putProduct
    );

    this.router.get(
      "/:id",
      [
        validJWT,
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isProductExist),
        validFields,
      ],
      this.productController.getProduct
    );

    this.router.delete(
      "/:id",
      [
        validJWT,
        // isAdmin,
        hasRole("ADMIN_ROLE", "USER_ROLE"),
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isProductExist),
        validFields,
      ],
      this.productController.deleteProduct
    );
  }

  getRouter() {
    return this.router;
  }
}
module.exports = ProductRouter;
