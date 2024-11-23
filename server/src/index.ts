import "express-async-errors";
import express from "express";
import Server from "./server";

class ShopApplication {
  public run() {
    const app = express();
    const server = new Server(app);
    server.start();
  }
}

const shopApplication = new ShopApplication();
shopApplication.run();
