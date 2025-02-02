export function getPaginationParams(query) {
  const size = 20;
  let page = parseInt(query.page) || 1;

  if (page < 1) page = 1;

  const offset = (page - 1) * size;

  return { size, offset };
}