export type PaginationItem =
  | {
      kind: 'page';
      page: number;
    }
  | {
      kind: 'ellipsis';
      id: string;
    };

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

export function getTotalPages(totalItems: number, pageSize: number) {
  const safePageSize = Math.max(1, pageSize);
  return Math.max(1, Math.ceil(Math.max(0, totalItems) / safePageSize));
}

export function buildPaginationItems(options: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
  boundaryCount?: number;
}): PaginationItem[] {
  const totalPages = Math.max(1, options.totalPages);
  const currentPage = Math.min(Math.max(1, options.currentPage), totalPages);
  const siblingCount = Math.max(0, options.siblingCount ?? 1);
  const boundaryCount = Math.max(0, options.boundaryCount ?? 1);

  const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3;
  if (totalPages <= totalNumbers) {
    return range(1, totalPages).map((page) => ({
      kind: 'page' as const,
      page,
    }));
  }

  const startPages = range(1, boundaryCount);
  const endPages = range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);

  const siblingsStart = Math.max(
    Math.min(currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2
  );
  const siblingsEnd = Math.min(
    Math.max(currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages[0]! - 2
  );

  const items: PaginationItem[] = [];

  for (const page of startPages) {
    items.push({ kind: 'page', page });
  }

  if (siblingsStart > boundaryCount + 2) {
    items.push({ kind: 'ellipsis', id: 'start-ellipsis' });
  } else if (boundaryCount + 1 < totalPages - boundaryCount) {
    items.push({ kind: 'page', page: boundaryCount + 1 });
  }

  for (const page of range(siblingsStart, siblingsEnd)) {
    items.push({ kind: 'page', page });
  }

  if (siblingsEnd < totalPages - boundaryCount - 1) {
    items.push({ kind: 'ellipsis', id: 'end-ellipsis' });
  } else if (totalPages - boundaryCount > boundaryCount) {
    items.push({ kind: 'page', page: totalPages - boundaryCount });
  }

  for (const page of endPages) {
    if (!items.some((item) => item.kind === 'page' && item.page === page)) {
      items.push({ kind: 'page', page });
    }
  }

  return items;
}
