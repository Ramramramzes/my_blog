import { useState } from "react";
import { LoginUserData, UserData } from "../interfaces/users";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const useUsersApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [addUserSuccess, setAddUserSuccess] = useState<any>(null);
  const [checkUserResult, setCheckUserResult] = useState<boolean>(false)
  const navigation = useNavigate()
  
  const addUser = async (userData: UserData) => {
    setLoading(true);
    setAddUserSuccess(null);
    setError(null);

    try {
      const response = await axios.post("/add-user", userData, {
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
      setError(err?.response.data?.message);
      console.log(err);
      
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
        setError(err?.response?.data?.message);
        logout()
      }
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      const response = await axios.post("/logout",{})

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