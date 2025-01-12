import axios from "axios";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserContextType {
  user: string | null;
  allUserData: any | null;
  setUserData: (userData: string) => void;
}

const User = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<string | null>(null);
  const [allUserData, setAllUserData] = useState(null);

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await axios.get(`/get-user?user_id=${user}`);
          setAllUserData(response.data);
        } catch (error) {
          console.error("Ошибка при загрузке текущего пользователя:", error);
        }
      };
  
      if(user){
        fetchUser();
      }
    }, [user]);
  
  const setUserData = (userData: string) => {
    setUser(userData);
  };

  return (
    <User.Provider value={{ user, setUserData, allUserData }}>
      {children}
    </User.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(User);
  if (context === undefined) {
    throw new Error("useUser должен использоваться внутри UserProvider");
  }
  return context;
};