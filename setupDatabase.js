const { Client } = require("pg");
const { DB } = require("./config");

(async () => {
  const usersTableStatement = `
    CREATE TABLE IF NOT EXISTS users (
      id            INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      email         VARCHAR(50),
      firstName     VARCHAR(50),
      lastName      VARCHAR(50),
      password      TEXT,
      updatedTime   DATE
    );
  `;

  const productsTableStatement = `
    CREATE TABLE IF NOT EXISTS products (
      id            INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      name          VARCHAR(50)   NOT NULL,
      price         BIGINT        NOT NULL,
      description   VARCHAR(200)  NOT NULL
    );
  `;

  const ordersTableStatement = `
    CREATE TABLE IF NOT EXISTS orders (
      id            INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      total         INT           NOT NULL,
      status        VARCHAR(50)   NOT NULL,
      userId        INT           NOT NULL,
      updatedTime   DATE          NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `;

  const orderItemsTableStatement = `
    CREATE TABLE IF NOT EXISTS orderItems (
      id            INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      quantity       INT           NOT NULL,
      orderId       INT           NOT NULL,
      productId     INT           NOT NULL,
      FOREIGN KEY (orderId) REFERENCES orders(id),
      FOREIGN KEY (productId) REFERENCES products(id)
    );
  `;

  const cartsTableStatement = `
    CREATE TABLE IF NOT EXISTS carts (
      id            INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      userId        INT           NOT NULL,
      updateTime    DATE          NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
  `;

  const cartItemsTableStatement = `
    CREATE TABLE IF NOT EXISTS cartItems (
      id            INT           PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
      productId     INT           NOT NULL,
      cartId        INT           NOT NULL,
      quantity      INT           NOT NULL,
      FOREIGN KEY (productId) REFERENCES products(id),
      FOREIGN KEY (cartId) REFERENCES carts(id)
    );
  `;

  try {
    const db = new Client({
      user: DB.PGUSER,
      host: DB.PGHOST,
      database: DB.PGDATABASE,
      password: DB.PGPASSWORD,
      port: DB.PGPORT,
    });

    await db.connect();

    // Create tables on database
    await db.query(usersTableStatement);
    await db.query(productsTableStatement);
    await db.query(ordersTableStatement);
    await db.query(orderItemsTableStatement);
    await db.query(cartsTableStatement);
    await db.query(cartItemsTableStatement);

    await db.end();
  } catch (err) {
    console.log("ERROR CREATING TABLES: ", err);
  }
})();
