import { getSessions } from "@/api/session/session";
import Pagination from "@/components/Table/TablePagination";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Link from "next/link";

type searchParams = Promise<{
  page?: string;
  limit?: string;
}>;

export default async function Home({
  searchParams,
}: {
  searchParams: searchParams;
}) {
  const { limit, page } = await searchParams;
  const allSessions = await getSessions({
    page: page ? (parseInt(page) > 0 ? parseInt(page) : 1) : 1,
    limit: limit ? (parseInt(limit) > 0 ? parseInt(limit) : 10) : 10,
  });

  return (
    <div className="bg-[#181818] text-white h-full px-10">
      <h1 className="font-bold text-2xl py-8">All sessions</h1>
      <div className="min-h-[70vh]">
        <Table>
          <TableHeader className="text-blue-500">
            <TableRow className="text-blue-500">
              <TableHead className="text-blue-500">Meeting Id</TableHead>
              <TableHead className="text-blue-500">Start Time</TableHead>
              <TableHead className="text-blue-500">End Time</TableHead>
              <TableHead className="text-center text-blue-500">
                Unique Participants
              </TableHead>
              <TableHead className="text-center text-blue-500">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* Conditional rendering for data */}
          <TableBody>
            {allSessions.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              allSessions.data.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-medium">
                    {session.meetingId}
                  </TableCell>
                  <TableCell>
                    {format(session.start, "dd MMMM yyyy, HH:mm")}
                  </TableCell>
                  <TableCell>
                    {session.end
                      ? format(session.end, "dd MMMM yyyy, HH:mm")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    {session.uniqueParticipantsCount}
                  </TableCell>
                  <TableCell className="text-center">
                    <Link href={`/${session.id}`}>View</Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {allSessions.data.length > 0 && (
        <Pagination
          currentPage={allSessions.meta.page}
          totalPages={allSessions.meta.totalPages}
          basePath={"/"}
        />
      )}
    </div>
  );
}
