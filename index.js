const { ApolloServer } = require("apollo-server");
require('dotenv').config({ path: '.env' });
const mongoose = require("mongoose");

const mongodbURL = `mongodb://${process.env.DB_PRODUCTS_NAME}:27017/Products`;
mongoose.connect(mongodbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true, 
  useFindAndModify: false,
}); 

const dbConnection = mongoose.connection;
dbConnection.on("error,", (err) => console.log(`DB Connection error: ${err}`));
dbConnection.once("open,", () => console.log("Connected to DB!"));

const checkIsAuthorized = require("./src/utils/check-is-authorized");

const { CategoriesModel, ProductsModel } = require("./src/models");
const { typeDefs } = require("./src/shema");
const { Mutation } = require("./src/mutation");

const resolvers = {
  Query: {
    products: async (parent, args, context, info) => {
      return await ProductsModel.find({ owner: args.userId });
    },
    product: async (parent, args, context, info) => {
      return await ProductsModel.find({ _id: args.id });
     },
    categories: async (parent, args, context, info) => {
      return await CategoriesModel.find({ owner: args.userId, parent: null });
    },
    productsByCategories: async (parent, args, context, info) => {
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // TODO: Добавлять продукты к соответствующим категориям, что быы не проходится по всем продуктам при поиске
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      console.log('productsCategory', args.productsCategory);

      return await ProductsModel.find({ categories: { "$in" : args.productsCategory} });
     },
  },
  Product: {
    categoriesFull: async (parent, args, context, info) => {
      return await CategoriesModel.find({
        _id: {
          $in: parent.categories,
        },
      });
    },
  },
  Category: {
    childrens: async (parent) => {
      return await CategoriesModel.find({
        _id: {
          $in: parent.childrens,
        },
      });
    },
    parent: async (parent) => {
      return await CategoriesModel.findOne({ _id: parent.parent });
    },
  },

  Mutation,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => ({
    user: await checkIsAuthorized(req.headers.authorization)
      .then(({ data }) => data)
      .catch((err) => false),
  }),
});

const port = 3222;
server.listen(port, '0.0.0.0').then(({ url }) => {
  console.log(`🚀  Server ready at ${url}:${port}`);
});
