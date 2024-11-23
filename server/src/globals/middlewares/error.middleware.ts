import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS } from "@/globals/constants/http";

export abstract class CustomError extends Error {
  abstract status: boolean;
  abstract statusCode: number;
  constructor(message: string) {
    super(message);
  }
  public getErrorMessage() {
    return {
      status: this.status,
      message: this.message,
      statusCode: this.statusCode
    };
  }
}

export class BadRequestException extends CustomError {
  status: boolean = false;
  statusCode: number = HTTP_STATUS.BAD_REQUEST;
  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedException extends CustomError {
  status: boolean = false;
  statusCode: number = HTTP_STATUS.UNAUTHORIZED;
  constructor(message: string) {
    super(message);
  }
}

export class ForbiddenException extends CustomError {
  status: boolean = false;
  statusCode: number = HTTP_STATUS.FORBIDDEN;
  constructor(message: string) {
    super(message);
  }
}

export class NotFoundException extends CustomError {
  status: boolean = false;
  statusCode: number = HTTP_STATUS.NOT_FOUND;
  constructor(message: string) {
    super(message);
  }
}

export class InternalServerErrorException extends CustomError {
  status: boolean = false;
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  constructor(message: string) {
    super(message);
  }
}

export function asyncWrapper(callback: Function) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (error: any) {
      console.log("Error in asyncWrapper: ", error);
      return next(new InternalServerErrorException("Something went wrong!"));
    }
  };
}
