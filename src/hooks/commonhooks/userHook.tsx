import { useEffect, useState } from "react";

export function useUserData() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const getUserData = () => {
    try {
      setLoading(true);

      const storedUser = localStorage.getItem("user"); 

      if (!storedUser) {
        setUserData(null);
        return null;
      }

      const parsedUser = JSON.parse(storedUser);
      setUserData(parsedUser);

      return parsedUser;
    } catch (error) {
      console.error("Failed to get user data from localStorage", error);
      setUserData(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return {
    userData,
    loading,
    refreshUserData: getUserData,
  };
}
