import { PostForm } from "./PostForm";
interface Props {
    setClose: () => void;
  }
export const EditPost = ({ setClose }: Props) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-2xl shadow-lg relative border border-gray-200 dark:border-white/[0.1] max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Chỉnh sửa bài viết</h2>
        <PostForm setClose={setClose} />
      </div>
    </div>
  );
};
