const express = require("express");
const router = express.Router();
const Upload = require("../models/upload");
const sharp = require("sharp");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get All Files
router.get("", async (req, res) => {
  try {
    res.status(200).json(await Upload.find().distinct("_id"));
  } catch (err) {
    console.error(err);
  }
});

// Add Files
router.post(
  "",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "cover", maxCount: 1 },
    { name: "gallery" },
  ]),
  async (req, res) => {
    try {
      const { avatar, cover, gallery } = req.files;
      if (avatar) await uploadFile(avatar[0]);
      if (cover) await uploadFile(cover[0]);
      if (gallery) gallery.forEach(async (file) => await uploadFile(file));
      return res.status(202).json("Photos uploaded!");
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  }
);

// Get File
router.get("/:resize?/:id", async (req, res) => {
  const { resize, id } = req.params;
  try {
    const data = await Upload.findById(id);
    if (!data) return;
    const { file, mimetype } = data;
    const width = parseInt(resize?.split("x")[0]);
    const height = parseInt(resize?.split("x")[1]);
    let buffer = Buffer.from(file, "base64");
    if (mimetype.includes("image") && width && height)
      buffer = await sharp(buffer)
        .resize({
          width,
          height,
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .toBuffer();
    res.end(buffer, "binary");
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Delete Image
router.delete("/:id", async (req, res) => {
  try {
    await Upload.deleteOne({ _id: req.params.id });
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

async function uploadFile(file) {
  if (!file) return;
  let { mimetype, originalname, buffer, fieldname: field } = file;
  const width = field == "avatar" ? 400 : 1200;
  const height = field == "avatar" ? 400 : 1200;
  const name = Date.now() + "-" + originalname.toLowerCase();
  if (file.mimetype.includes("image"))
    buffer = await sharp(buffer)
      .resize(width, height, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toBuffer();
  await new Upload({
    _id: name,
    field,
    mimetype,
    file: buffer.toString("base64"),
  }).save();
  console.log(name);
  return name;
}

module.exports = router;
