import { useLocation } from "react-router-dom";

const useQuery = () => {
  const searchParams = {};
  const urlSearchParams = new URLSearchParams(useLocation().search);
  for (const [key, value] of urlSearchParams) {
    searchParams[key] = value;
  }
  return searchParams;
};
export default useQuery;
