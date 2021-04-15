const { ApolloError } = require("apollo-server");
const mongoose = require("mongoose");
const { CategoriesModel, ProductsModel } = require("../models");

module.exports = {
  addCategory: async (parent, args, context, info) => {
    // TODO: Если есть parent или childrens необходимо добавлять соответствующие данные в категории
    if (context.user) {
      const { title, description, parent = null, childrens = [] } = args;

      if (title.trim() === "") {
        return new ApolloError("Заголовок не может быть пустым", 100, {});
      }

      const category = new CategoriesModel({
        title,
        description,
        owner: context.user._id,
        parent,
        childrens,
        products: [],
      });

      if (parent) {
        // Если создана как дочерняя категория
        CategoriesModel.updateOne(
          { _id: args.parent },
          { $push: { childrens: category } }
        )
          .then(() => {
            console.log("Sucess save to parent category");
            category.save();
          })
          .catch((err) => {
            console.log("Save to parent category error: ", err);
          });
      } else {
        category.save();
      }
    }
  },
  updateCategory: async (parent, args, context, info) => {
    if (context.user) {
      const { title, description, icon, parent } = args;

      console.log("ARGS: ", args);
      //
      //   TODO: Дбавить проверку: запретить перемещать категории у которыых есть childrens
      //
      const category = await CategoriesModel.findOne({ _id: args.id });

      if (title.trim() === "") {
        return new ApolloError("Заголовок не может быть пустым", 100, {});
      } else {
        category.title = title.trim();
      }
      if (description) category.description = description;
      if (icon) category.description = icon;

      if (parent === null) {
        // Удаление родительской категории
        const parentCategory = await CategoriesModel.findOne({
          _id: category.parent,
        });

        parentCategory.childrens = parentCategory.childrens.filter((el) => {
          return el.toString() !== category._id.toString();
        });
        (await parentCategory).save();

        category.parent = null;
        // --------------------------------
      } else if (!category.parent && !!parent) {
        // Установка категории
        const parentCategory = await CategoriesModel.findOne({ _id: parent });
        if (parentCategory.childrens.indexOf !== -1) {
          parentCategory.childrens.push(category._id);
          (await parentCategory).save();
        }

        category.parent = parent;
        // -------------------------------
      } else if (!!category.parent && !!parent) {
        // Смена родительской категории
        const oldParentCategory = await CategoriesModel.findOne({
          _id: category.parent,
        });
        oldParentCategory.childrens = oldParentCategory.childrens.filter(
          (el) => el.id === category._id
        );
        (await oldParentCategory).save();

        const newParentCategory = await CategoriesModel.findOne({
          _id: parent,
        });
        if (newParentCategory.childrens.indexOf !== -1) {
          newParentCategory.childrens.push(category._id);
          (await newParentCategory).save();
        }

        category.parent = parent;
        // -----------------------------
      }
      (await category).save();

      return category;
    }
  },
  removeCategory: async (parent, args, context, info) => {
    if (context.user) {
      const doc = await CategoriesModel.findOne({ _id: args.id });

      // Удаление категории у продуктов
      ProductsModel.updateMany(
        { categories: { $in: [doc._id] } },
        { $pullAll: { categories: [doc._id] } },
        (err, raw) => console.log("RAW", raw)
      );

      // Дочерние категории выносятся на верхний уровень
      CategoriesModel.find()
        .where("_id")
        .in(doc.childrens)
        .exec((err, records) => {
          console.log("records", records);
          for (let i = 0; records.length > i; i++) {
            records[i].parent = null;
            records[i].save();
          }
        });

      return (await doc).remove();
    }
  },
};
