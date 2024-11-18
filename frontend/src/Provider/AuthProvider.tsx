import { axiosInstance } from "@/lib/axios";
import { useAuth } from "@clerk/clerk-react"
import { Loader } from "lucide-react";
import React, {  useEffect, useState } from "react";

    const updateAxiosHeader = async (token:String | null)=>{
        console.log(axiosInstance.defaults.headers)
        if(token){
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }else{
            delete axiosInstance.defaults.headers.common['Authorization'];
        }

    }

const AuthProvider = ({children}:{children:React.ReactNode}) => {
    const {getToken} = useAuth();
    const [isLoading,setIsLoading] = useState(true);
 


    useEffect(()=>{
     const initAuth = async()=>{
        try {
            const token = await getToken();
            updateAxiosHeader(token);
        } catch (error:any) {
            console.log("Error in authProvider",error)
            updateAxiosHeader(null);
        }finally{
            setIsLoading(false);
        }
        
        setIsLoading(false)
    }
    initAuth();   
    },[getToken])
    
    if(isLoading) return(
        <div className="h-screen w-full flex justify-center items-center">
            <Loader className="animate-spin size-8 text-green-500"  />

        </div>
    )
    return (
        <>
        {children}
        </>
    )
}

export default AuthProvider