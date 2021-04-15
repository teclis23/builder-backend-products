// PAGE CATEGORIES MODEL ==============================================
const mongoose = require("mongoose");
const Shema = mongoose.Schema;

const categoriesShema = new Shema({
  title: String,
  description: String,
  icon: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Categories" },
  childrens: [{ type: mongoose.Schema.Types.ObjectId, ref: "Categories" }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Products" }],
  owner: String,
});

module.exports = mongoose.model("Categories", categoriesShema);

// ===============================================================
