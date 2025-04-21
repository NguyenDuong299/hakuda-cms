// hooks/useAuthCheck.ts
import { useEffect } from "react";
import { useAuth } from "../store/authStore";
import axios from "axios";

export const useAuthCheck = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const { setUserCheck, setLoading } = useAuth();
  useEffect(() => {
    const checkLogin = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(`${API_URL}/api/auth/my-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserCheck(res.data);
      } catch (err) {
        console.log(err);
        setUserCheck(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, [setUserCheck, setLoading]);
};
