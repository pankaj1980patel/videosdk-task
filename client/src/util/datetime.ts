import { MeetingDetailData } from "@/api/session/types";
import { parseISO, differenceInSeconds } from "date-fns";

type PreprocessedData = {
  meetingStart: Date;
  meetingEnd: Date;
  totalDuration: number;
  participants: {
    participantId: string;
    name: string;
    events: {
      type: string;
      start: Date;
      end: Date;
      overlapCount: number;
    }[];
    timelog: {
      start: Date;
      end: Date;
    }[];
    errorEvents: {
      start: Date;
      message: string;
    }[];
  }[];
};

export const preprocessData = (data: MeetingDetailData): PreprocessedData => {
  const meetingStart = parseISO(data.start);
  const meetingEnd = data.end ? parseISO(data.end) : parseISO(data.start);
  const totalDuration = differenceInSeconds(meetingEnd, meetingStart);

  const participants = data.participants.map((participant) => {
    let participantEvents = participant.events
      ? {
          mic: participant.events.mic,
          webcam: participant.events.webcam,
          screenShare: participant.events.screenShare,
          screenShareAudio: participant.events.screenShareAudio,
        }
      : {
          mic: [],
          webcam: [],
          screenShare: [],
          screenShareAudio: [],
        };
    let events = Object.entries(participantEvents).flatMap(
      ([type, intervals]) =>
        intervals?.map((interval) => ({
          type,
          start: parseISO(interval.start),
          end: interval.end ? parseISO(interval.end) : parseISO(interval.start),
        })) || []
    );

    // Sort events by start time
    events = events.sort((a, b) => a.start.getTime() - b.start.getTime());

    const errorEvents = participant?.events
      ? participant?.events.errors?.map((interval) => ({
          start: parseISO(interval.start),
          message: interval.message,
        }))
      : [];
    // Calculate overlaps with the ±10 seconds condition
    const eventsWithOverlap = events.map((event, _, allEvents) => {
      const overlapCount = allEvents.filter((otherEvent) => {
        if (otherEvent === event) return false; // Exclude the current event

        const startDiff = Math.abs(
          differenceInSeconds(event.start, otherEvent.start)
        );
        const endDiff = Math.abs(
          differenceInSeconds(event.start, otherEvent.end)
        );

        return startDiff <= 10 || endDiff <= 10; // Overlap if within ±10 seconds
      }).length;

      return {
        ...event,
        overlapCount, // Add overlap count
      };
    });

    const timelog = participant.timelog.map((interval) => ({
      start: parseISO(interval.start),
      end: interval.end ? parseISO(interval.end) : parseISO(interval.start),
    }));

    return {
      participantId: participant.participantId,
      name: participant.name,
      events: eventsWithOverlap,
      timelog,
      errorEvents: errorEvents || [],
    };
  });

  return { meetingStart, meetingEnd, totalDuration, participants };
};
