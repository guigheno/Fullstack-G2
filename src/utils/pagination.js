function parseIntOr(value, fallback) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function getPagingAndSorting(query = {}, { defaultPageSize = 10, maxPageSize = 100, allowedSortBy = [] } = {}) {
  const page = Math.max(1, parseIntOr(query.page, 1));
  const pageSize = Math.min(maxPageSize, Math.max(1, parseIntOr(query.pageSize, defaultPageSize)));
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  let orderBy;
  if (query.sortBy && allowedSortBy.includes(query.sortBy)) {
    const sort = (query.sort || 'asc').toLowerCase() === 'desc' ? 'desc' : 'asc';
    orderBy = { [query.sortBy]: sort };
  }

  return { page, pageSize, skip, take, orderBy };
}

module.exports = { getPagingAndSorting };
