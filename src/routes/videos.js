const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { upload } = require("../helpers/multer");
const prisma = new PrismaClient();
const { round, random } = Math;
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
