import { useState } from "react";
import axios from "axios";
import { LoginUserData, UserData } from "../interfaces/users";

export const useUsersApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [error, setError] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [addUserSuccess, setAddUserSuccess] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [checkUserResult, setCheckUserResult] = useState<boolean>(false)

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        setError(null)
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    addUserSuccess };
};