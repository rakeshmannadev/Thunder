import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import useUserStore from "./useUserStore";
import toast from "react-hot-toast";

interface AuthStore {
  signup: (authData: object) => Promise<void>;
  login: (authData: object) => Promise<void>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthStore>(() => ({
  signup: async (authData) => {
    try {
      useUserStore.setState({ isLoading: true });
      const response = await axiosInstance.post("/auth/signup", {
        ...authData,
      });
      if (response.data.status) {
        useUserStore.setState({ currentUser: response.data.user });
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      useUserStore.setState({ isLoading: false });
    }
  },
  login: async (authData) => {
    try {
      useUserStore.setState({ isLoading: true });
      const response = await axiosInstance.post("/auth/login", { ...authData });
      if (response.data.status) {
        useUserStore.setState({ currentUser: response.data.user });
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    } finally {
      useUserStore.setState({ isLoading: false });
    }
  },
  logout: async () => {
    try {
      const response = await axiosInstance.post("/auth/logout");
      if (response.data.status) {
        useUserStore.setState({ currentUser: null });
        toast.success(response.data.message);
      }
    } catch (error: any) {
      console.log(error.response.data.message);
      toast.error(error.response.data.message);
    }
  },
}));

export default useAuthStore;
