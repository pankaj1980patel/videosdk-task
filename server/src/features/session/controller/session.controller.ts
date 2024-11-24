import { Request, Response } from "express";
import { prisma } from "@/prisma";
import { HTTP_STATUS } from "@/globals/constants/http";

class SessionController {
  async getAllSessions(req: Request, res: Response) {
    try {
      const { page = 1, limit = 10 } = req.query;
      // Parse page and limit to ensure they are numbers
      const pageNumber = parseInt(page as string, 10);
      const pageLimit = parseInt(limit as string, 10);
      if (
        isNaN(pageNumber) ||
        isNaN(pageLimit) ||
        pageNumber <= 0 ||
        pageLimit <= 0
      ) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          status: false,
          message: "Page and limit must be positive integers.",
        });
      }
      // Calculate the number of records to skip
      const skip = (pageNumber - 1) * pageLimit;
      // Fetch paginated sessions
      const sessions = await prisma.session.findMany({
        skip,
        take: pageLimit,
      });
      // Count total records for metadata
      const totalSessions = await prisma.session.count();

      return res.status(HTTP_STATUS.OK).json({
        status: true,
        data: sessions,
        meta: {
          total: totalSessions,
          page: pageNumber,
          limit: pageLimit,
          totalPages: Math.max(Math.ceil(totalSessions / pageLimit), 1),
        },
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }

  async createSession(req: Request, res: Response) {
    try {
      const existingSession = await prisma.session.findUnique({
        where: {
          meetingId: req.body.meetingId,
        },
      });

      if (existingSession) {
        return res
          .status(HTTP_STATUS.CONFLICT)
          .json({ status: false, message: "Session already exists" });
      }
      const session = await prisma.session.create({
        data: req.body,
      });
      return res.status(HTTP_STATUS.CREATED).json(session);
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }

  async deleteSession(req: Request, res: Response) {
    try {
      const existingSession = await prisma.session.findUnique({
        where: {
          meetingId: req.params.id,
        },
      });
      if (!existingSession) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ status: false, message: "Session not found" });
      }
      await prisma.session.delete({
        where: {
          meetingId: existingSession.id,
        },
      });
      return res.status(HTTP_STATUS.OK).json({
        status: true,
        message: "Session deleted successfully",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }

  async updateSession(req: Request, res: Response) {
    try {
      const existingSession = await prisma.session.findUnique({
        where: {
          meetingId: req.params.id,
        },
      });
      if (!existingSession) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ status: false, message: "Session not found" });
      }
      const session = await prisma.session.update({
        where: {
          meetingId: req.params.id,
        },
        data: req.body,
      });
      return res.status(HTTP_STATUS.OK).json(session);
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }

  async getSessionById(req: Request, res: Response) {
    try {
      const session = await prisma.session.findUnique({
        where: {
          id: req.params.id,
        },
        include: {
          participants: {
            include: {
              events: {
                select: {
                  errors: true,
                  mic: true,
                  screenShare: true,
                  screenShareAudio: true,
                  webcam: true,
                },
              },
              timelog: true,
            },
          },
        },
      });
      if (!session) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ status: false, message: "Session not found" });
      }
      return res.status(HTTP_STATUS.OK).json({ status: true, data: session });
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }

  async addParticipant(req: Request, res: Response) {
    try {
      const meetingId = req.body.meetingId;
      const participant = req.body.participant;
      const session = await prisma.session.findUnique({
        where: { meetingId },
        include: { participants: true }, // Include participants for the check
      });
      if (!session) {
        throw new Error("Session not found");
      }
      const isUniqueParticipant = !session.participants.some(
        (participant) => participant.participantId === participant.participantId
      );

      // Add a new participant instance (even if participantId exists)
      const newParticipant = await prisma.participant.create({
        data: {
          name: participant.name,
          participantId: participant.participantId,
          sessionId: session.id,
        },
      });
      // adding the timelog
      await prisma.timelog.create({
        data: {
          start: new Date().toISOString(),
          Participant: { connect: { id: newParticipant.id } },
        },
      });

      if (isUniqueParticipant) {
        await prisma.session.update({
          where: { id: session.id },
          data: {
            uniqueParticipantsCount: session.uniqueParticipantsCount + 1,
          },
        });
      }
      return res
        .status(HTTP_STATUS.CREATED)
        .json({ status: true, data: newParticipant });
    } catch (error) {
      console.log("error ", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }
  async removeParticipantFromSession(req: Request, res: Response) {
    try {
      // Fetch the participant along with their timelog
      const participant = await prisma.participant.findUnique({
        where: {
          id: req.body.id,
        },
        include: {
          timelog: true, // Include timelog array
        },
      });

      if (!participant || participant.timelog.length === 0) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
          status: false,
          message: "Participant or Timelog not found.",
        });
      }

      // Get the last timelog
      const lastTimelog = participant.timelog[participant.timelog.length - 1];

      // Update the end date of the last timelog
      await prisma.timelog.update({
        where: {
          id: lastTimelog.id, // Reference the ID of the last timelog
        },
        data: {
          end: new Date(), // Set the new end date
        },
      });

      // Fetch the updated participant with the latest timelog
      const updatedParticipant = await prisma.participant.findUnique({
        where: {
          id: req.body.id,
        },
        include: {
          timelog: true,
          events: {
            select: {
              errors: true,
              mic: true,
              screenShare: true,
              screenShareAudio: true,
              webcam: true,
            },
          },
        },
      });

      return res.status(HTTP_STATUS.OK).json({
        status: true,
        data: updatedParticipant,
      });
    } catch (error) {
      console.error("Error:", error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }
}

export const sessionController = new SessionController();
