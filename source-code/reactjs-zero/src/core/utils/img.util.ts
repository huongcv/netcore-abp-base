import { GetProp, message, UploadProps } from "antd";
import { l } from "@ord-core/language/lang.utils";

export type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
export namespace UploadImgUtil {
  export const getBase64 = (img: any, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img as FileType);
  };
  export const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error(l.transCommon("You can only upload JPG/PNG file!"));
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error(l.transCommon("Image must smaller than 2MB!"));
    }
    return isJpgOrPng && isLt2M;
  };
}
