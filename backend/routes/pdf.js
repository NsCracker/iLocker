const express = require('express');
const router = express.Router();
const PdfSchema= require('../models/PdfDetails');
const multer  = require('multer');
const path = require('path');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');


const filesPath = path.resolve(__dirname, '../files');
router.use("/files", express.static(filesPath));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.resolve(__dirname, "../files");
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});
const upload = multer({ storage: storage });



router.post("/upload-files", fetchuser, upload.single("file"), [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  ], async (req, res) => {
  console.log(req.file);

  try {
    const { title} = req.body;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const pdfdata = new PdfSchema({
      title, pdf: req.file.filename,user: req.user.id
  })
    const savedPdf = await pdfdata.save()

    res.json(savedPdf)

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
});

router.get("/get-files", fetchuser, async (req, res) => {
  try {
    const files = await PdfSchema.find({ user: req.user.id });
    res.json({ status: "ok", data: files });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
}
});

module.exports = router