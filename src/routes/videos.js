const fs = require("fs");
const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { upload } = require("../helpers/multer");
const path = require("path");
const prisma = new PrismaClient();
const { round, random } = Math;
// eliminar files
router.get("/delete", async (req, res) => {
  const { secret } = req.query;
  if (secret != process.env.DELETE_FILES) {
    return res.json({ msg: "Acceso denegado" });
  }
  fs.readdir("./uploads", (err, files) => {
    if (err) {
      return res.json({ err });
    }
    console.log(files);
    try {
      files.forEach((f) => {
        fs.unlinkSync(path.resolve("./uploads/", f));
      });
      res.json({ msg: `${files.length} archivos borrados` });
    } catch (error) {
      res.json({ msg: error.message });
    }
  });
});
// obtener files
router.get("/files", async (req, res) => {
  fs.readdir("./uploads", (err, files) => {
    console.log(files);
    res.json(files);
  });
});

// obtener videos
router.get("/", async (req, res) => {
  let videos = await prisma.video.findMany({
    select: {
      id: true,
      titulo: true,
      filename: true,
      user: {
        select: {
          nombre: true,
        },
      },
    },
  });

  videos = videos.map((v) => ({
    ...v,
    url: (v.url = `${process.env.APP_URL}/${v.filename}`),
  }));
  res.json(videos);
});

// subir video
router.post("/", upload.array("video"), async (req, res) => {
  try {
    const { titulo } = req.body;
    console.log(titulo);
    const video = await prisma.video.create({
      data: {
        titulo,
        filename: req.files[0].filename,
        user: {
          // va a crear un usuario aleatori por cada video
          create: {
            nombre: "Usuario radom" + round(random() * 500),
            clave: "clave radom" + round(random() * 500),
            email: `${"correoradom" + round(random() * 500)}@gmail.com`,
          },
        },
      },
    });
    res.json({ video });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
