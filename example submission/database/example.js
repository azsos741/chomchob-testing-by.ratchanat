// solution
const {Sequelize,DataTypes} = require("sequelize");
const sequelize = new Sequelize("dbtest", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

const User = sequelize.define("User", {
  user_name: Sequelize.STRING,
  wallet: Sequelize.INTEGER,
});

const Order = sequelize.define("Order", {

});

const Promotion = sequelize.define("Promotion", {
  Promotion_new_price: Sequelize.INTEGER,
  Promotion_qty: Sequelize.INTEGER,
  Promotion_opendate: Sequelize.DATE,
  Promotion_enddate: Sequelize.DATE,
});

const Item = sequelize.define("Item", {
  item_name: Sequelize.STRING,
  item_code: Sequelize.STRING,
  item_qty: Sequelize.INTEGER,
  item_price: Sequelize.DOUBLE,
  item_opendate: Sequelize.DATE,
  item_enddate: Sequelize.DATE,
});

User.Order = User.hasMany(Order);
Item.Order = Item.hasMany(Order);
Item.Promotion = Item.hasMany(Promotion);
Promotion.Order = Promotion.hasMany(Order);
Promotion.Item = Promotion.belongsTo(Item);
Order.User = Order.User = Order.belongsTo(User);
Order.Promotion = Order.belongsTo(Promotion);
Order.Item = Order.belongsTo(Item);


(async () => {
  try {
    await sequelize.authenticate();
    await User.sync();
    await Item.sync();
    await Promotion.sync();
    await Order.sync();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
