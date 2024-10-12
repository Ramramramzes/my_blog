/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import axios from "axios";
import { LoginUserData, UserData } from "../interfaces/users";
// import { createConfig } from "../common/common.ts"

export const useUsersApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<any>(null);
  const [checkUserResult, setCheckUserResult] = useState<boolean>(false)
  // const config = createConfig();
  
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
    } catch (err: any) {
      setError(err?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async (loginUserData: LoginUserData) => {
    setLoading(true);

    try {
      const response = await axios.post("/login", loginUserData, {
        timeout: 5000,
        headers: {
          "Content-Type": "application/json",
        },
      });

      
      if(response.status === 200){
        setCheckUserResult(true)
        localStorage.setItem('accessToken', response.data.accessToken);
        setError(null)
      }
    } catch (err: any) {
      setCheckUserResult(false)
      if (err) {
        setError(err?.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    addUser,
    checkUser,
    checkUserResult,
    error,
    addUserSuccess,
  };
};