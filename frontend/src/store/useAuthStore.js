import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isLoading: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check"); // we'll add this route below
      set({ authUser: res.data });
    } catch (error) {
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signupDonor: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/signup/donor", data);
      set({ authUser: res.data });
      toast.success("Account created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isLoading: false });
    }
  },

  signupBank: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/signup/bank", data);
      set({ authUser: res.data });
      toast.success("Bank account created");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in" , { id: "auth-toast" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed" , { id: "auth-toast" });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
    set({ authUser: null });
    toast.success("Logged out");
  },
}));