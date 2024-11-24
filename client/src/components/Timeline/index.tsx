import React from "react";
import {
  addSeconds,
  differenceInMinutes,
  differenceInSeconds,
  format,
} from "date-fns";
import { preprocessData } from "@/util/datetime";
import { cn } from "@/lib/utils";
import TimelineHeader from "./TimelineHeader";
import {
  CircleAlert,
  LogOut,
  Mic,
  MicOff,
  Monitor,
  MonitorOff,
  SquareArrowDown,
  SquareArrowUp,
  SquareArrowUpIcon,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { MeetingDetailData } from "@/api/session/types";
interface TimelineProps {
  data: MeetingDetailData;
  intervalGapSeconds?: number;
}
const ICON_SET = {
  mic: Mic,
  webcam: Monitor,
  screenShare: SquareArrowUp,
  screenShareAudio: SquareArrowUpIcon,
  error: CircleAlert,
};
const ICON_SET_OFF = {
  mic: MicOff,
  webcam: MonitorOff,
  screenShare: SquareArrowDown,
  screenShareAudio: SquareArrowDown,
  error: CircleAlert,
};
const Timeline: React.FC<TimelineProps> = ({ data }) => {
  const { meetingStart, meetingEnd, totalDuration, participants } =
    preprocessData(data);
  const normalizedMeetingStart = new Date(
    new Date(meetingStart).setSeconds(0, 0)
  );
  const totalDurationSeconds = differenceInSeconds(
    new Date(meetingEnd),
    normalizedMeetingStart
  );
  // Divide the total duration into 12 equal intervals.
  const intervalGapSeconds = Math.ceil(totalDurationSeconds / 12); // Ensure the gap includes any remainder.

  const intervals: Date[] = [];
  let current = normalizedMeetingStart;

  while (current <= meetingEnd) {
    intervals.push(current);
    current = addSeconds(current, intervalGapSeconds);
  }

  // Ensure the last interval includes `meetingEnd`.
  if (intervals[intervals.length - 1] < meetingEnd) {
    intervals.push(meetingEnd);
  }

  const getPercentage = (start: Date, end: Date): number => {
    const duration = differenceInSeconds(end, start);
    return (
      (duration /
        differenceInSeconds(intervals[intervals.length - 1], intervals[0])) *
      100
    );
  };

  return (
    <div className="h-full w-full overflow-y-clip">
      <TimelineHeader />
      <div className="">
        <div className="">
          <div className="w-full p-4 px-[22px] text-[#666666] text-sm font-bold flex text-center justify-between">
            {intervals.map((time, i) => (
              <div key={i} className="relative ">
                <span className="flex-grow">
                  {time.toISOString().substring(11, 16)}
                </span>
                <div className="h-screen absolute border-l border-[#393939] left-1/2 top-9"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Participants Container */}
        <ScrollArea className="h-[calc(100vh-105px)]">
          <div className="">
            {participants.map((participant, index) => (
              <div
                key={participant.participantId}
                className={cn(
                  "relative items-center py-4 px-[23px] border-t border-[#393939]"
                )}
              >
                {/* Participant Name */}
                <div className="text-white py-[10px] w-fit bg-[#181818]">
                  <div className="font-semibold">
                    <span className="capitalize">{participant.name}</span> (
                    {participant.participantId})
                  </div>
                  <div className="text-sm opacity-75">
                    {participant.events.length > 0 &&
                      format(
                        participant.events[0].start,
                        "dd MMMM yyyy, HH:mm"
                      )}{" "}
                    | Duration{" "}
                    {differenceInMinutes(
                      participant.timelog[participant.timelog.length - 1].end,
                      participant.timelog[0].start
                    )}{" "}
                    Mins
                  </div>
                </div>

                {/* Events Container */}
                <div className="relative flex-1 w-[calc(100%-36px)] mx-auto h-4 mt-4 mb-1">
                  {/* Timeline  */}
                  {participant.timelog.map((event, idx) => (
                    <React.Fragment key={idx}>
                      <div
                        key={idx}
                        className={`absolute bg-[#777777] top-0 h-1`}
                        style={{
                          left: `${(
                            (differenceInSeconds(
                              event.start,
                              normalizedMeetingStart
                            ) /
                              differenceInSeconds(
                                intervals[intervals.length - 1],
                                normalizedMeetingStart
                              )) *
                            100
                          ).toFixed(2)}%`,
                          width: `${getPercentage(event.start, event.end)}%`,
                        }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Monitor
                                color="white"
                                className="bg-[#777777] rounded-[9px] -translate-y-1/2 p-1"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {event.start.toISOString().substring(11, 16)}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <LogOut
                              color="white"
                              className="bg-[#777777] absolute rounded-[9px] top-0 -translate-y-1/2 p-1"
                              style={{
                                left: `${(
                                  (differenceInSeconds(
                                    event.end,
                                    normalizedMeetingStart
                                  ) /
                                    differenceInSeconds(
                                      intervals[intervals.length - 1],
                                      normalizedMeetingStart
                                    )) *
                                  100
                                ).toFixed(2)}%`,
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{event.end.toISOString().substring(11, 16)}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </React.Fragment>
                  ))}
                  {/* Evemts  */}
                  {participant.events.map((event, idx) => {
                    const EventIcon =
                      ICON_SET[event.type as keyof typeof ICON_SET];
                    const EventIconOff =
                      ICON_SET_OFF[event.type as keyof typeof ICON_SET_OFF];
                    return (
                      <React.Fragment key={idx}>
                        <div
                          className={`absolute bg-[#5568FE] top-0 h-1`}
                          style={{
                            left: `${(
                              (differenceInSeconds(
                                event.start,
                                normalizedMeetingStart
                              ) /
                                differenceInSeconds(
                                  intervals[intervals.length - 1],
                                  normalizedMeetingStart
                                )) *
                              100
                            ).toFixed(2)}%`,
                            width: `${getPercentage(event.start, event.end)}%`,
                          }}
                        >
                          {event.overlapCount > 0 ? (
                            <div className="relative w-[22px] h-[27px] -translate-y-1/2">
                              <div className="absolute top-0 left-0 right-0  rounded-[7px] mx-auto bg-[#D1D1D1] w-[18px] h-[27px]"></div>
                              <div className="absolute top-0 left-0 right-0 z-[1] rounded-[7px] mx-auto bg-white  w-[20px] h-[25px]"></div>
                              <div className="absolute top-0 left-0 right-0 z-[2] rounded-[7px] bg-[#5568FE] w-[22px]  h-[22px] text-white flex justify-center items-center">
                                {event.overlapCount}
                              </div>
                            </div>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <EventIcon
                                    color="white"
                                    className="bg-[#5568FE] rounded-[9px] -translate-y-1/2 p-1"
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {event.overlapCount}
                                    {event.start
                                      .toISOString()
                                      .substring(11, 16)}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>{" "}
                        {/* End Icon */}
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <EventIconOff
                                color="white"
                                className="bg-[#5568FE] z-[2] absolute rounded-[9px] top-0 -translate-y-1/2 p-1"
                                style={{
                                  left: `${(
                                    (differenceInSeconds(
                                      event.end,
                                      intervals[0]
                                    ) /
                                      differenceInSeconds(
                                        intervals[intervals.length - 1],
                                        intervals[0]
                                      )) *
                                    100
                                  ).toFixed(2)}%`,
                                }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{event.end.toISOString().substring(11, 16)}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </React.Fragment>
                    );
                  })}
                  {/* Error Events */}
                  {participant.errorEvents.map((event, idx) => {
                    return (
                      <div
                        key={idx}
                        className={`absolute top-0 h-1`}
                        style={{
                          left: `${(
                            (differenceInSeconds(
                              event.start,
                              normalizedMeetingStart
                            ) /
                              differenceInSeconds(
                                intervals[intervals.length - 1],
                                normalizedMeetingStart
                              )) *
                            100
                          ).toFixed(2)}%`,
                        }}
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CircleAlert
                                color="white"
                                className="bg-[#F17676E5] rounded-[5px] -translate-y-1/2 p-[2px]"
                                size={14}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{event.message}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default Timeline;
