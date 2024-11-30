import { useEffect, useState } from "react";

const useDebounceSearch = (query: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(query);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedValue(query);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [query, delay]);

  return debouncedValue;
};

export default useDebounceSearch;
