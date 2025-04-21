import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/authStore";

export default function SignInForm() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUserCheck } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { token, user } = res.data;

      if (user.role !== "admin") {
        toast.error("Tài khoản không có quyền truy cập CMS!");
        return;
      }
      setUserCheck(user);
      localStorage.setItem("token", token);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast.error(error?.response?.data?.message || "Đăng nhập thất bại, có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">Đăng nhập</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Nhập email và mật khẩu để đăng nhập!</p>
          </div>
          <div>
            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input placeholder="info@gmail.com" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <Label>
                    Mật khẩu <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
                    <span onClick={() => setShowPassword(!showPassword)} className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2">
                      {showPassword ? <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" /> : <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">Nhớ mật khẩu</span>
                  </div>
                  <Link to="/reset-password" className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div>
                  <Button type="submit" disabled={isLoading} className={`w-full ${isLoading ? "cursor-not-allowed opacity-50" : ""}`} size="sm">
                    Đăng nhập
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
