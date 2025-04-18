import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";

interface PostFormProps {
  showModal: boolean;
  setShowModal: (val: boolean) => void;
}

export const PostForm = ({ showModal, setShowModal }: PostFormProps) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-md shadow-lg relative border border-gray-200 dark:border-white/[0.1]">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Thêm bài viết mới</h2>
        <form>
          <Input type="text" placeholder="Tiêu đề" className="mb-4" />
          <Input type="text" placeholder="Nội dung" className="mb-4" />
          <Input type="text" placeholder="Tác giả" className="mb-4" />
          <Input type="text" placeholder="Hình ảnh (URL)" className="mb-4" />
          <Switch label="Nổi bật bài viết" />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
