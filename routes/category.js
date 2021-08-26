const { Router } = require("express");
const { check } = require("express-validator");

const {
  isRoleValid,
  isEmailExist,
  isUniqueEmail,
  isCategoryExist,
  isUniqueCategoryName,
} = require("../helpers/db-validators");

const {
  validFields,
  validJWT,
  validPageAndLimit,
  isAdmin,
  hasRole,
} = require("../middlewares");

const CategoryController = require("../controllers/category");
class CategoryRouter {
  constructor() {
    this.router = Router();
    this.categoryController = new CategoryController();

    this.initRouter();
  }

  initRouter() {
    this.router.get(
      "/",
      [validJWT, validPageAndLimit],
      this.categoryController.getCategories
    );

    this.router.post(
      "/",
      [
        validJWT,
        check("name", "Name is required").not().isEmpty(),
        validFields,
      ],
      this.categoryController.postCategory
    );

    this.router.put(
      "/:id",
      [
        validJWT,
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isCategoryExist),
        check("id").custom((id, { req }) => isUniqueCategoryName(id, req)),
        validFields,
      ],
      this.categoryController.putCategory
    );

    this.router.get(
      "/:id",
      [
        validJWT,
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isCategoryExist),
        validFields,
      ],
      this.categoryController.getCategory
    );

    this.router.delete(
      "/:id",
      [
        validJWT,
        // isAdmin,
        hasRole("ADMIN_ROLE", "USER_ROLE"),
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isCategoryExist),
        validFields,
      ],
      this.categoryController.deleteCategory
    );
  }

  getRouter() {
    return this.router;
  }
}
module.exports = CategoryRouter;
