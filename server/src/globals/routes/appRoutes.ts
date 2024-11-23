import eventRouter from "@/features/event/route/event.route";
import sessionRouter from "@/features/session/route/session.route";
import { Application } from "express";

const appRoute = (app: Application) => {
  // app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/session", sessionRouter);
  app.use("/api/v1/event", eventRouter);
  app.get("/", (_req, res) => {
    return res.send("Hello world!");
  });
};

export default appRoute;
