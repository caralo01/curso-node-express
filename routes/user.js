const { Router } = require("express");
const { check } = require("express-validator");

const {
  isRoleValid,
  isEmailExist,
  isUserExist,
  isUniqueEmail,
} = require("../helpers/db-validators");
const { validFields } = require("../middlewares/valid-fields");
const { validPageAndLimit } = require("../middlewares/valid-page-limit");

const UserController = require("../controllers/user");
class UserRoutes {
  constructor() {
    this.router = Router();
    this.userController = new UserController();

    this.initRouter();
  }

  initRouter() {
    this.router.get("/", [validPageAndLimit], this.userController.getUsers);

    this.router.post(
      "/",
      [
        check("name", "Name is required").not().isEmpty(),
        check("email", "This email is not valid").isEmail(),
        check("email").custom(isEmailExist),
        check("password", "Passsword must have minium 6 letters").isLength({
          min: 6,
        }),
        // check('role', 'This role is not valid').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check("role").custom(isRoleValid),
        validFields,
      ],
      this.userController.postUser
    );

    this.router.put(
      "/:id",
      [
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isUserExist),
        check("id").custom((id, { req }) => isUniqueEmail(id, req)),
        check("role").custom(isRoleValid),
        validFields,
      ],
      this.userController.putUser
    );

    this.router.patch("/:id", this.userController.patchUser);

    this.router.delete(
      "/:id",
      [
        check("id", "This Id not valid mongoDB").isMongoId(),
        check("id").custom(isUserExist),
        validFields,
      ],
      this.userController.deleteUser
    );
  }

  getRouter() {
    return this.router;
  }
}
module.exports = UserRoutes;
