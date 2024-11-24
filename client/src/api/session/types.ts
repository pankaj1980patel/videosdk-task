import { ISOStringFormat } from "date-fns";

// /api/v1/session
export type AllMeetingSessionResponse = {
  status: boolean;
  data: MeetingSession[];
  meta: Meta;
};

export type MeetingSession = {
  id: string;
  meetingId: string;
  start: ISOStringFormat;
  end: ISOStringFormat | null;
  uniqueParticipantsCount: number;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

// /api/v1/session/:id

export type MeetingDetailsResponse = {
  status: boolean;
  data: MeetingDetailData;
};

export type MeetingDetailData = {
  id: string;
  meetingId: string;
  start: string;
  end: string;
  uniqueParticipantsCount: number;
  participants: Participant[];
};

export type Participant = {
  id: string;
  name: string;
  participantId: string;
  sessionId: string;
  events: Events | null;
  timelog: Timelog[];
};

export type Events = {
  errors: ErrorLog[];
  mic: Timelog[];
  screenShare: Timelog[];
  screenShareAudio: Timelog[];
  webcam: Timelog[];
};

export type ErrorLog = {
  id: string;
  start: string;
  message: string;
};

export type Timelog = {
  id: string;
  start: string;
  end: string | null;
  eventId?: string;
  participantId?: string;
};
