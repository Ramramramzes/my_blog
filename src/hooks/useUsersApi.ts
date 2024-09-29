import { useState } from "react";
import axios from "axios";
import { UserData } from "../interfaces/useUserApi";

export const useUsersApi = () => {
  const [loading, setLoading] = useState<boolean>(false);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [addUserError, setAddUserError] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [addUserSuccess, setAddUserSuccess] = useState<any>(null);

  const addUser = async (userData: UserData) => {
    setLoading(true);
    setAddUserSuccess(null);
    setAddUserError(null);

    try {
      const response = await axios.post("/addUser", userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      setAddUserSuccess(response.data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {

      if (err) {
        setAddUserError(err?.status);
      } else {
        setAddUserError("Неизвестная ошибка");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addUser,
    addUserError,
    addUserSuccess };
};