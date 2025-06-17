import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { TPostProduct } from "../Types/Types";


const usePostProducts = () => {
    const { mutate, isPending, isSuccess, isError } = useMutation({
        mutationFn: (el : TPostProduct)=>{
            return axios.post('http://o-complex.com:1337/order', el);
        }
    })
    // onSuccess: () => {
    //     queryClient.invalidateQueries(['products']);
    // }
  return { mutatePostProduct : mutate, isPendingPostProduct : isPending, isSuccessPostProduct : isSuccess, 
   isErrorPostProduct : isError }
}

export default usePostProducts