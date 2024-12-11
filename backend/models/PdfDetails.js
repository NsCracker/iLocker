const mongoose = require("mongoose");
const { Schema } = mongoose;

const PdfDetailsSchema = new Schema({
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  title:{
      type: String,
      required: true
  },
  pdf:{
      type: String,
      required: true, 
  }
  },
  { collection: "PdfDetails" }
);

const PdfDetails = mongoose.model("PdfDetails", PdfDetailsSchema);
module.exports = PdfDetails;