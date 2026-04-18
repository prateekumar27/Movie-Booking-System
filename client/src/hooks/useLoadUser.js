import { useEffect } from "react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getuser } from "../api/index.js";

export const useLoadUser = () => {
  const [isLoading, setLoading] = useState(true);
  const { setAuth, setUser } = useAuth();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await getuser();
        setUser(data.user);
        setAuth(true);
      } catch (error) {
        // not logged in — that's fine, just show Sign in button
        setAuth(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser(); // ✅ CALL IT
  }, []);

  return { isLoading };
};
