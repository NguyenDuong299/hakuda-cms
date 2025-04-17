import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import SignInForm from "../../components/auth/SignInForm";
import { useAuth } from "../../store/authStore";
import Loading from "../../components/ui/loading/loading";

export default function SignIn() {
  const navigate = useNavigate();
  const { userCheck, loading } = useAuth();

  useEffect(() => {
    if (!loading && userCheck) {
      navigate("/");
    }
  }, [loading, userCheck, navigate]);

  if (loading) return <Loading />;

  return (
    <>
      <PageMeta
        title="React.js SignIn Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js SignIn Tables Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <AuthLayout>
        <SignInForm />
      </AuthLayout>
    </>
  );
}
