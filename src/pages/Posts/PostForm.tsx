import Input from "../../components/form/input/InputField";
import Switch from "../../components/form/switch/Switch";
import Button from "../../components/ui/button/Button";
import TextEditor from "../../components/ckeditor/TextEditor";
interface Props {
  setClose: () => void;
}
export const PostForm = ({ setClose }: Props) => {
  return (
    <>
      <Input type="text" placeholder="Tiêu đề" className="mb-4" name="title" />
      <Input type="text" placeholder="Tác giả" className="mb-4" name="author" />
      <Input type="text" placeholder="Hình ảnh (URL)" className="mb-4" name="image" />
      <Switch label="Nổi bật bài viết" name="hot" />
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nội dung</label>
        <TextEditor />
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={setClose}>
          Hủy
        </Button>
        <Button type="submit">Lưu</Button>
      </div>
    </>
  );
};
