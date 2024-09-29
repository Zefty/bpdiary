import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/app/_components/shadcn/pagination";

export function PaginationDiary({
  currentPage = 1,
  maxPages = 1,
}: {
  currentPage?: number;
  maxPages?: number;
}) {
  const showLeftEllipsis = currentPage > 2;
  const showRightEllipsis = maxPages > currentPage && maxPages > 3;
  const prevPage = currentPage > 1 ? currentPage - 1 : 1;
  const nextPage = currentPage === maxPages ? maxPages : currentPage + 1;
  const showSecondPaginationLink = maxPages > 1;
  const showThirdPaginationLink = maxPages > 2;

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`/diary/history?page=${prevPage}`} />
        </PaginationItem>
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink
            href={`/diary/history?page=${currentPage}`}
            isActive={currentPage === 1}
          >
            {currentPage > 1 ? currentPage - 1 : 1}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          {showSecondPaginationLink && (
            <PaginationLink
              href={`/diary/history?page=${currentPage > 1 ? currentPage : 2}`}
              isActive={currentPage !== 1}
            >
              {currentPage > 1 ? currentPage : 2}
            </PaginationLink>
          )}
        </PaginationItem>
        <PaginationItem>
          {showThirdPaginationLink && (
            <PaginationLink
              href={`/diary/history?page=${currentPage > 1 ? currentPage + 1 : 3}`}
            >
              {currentPage > 1 ? currentPage + 1 : 3}
            </PaginationLink>
          )}
        </PaginationItem>
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext href={`/diary/history?page=${nextPage}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
