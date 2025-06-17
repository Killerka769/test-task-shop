import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { TPostProduct } from "../Types/Types";


const usePostProducts = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, isSuccess, isError } = useMutation({
        mutationFn: (el : TPostProduct)=>{
            return axios.post('/api/order', el);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    })

    
  return { mutatePostProduct : mutate, isPendingPostProduct : isPending, isSuccessPostProduct : isSuccess, 
   isErrorPostProduct : isError }
}

export default usePostProducts