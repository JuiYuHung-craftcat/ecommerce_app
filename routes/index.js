const authRouter = require("./authRoute");
const userRouter = require("./userRoute");
const productRouter = require("./productRoute");
const cartRouter = require("./cartRoute");
const orderRouter = require("./orderRoute");

module.exports = (app, passport) => {
  authRouter(app, passport);
  userRouter(app);
  productRouter(app);
  cartRouter(app);
  orderRouter(app);
};
