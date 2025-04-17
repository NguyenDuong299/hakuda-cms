import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthCheck } from "../../hooks/useAuth";
import { useAuth } from "../../store/authStore";
import Loading from "../ui/loading/loading";

type Props = {
  children: ReactNode;
};

export const AuthGuard = ({ children }: Props) => {
  useAuthCheck(); 
  const navigate = useNavigate();
  const { userCheck, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!userCheck) {
        navigate("/signin");
      }
    }
  }, [loading, userCheck, navigate]);

  if (loading) return <Loading />;

  return <>{children}</>;
};
