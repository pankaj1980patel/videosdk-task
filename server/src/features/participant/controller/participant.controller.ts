import { NextFunction, Request, Response } from "express";
import { prisma } from "@/prisma";
import { HTTP_STATUS } from "@/globals/constants/http";

class ParticipantController {
  async getAllParticipants(req: Request, res: Response) {
    const participants = await prisma.participant.findMany();
    return res.status(HTTP_STATUS.OK).json(participants);
  }

  async createParticipant(req: Request, res: Response, next: NextFunction) {
    const participant = await prisma.participant.create({
      data: req.body,
    });
    return res.status(HTTP_STATUS.CREATED).json(participant);
  }

  async deleteParticipant(req: Request, res: Response) {
    const participant = await prisma.participant.delete({
      where: {
        id: req.params.id,
      },
    });
    return res.status(HTTP_STATUS.OK).json(participant);
  }

  async updateParticipant(req: Request, res: Response) {
    const participant = await prisma.participant.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    return res.status(HTTP_STATUS.OK).json(participant);
  }

  async getParticipantById(req: Request, res: Response) {
    const participant = await prisma.participant.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        events: true,
      },
    });
    return res.status(HTTP_STATUS.OK).json(participant);
  }
}

export const participantController = new ParticipantController();
