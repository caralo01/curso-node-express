const { Router } = require("express");
const { check } = require("express-validator");
const {
  loadFile,
  updateImage,
  showImage,
  updateImageCloudinary,
} = require("../controllers/uploads");
const { allowedCollections } = require("../helpers/db-validators");
const { validFields } = require("../middlewares");
const { validFileUpload } = require("../middlewares/valid-file-upload");

const router = Router();

router.post("/", [validFileUpload, validFields], loadFile);

router.post(
  "old/:collection/:id",
  [
    validFileUpload,
    check("id", "ID must be mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validFields,
  ],
  updateImage
);

router.post(
  "/:collection/:id",
  [
    validFileUpload,
    check("id", "ID must be mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validFields,
  ],
  updateImageCloudinary
);

router.get(
  "/:collection/:id",
  [
    check("id", "ID must be mongo").isMongoId(),
    check("collection").custom((c) =>
      allowedCollections(c, ["users", "products"])
    ),
    validFields,
  ],
  showImage
);

module.exports = router;
