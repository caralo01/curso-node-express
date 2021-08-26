const { Router } = require("express");
const { check } = require("express-validator");

const SearchController = require("../controllers/search");
const { validJWT, validPageAndLimit } = require("../middlewares");

class SearchRouter {
  constructor() {
    this.router = Router();
    this.searchController = new SearchController();

    this.initRouter();
  }

  initRouter() {
    this.router.get(
      "/:collection/:term",
      [validJWT, validPageAndLimit],
      this.searchController.getItems
    );
  }

  getRouter() {
    return this.router;
  }
}
module.exports = SearchRouter;
