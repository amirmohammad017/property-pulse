import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  pathname: string;
  query?: Record<string, string>;
  pageParam?: string;
};

export default function Pagination({
  currentPage,
  totalPages,
  pathname,
  query = {},
  pageParam = "page",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const linkForPage = (page: number) => {
    const params = new URLSearchParams(query);
    params.set(pageParam, String(page));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex justify-center items-center gap-4 my-8"
    >
      {currentPage > 1 && (
        <Link
          href={linkForPage(currentPage - 1)}
          className="rounded border px-4 py-2 hover:bg-gray-100"
        >
          Previous
        </Link>
      )}
      <span>
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Link
          href={linkForPage(currentPage + 1)}
          className="rounded border px-4 py-2 hover:bg-gray-100"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
