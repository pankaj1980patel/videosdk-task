import e, { Request, Response } from "express";
import { prisma } from "@/prisma";
import { HTTP_STATUS } from "@/globals/constants/http";
import { EVENT_TYPE } from "@/features/event/constant/eventType";

class EventController {
  async getAllParticipants(req: Request, res: Response) {
    const participants = await prisma.participant.findMany();
    return res.status(HTTP_STATUS.OK).json(participants);
  }

  async addStartEvent(req: Request, res: Response) {
    try {
      const participantId: string = req.body.participantId;
      const eventData = req.body.eventType;
      // Step 1: Check if the participant exists
      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
        include: {
          events: true,
        },
      });
      if (!participant) {
        throw new Error("Participant not found");
      }
      let eventId = "";
      if (!participant.events) {
        const event = await prisma.event.create({
          data: {
            Participant: {
              connect: { id: participant.id },
            },
          },
        });
        eventId = event.id;
      } else {
        eventId = participant.events.id;
      }

      switch (eventData) {
        case EVENT_TYPE.MIC:
          await prisma.micEvent.create({
            data: {
              start: new Date(),
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;

        case EVENT_TYPE.WEBCAM:
          await prisma.webcamEvent.create({
            data: {
              start: new Date(),
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;

        case EVENT_TYPE.ERROR:
          await prisma.errorEvent.create({
            data: {
              start: new Date(),
              message: req.body.message,
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;

        case EVENT_TYPE.SCREEN_SHARE:
          await prisma.screenShare.create({
            data: {
              start: new Date(),
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;
        case EVENT_TYPE.SCREEN_SHARE_AUDIO:
          await prisma.screenShareAudio.create({
            data: {
              start: new Date(),
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;
      }

      return res.status(HTTP_STATUS.OK).json({ status: true });
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }

  async addEndEvent(req: Request, res: Response) {
    try {
      const participantId: string = req.body.participantId;
      const eventData = req.body.eventType;
      // Step 1: Check if the participant exists
      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
        include: {
          events: {
            include: {
              mic: true,
              webcam: true,
              errors: true,
              screenShare: true,
              screenShareAudio: true,
            },
          },
        },
      });
      if (!participant || !participant.events) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ status: false, message: "Participant or Event not found." });
      }
      switch (eventData) {
        case EVENT_TYPE.MIC:
          const lastMicEvent =
            participant.events.mic[participant.events.mic.length - 1];
          await prisma.micEvent.update({
            where: {
              id: lastMicEvent.id,
            },
            data: {
              end: new Date(),
            },
          });

          break;

        case EVENT_TYPE.WEBCAM:
          const lastWebcamEvent =
            participant.events.webcam[participant.events.webcam.length - 1];
          await prisma.webcamEvent.update({
            where: {
              id: lastWebcamEvent.id,
            },
            data: {
              end: new Date(),
            },
          });
          break;

        case EVENT_TYPE.SCREEN_SHARE:
          const lastScreenShareEvent =
            participant.events.screenShare[
              participant.events.screenShare.length - 1
            ];
          await prisma.screenShare.update({
            where: {
              id: lastScreenShareEvent.id,
            },
            data: {
              end: new Date(),
            },
          });
          break;
        case EVENT_TYPE.SCREEN_SHARE_AUDIO:
          const lastScreenShareAudioEvent =
            participant.events.screenShareAudio[
              participant.events.screenShareAudio.length - 1
            ];
          await prisma.screenShareAudio.update({
            where: {
              id: lastScreenShareAudioEvent.id,
            },
            data: {
              end: new Date(),
            },
          });
          break;
        default:
          break;
      }
      return res.status(HTTP_STATUS.OK).json({ status: true });
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }

  async addEvent(req: Request, res: Response) {
    try {
      const participantId: string = req.body.participantId;
      const eventData = req.body.eventData;
      // Step 1: Check if the participant exists
      const participant = await prisma.participant.findUnique({
        where: { id: participantId },
        include: {
          events: {
            select: { id: true },
          },
        },
      });
      if (!participant) {
        return res
          .status(HTTP_STATUS.NOT_FOUND)
          .json({ status: false, message: "Participant not found." });
      }
      let eventId = "";
      if (!participant.events) {
        const event = await prisma.event.create({
          data: {
            Participant: {
              connect: { id: participant.id },
            },
          },
        });
        eventId = event.id;
      } else {
        eventId = participant.events.id;
      }

      switch (eventData.type) {
        case EVENT_TYPE.MIC:
          await prisma.micEvent.create({
            data: {
              start: eventData.start,
              end: eventData.end,
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;
        case EVENT_TYPE.WEBCAM:
          await prisma.webcamEvent.create({
            data: {
              start: eventData.start,
              end: eventData.end,
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;
        case EVENT_TYPE.SCREEN_SHARE:
          await prisma.screenShare.create({
            data: {
              start: eventData.start,
              end: eventData.end,
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;
        case EVENT_TYPE.SCREEN_SHARE_AUDIO:
          await prisma.screenShareAudio.create({
            data: {
              start: eventData.start,
              end: eventData.end,
              Event: {
                connect: { id: eventId },
              },
            },
          });
          break;
        case EVENT_TYPE.ERROR:
          await prisma.errorEvent.create({
            data: {
              start: eventData.start,
              message: eventData.message,
              Event: {
                connect: { id: eventId },
              },
            },
          });
        default:
          break;
      }
      return res.status(HTTP_STATUS.OK).json({ status: true });
    } catch (error) {
      console.log(error);
      return res
        .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
        .json({ status: false });
    }
  }
}

export const eventController = new EventController();
