"use client";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type PaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  // New optional props for enhanced features
  totalCount?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (pageSize: number) => void;
  showPageSizeSelector?: boolean;
  showTotalCount?: boolean;
};

const TablePaginationComponent = ({
  page,
  pageCount,
  onPageChange,
  // Optional props with defaults
  totalCount,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  showPageSizeSelector = false,
  showTotalCount = false,
}: PaginationProps) => {
  // Calculate the range of items being displayed (only if totalCount is provided)
  const startItem = totalCount ? (page - 1) * pageSize + 1 : null;
  const endItem = totalCount ? Math.min(page * pageSize, totalCount) : null;

  // Determine if we should show enhanced features
  const hasEnhancedFeatures =
    totalCount !== undefined && onPageSizeChange !== undefined;
  const shouldShowPageSizeSelector =
    showPageSizeSelector && hasEnhancedFeatures;
  const shouldShowTotalCount = showTotalCount && totalCount !== undefined;

  // Show pagination controls only when there are multiple pages
  const shouldShowPaginationControls = pageCount > 1;

  // Show the component if there are enhanced features OR multiple pages
  const shouldShowComponent =
    shouldShowPageSizeSelector ||
    shouldShowTotalCount ||
    shouldShowPaginationControls;

  // Don't render anything if there's no data and no enhanced features
  if (!shouldShowComponent && totalCount === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-black">
      {/* Left side - Enhanced features (show if enabled and data available) */}
      {(shouldShowPageSizeSelector || shouldShowTotalCount) && (
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Page size selector */}
          {shouldShowPageSizeSelector && (
            <div className="flex items-center gap-2 text-sm md:text-sm">
              Show per page:
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                className="flex justify-between items-center p-1.5 border font-medium border-[var(--primaryColor)]/[0.05] rounded bg-[var(--primaryColor)]/[0.05] focus:outline-none hover:bg-[var(--primaryColor)]/[0.1] transition-colors"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {shouldShowTotalCount && totalCount !== undefined && (
                <div className="text-xs md:text-sm">
                  {totalCount > 0 && startItem && endItem ? (
                    <>
                      Showing {startItem} to {endItem} of{" "}
                      {totalCount.toLocaleString()} entries
                    </>
                  ) : totalCount === 0 ? (
                    "No entries found"
                  ) : (
                    `Total: ${totalCount.toLocaleString()} entries`
                  )}
                </div>
              )}
            </div>
          )}

          {/* Total count and current range */}
        </div>
      )}

      {/* Right side - Pagination controls (only show when multiple pages) */}
      {shouldShowPaginationControls && (
        <div className="flex items-center gap-2  text-sm">
          {/* First page */}
          <button
            className={`p-1.5 border font-medium border-[var(--PrimaryColor)]/[0.05] rounded bg-[var(--PrimaryColor)]/[0.05] focus:outline-none hover:bg-[var(--PrimaryColor)]/[0.1] transition-colors cursor-pointer ${
              page === 1 && "opacity-50 pointer-events-none cursor-not-allowed"
            }`}
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            title="First page"
          >
            <ChevronsLeft className="h-5 w-5 " />
          </button>

          {/* Previous page */}
          <button
            className={`p-1.5 border font-medium border-[var(--PrimaryColor)]/[0.05] rounded bg-[var(--PrimaryColor)]/[0.05] focus:outline-none hover:bg-[var(--PrimaryColor)]/[0.1] transition-colors cursor-pointer ${
              page === 1 && "opacity-50 pointer-events-none cursor-not-allowed"
            }`}
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            title="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          {/* Page info */}
          <span className="py-1">
            Page {page} of {pageCount}
          </span>

          {/* Next page */}
          <button
            className={`p-1.5 border font-medium border-[var(--PrimaryColor)]/[0.05] rounded bg-[var(--PrimaryColor)]/[0.05] focus:outline-none hover:bg-[var(--PrimaryColor)]/[0.1] transition-colors cursor-pointer ${
              page >= pageCount &&
              "opacity-50 pointer-events-none cursor-not-allowed"
            }`}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
            title="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Last page */}
          <button
            className={`p-1.5 border font-medium border-[var(--PrimaryColor)]/[0.05] rounded bg-[var(--PrimaryColor)]/[0.05] focus:outline-none hover:bg-[var(--PrimaryColor)]/[0.1] transition-colors cursor-pointer ${
              page >= pageCount &&
              "opacity-50 pointer-events-none cursor-not-allowed"
            }`}
            onClick={() => onPageChange(pageCount)}
            disabled={page >= pageCount}
            title="Last page"
          >
            <ChevronsRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* If only enhanced features are shown (single page), show a simple page indicator */}
      {!shouldShowPaginationControls &&
        (shouldShowPageSizeSelector || shouldShowTotalCount) &&
        pageCount === 1 && <div className="text-sm">Page 1 of 1</div>}
    </div>
  );
};

export default TablePaginationComponent;
