import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string; // The base path for links, e.g. "/sessions"
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  basePath,
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      {/* Previous Page Link */}
      <Link href={`${basePath}?page=${Math.max(currentPage - 1, 1)}`} passHref>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </Link>

      {/* Page Numbers */}
      <span className="text-white">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Page Link */}
      <Link
        href={`${basePath}?page=${Math.min(currentPage + 1, totalPages)}`}
        className="cursor-pointer"
      >
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded "
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </Link>
    </div>
  );
};

export default Pagination;
