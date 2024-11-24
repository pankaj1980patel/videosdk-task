import { fetcher } from "@/api/apiConfig";
import {
  AllMeetingSessionResponse,
  MeetingDetailsResponse,
} from "@/api/session/types";
import { buildQueryString } from "@/util/api";

export const getSessions = async (
  data: {
    page?: string | number;
    limit?: string | number;
  } = {}
) => {
  const response = await fetcher<AllMeetingSessionResponse>({
    url: `/session?${buildQueryString(data)}`,
  });
  return response;
};

export const getSessionDetailsById = async (meetingId: string) => {
  const response = await fetcher<MeetingDetailsResponse>({
    url: `/session/${meetingId}`,
  });
  return response;
};
