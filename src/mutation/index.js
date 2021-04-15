const category = require("./category");
const product = require("./product");

module.exports = {
  Mutation: {
    ...product,
    ...category,
  },
};
