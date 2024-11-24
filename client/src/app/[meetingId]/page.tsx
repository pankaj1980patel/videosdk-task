import { getSessionDetailsById, getSessions } from "@/api/session/session";
import Timeline from "@/components/Timeline";
import Image from "next/image";

type Params = Promise<{ meetingId: string }>;

export default async function Home({ params }: { params: Params }) {
  const { meetingId } = await params;
  const allSessions = await getSessionDetailsById(meetingId);
  if (!allSessions.status) {
    return (
      <div className="bg-[#181818] h-full text-white flex items-center justify-center">
        <h1 className="font-bold text-2xl py-8">Session not found</h1>
      </div>
    );
  }
  return (
    <div className="bg-[#181818] h-full">
      <Timeline data={allSessions.data} />
    </div>
  );
}
