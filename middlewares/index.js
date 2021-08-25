const validFields = require("./valid-fields");
const validPageAndLimit = require("./valid-page-limit");
const validJWT = require("./valid-jwt");
const validRole = require("./valid-role");

module.exports = {
  ...validFields,
  ...validPageAndLimit,
  ...validJWT,
  ...validRole,
};
