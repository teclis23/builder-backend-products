const mongoose = require("mongoose");
const { ProductsModel } = require("../models");

module.exports = {
  addProduct: async (parent, args, context, info) => {
    if (context.user) {
      const {
        title,
        cost,
        short_description = "",
        description = "",
        preview = "",
        warehouse = 0,
        rating = 0,
        categories = [],
      } = args;
      const product = new ProductsModel({
        title: title,
        owner: context.user._id,
        cost: cost,
        short_description: short_description,
        description: description,
        preview: preview,
        warehouse: warehouse,
        rating: rating,
        categories: categories,
      });

      if (categories.length > 0) {
        // TODO: Save product to categories
      }
      product.save();
    }
  },
  updateProduct: async (parent, args, context, info) => {
    if (context.user) {
      const {
        title,
        cost,
        short_description = "",
        description = "",
        preview = "",
        warehouse = 0,
        rating = 0,
        categories = [],
      } = args;
      ProductsModel.findOneAndUpdate(
        { _id: args.id },
        {
          title: title,
          cost: cost,
          short_description: short_description,
          description: description,
          preview: preview,
          warehouse: warehouse,
          rating: rating,
          categories: categories,
        }
      )
        .then(() => {
          console.log("Successfuly update page");
        })
        .catch((err) => {
          console.log("Update page error: ", err);
        });
    }
  },
  removeProduct: async (parent, args, context, info) => {
    if (context.user) {
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // TODO: Удалять продукт из списка категорий
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      return ProductsModel.findByIdAndRemove(
        args.id,
        { new: true },
        (err, doc) => {}
      );
    }
  },
};
