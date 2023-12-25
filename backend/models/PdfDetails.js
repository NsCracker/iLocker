const mongoose = require("mongoose");
const { Schema } = mongoose;

const PdfDetailsSchema = new Schema(
  {
    pdf: String,
    title: String,
  },
  { collection: "PdfDetails" }
);

const PdfDetails = mongoose.model("PdfDetails", PdfDetailsSchema);
module.exports = PdfDetails;