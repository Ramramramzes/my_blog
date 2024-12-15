/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import axios from "axios";
import { LoginUserData, UserData } from "../interfaces/users";
import { useAxios } from "./useAxios_API";
import { useNavigate } from "react-router-dom";

export const useUsersApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<any>(null);
  const [checkUserResult, setCheckUserResult] = useState<boolean>(false)
  const axiosInstance = useAxios();
  const navigation = useNavigate()
  
  const addUser = async (userData: UserData) => {
    setLoading(true);
    setAddUserSuccess(null);
    setError(null);

    try {
      const response = await axios.post("/addUser", userData, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setAddUserSuccess(response.data);
      setError(null)
      localStorage.setItem('accessToken', response.data.accessToken);
      document.cookie = `refreshToken=${response.data.refreshToken}; path=/; max-age=${7 * 24 * 60 * 60};`;
      return response
    } catch (err: any) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async (loginUserData: LoginUserData) => {
    setLoading(true);

    try {
      const response = await axios.post("/login-user", loginUserData, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      
      if(response.status === 200){
        setCheckUserResult(true)
        localStorage.setItem('accessToken', response.data.accessToken);
        setError(null)
        return response
      }
    } catch (err: any) {
      setCheckUserResult(false)
      if (err) {
        setError(err?.response?.data);
        logout()
      }
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      const response = await axiosInstance.post("/logout",{})

      if (response.status === 200) {
          localStorage.removeItem('accessToken');
          document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          navigation('/login');
        }
      }
    catch (err) {
      console.log('Ошибка при выходе ', err);
    }
  }
  
  return {
    loading,
    addUser,
    checkUser,
    logout,
    checkUserResult,
    error,
    addUserSuccess,
  };
};