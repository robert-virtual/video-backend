const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
  app.use(require("morgan")("dev"));
}

app.use(express.static("uploads"));
app.use(express.json());
app.use("/videos", require("./routes/videos"));

app.listen(port, () => {
  console.log("aplicacion ejecutandose en el puerto: ", port);
});
