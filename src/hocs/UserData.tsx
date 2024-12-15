import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  user: string | null;
  setUserData: (userData: string) => void;
}

const User = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<string | null>(null);

  const setUserData = (userData: string) => {
    setUser(userData);
  };

  return (
    <User.Provider value={{ user, setUserData }}>
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