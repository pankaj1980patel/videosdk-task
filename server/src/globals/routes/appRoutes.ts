import { Application } from "express";

const appRoute = (app: Application) => {
  // app.use("/api/v1/auth", authRouter);
  app.get("/", (_req, res) => {
    return res.send("Hello world!");
  });
};

export default appRoute;
