import express, { Application, NextFunction, Request, Response } from "express";
import "dotenv/config";
import appRoute from "@/globals/routes/appRoutes";
import { HTTP_STATUS } from "@/globals/constants/http";
import { CustomError, NotFoundException } from "@/globals/middlewares/error.middleware";
class Server {
  private app: Application;
  constructor(app: Application) {
    this.app = app;
  }

  public start() {
    this.setupMiddleware();
    this.setupRoutes();
    this.setupGlobalError();
    this.startServer();
  }
  private setupMiddleware(): void {
    this.app.use(express.json());
  }
  private setupRoutes(): void {
    appRoute(this.app);
  }
  private setupGlobalError(): void {
    // Not found
    this.app.all("*", (req, res, next) => {
      return next(new NotFoundException(`Can't find ${req.originalUrl} on this server.`));
    });

    // Global error handler
    this.app.use(((err: any, req: Request, res: Response, next: NextFunction) => {
      if (err instanceof CustomError) {
        return res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(err.getErrorMessage());
      }
      next();
    }));
  }

  private startServer() {
    const port = Number(process.env.PORT || 5050);
    const server = this.app.listen(port, () => {
      console.log("Server started serving");
      console.log(server.address());
    });
  }
}

export default Server;
