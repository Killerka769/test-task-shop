import { useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import { TProducts } from "../Types/Types";

const fetchProducts = async ({ pageParam = 1 }: QueryFunctionContext) => {
  const response = await axios.get(`/api/products?page=${pageParam}&page_size=20`);
  return response.data as TProducts;
};

const useGetProducts = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery<TProducts>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const maxPages = Math.ceil(lastPage.total / 20);
      const nextPage = allPages.length + 1;
      return nextPage <= maxPages ? nextPage : undefined;
    },
    refetchOnWindowFocus: false,
  });

  return {
    dataProducts: data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    loadingProducts: isLoading,
    errorProducts: isError,
  };
};

export default useGetProducts;
