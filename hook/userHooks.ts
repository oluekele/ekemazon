import { axiosInstance } from "@/lib/api";
import { UserInfo } from "@/types/UserInfo";
import { useMutation } from "@tanstack/react-query";

export const useSigninMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data } = await axiosInstance.post<UserInfo>(`api/users/signin`, {
        email,
        password,
      });
      return data;
    },
  });

export const useSignupMutation = () =>
  useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { data } = await axiosInstance.post<UserInfo>(`api/users/signup`, {
        email,
        password,
        name,
      });
      return data;
    },
  });
