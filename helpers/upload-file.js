const path = require("path");
const { v4: uuidv4 } = require("uuid");

const uploadFile = (
  files,
  validExtestions = ["png", "jpg", "jpeg", "gif"],
  folder = ""
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const shortName = file.name.split(".");
    const extension = shortName[shortName.length - 1];

    // Validar la extension
    if (!validExtestions.includes(extension)) {
      return reject(
        `The extension ${extension} don't allow - ${validExtestions}`
      );
    }

    const nameTemp = uuidv4() + "." + extension;
    const uploadPath = path.join(__dirname, "../uploads/", folder, nameTemp);

    file.mv(uploadPath, (err) => {
      if (err) {
        reject(err);
      }

      resolve(nameTemp);
    });
  });
};

module.exports = {
  uploadFile,
};
