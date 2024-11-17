import { axiosInstance } from "@/lib/axios";
import { Room } from "@/types";
import { create } from "zustand";

interface UserStore {
  fetchJoinedRooms: () => Promise<void>;
  rooms:Room[]
  isLoading:boolean,
}

const useUserStore = create<UserStore>((set, get) => ({
    isLoading:true,
    rooms:[],
    fetchJoinedRooms: async ()=>{
        
        try {
            const response = await axiosInstance.get("/user/getJoinedRooms");
            set({rooms:response.data.rooms});
        } catch (error:any) {
            console.log(error.response.data.messages);
            console.log(error)
        }finally{
            set({isLoading:false});
        }
    }
}));

export default useUserStore;