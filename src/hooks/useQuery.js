/**
 *
 * @param {string} params
 * @returns {object}
 */
const useQuery = params => {
  const searchParams = {};
  const urlSearchParams = new URLSearchParams(params);
  for (const [key, value] of urlSearchParams) {
    switch (value) {
      case 'undefined':
      case 'null':
      case 'NaN':
        break;
      default:
        if (!Number.isNaN(Number(value))) {
          searchParams[key] = Number(value);
          break;
        }
        searchParams[key] = value;
        break;
    }
  }
  return searchParams;
};
export default useQuery;
