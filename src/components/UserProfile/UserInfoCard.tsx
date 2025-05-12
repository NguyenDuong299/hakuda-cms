import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { useAuth } from "../../store/authStore";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { userCheck } = useAuth();
  const handleSave = () => {
    // Handle save logic here
    console.log("Saving changes...");
    closeModal();
  };
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">Personal Information</h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Họ</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userCheck?.lastName}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Tên</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userCheck?.firstName}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userCheck?.email}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Số điện thoại</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userCheck?.phoneNumber}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Chức vụ</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">{userCheck?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
