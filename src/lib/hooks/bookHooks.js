import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { fetchTrendingBooks, fetchSearchBooks } from "../api/openLibrary";

export const useTrendingBooks = ( timeframe ) => {
  return useQuery({
    queryKey: ["trendingBooks", { timeframe }],
    queryFn: () => fetchTrendingBooks(timeframe),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    refetchOnWindowFocus: false,
  });
};

export const useSearchBooks = (query, pageSize = 20) => {
  return useInfiniteQuery({
    queryKey: ['searchBooks', query],
    queryFn: ({ pageParam = 0 }) => fetchSearchBooks({
      query,
      limit: pageSize,
      offset: pageParam
    }),
    getNextPageParam: (lastPage, allPages) => 
      lastPage.length === pageSize ? allPages.length * pageSize : undefined,
    enabled: !!query,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};