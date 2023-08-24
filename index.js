const express = require("express");
const app = express();

const loaders = require("./loaders");

const { PORT } = require("./config");

async function startServer() {
  // Init Application
  loaders(app);

  // Start Server
  app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
  });
}

startServer();
