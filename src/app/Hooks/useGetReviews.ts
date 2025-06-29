import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { TReviews } from "../Types/Types";

const useGetReviews = () => {
    const { data, isLoading, isError } = useQuery<TReviews[]>({
        queryKey: ['reviews'],  
        queryFn: async ()=>{
            const response = await axios.get('/api/reviews');
            return response.data
        }
    })
  return { dataReviews : data, loadingReviews : isLoading, errorReviews : isError }
}

export default useGetReviews