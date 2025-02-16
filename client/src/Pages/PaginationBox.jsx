/* eslint-disable react/prop-types */
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination";
  
  const PaginationBox = ({ pageNo, totalPages, handlePageChange }) => {
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              disabled={pageNo <= 1}
              onClick={(e) => {
                e.preventDefault();
                if (pageNo > 1) handlePageChange(pageNo - 1);
              }}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                href="#"
                active={pageNo === index + 1}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(index + 1);
                }}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          {totalPages > 5 && <PaginationEllipsis />}
          <PaginationItem>
            <PaginationNext
              href="#"
              disabled={pageNo >= totalPages}
              onClick={(e) => {
                e.preventDefault();
                if (pageNo < totalPages) handlePageChange(pageNo + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };
  
  export default PaginationBox;
  