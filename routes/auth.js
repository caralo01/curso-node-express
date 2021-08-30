const { Router } = require("express");
const { check } = require("express-validator");

const { isEmailExist } = require("../helpers/db-validators");
const { validFields } = require("../middlewares/valid-fields");

const { login, googleSignIn, renovateToken } = require("../controllers/auth");
const { validJWT } = require("../middlewares");

class AuthRoutes {
  constructor() {
    this.router = Router();

    this.initRouter();
  }

  initRouter() {
    this.router.post(
      "/login",
      [
        check("email", "This email is not valid").isEmail(),
        check("password", "Passsword is required").not().isEmpty(),
        validFields,
      ],
      login
    );

    this.router.post(
      "/google",
      [check("id_token", "id_token is required").not().isEmpty(), validFields],
      googleSignIn
    );

    this.router.get("/validate-token", validJWT, renovateToken);
  }

  getRouter() {
    return this.router;
  }
}
module.exports = AuthRoutes;
