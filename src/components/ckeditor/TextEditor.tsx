import Editor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
interface Props {
  onChange: (value: string) => void;
  value: string;
}
export default function TextEditor({ onChange, value }: Props) {
  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "outdent",
        "indent",
        "|",
        "imageUpload",
        "blockQuote",
        "insertTable",
        "mediaEmbed",
        "undo",
        "redo",
        "alignment",
        "code",
        "codeBlock",
        "findAndReplace",
        "fontColor",
        "fontFamily",
        "fontSize",
        "fontBackgroundColor",
        "highlight",
        "horizontalLine",
        "htmlEmbed",
        "imageInsert",
      ],
    },
    language: "en",
    image: {
      toolbar: ["imageTextAlternative", "toggleImageCaption", "imageStyle:inline", "imageStyle:block", "imageStyle:side"],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
    },
  };

  return (
    <CKEditor
      editor={Editor}
      config={editorConfiguration || {}}
      data={value}
      onChange={(_, editor) => {
        const data = editor.getData();
        onChange(data);
      }}
    />
  );
}
