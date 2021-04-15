// PRODUCTS MODEL ==============================================
const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const productsShema = new Shema({
  title: String,
  short_description: String,
  description: String,
  preview: String,
  cost: Number,
  warehouse: Number,
  rating: Number,
  categories: [String],
  owner: String,
});

module.exports = mongoose.model("Products", productsShema);

// ===============================================================
