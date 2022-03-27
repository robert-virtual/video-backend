const multer = require("multer");
const { v4: uuid } = require("uuid");
const storage = multer.diskStorage({
  destination(_, __, cb) {
    cb(null, "./uploads");
  },
  filename(_, file, cb) {
    let extension = file.originalname.split(".")[1];
    cb(null, `${uuid()}.${extension}`);
  },
});

exports.upload = multer({ storage });
