import React, { useRef, useState, useEffect, useCallback } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Modal } from "antd";
import { UploadImgBtn } from "@ord-components/common/img/UploadImgBtn";
import ImgWithDeleteAction from "@ord-components/common/img/ImgWithDeleteAction";
import "./img-crop.scss";
import { GetFileUrl } from "@ord-core/service-proxies/axios.base";
import { l } from "@ord-core/language/lang.utils";
import { UploadFileService } from "@api/UploadFileService";

export const OrdImgCrop = ({
  aspect,
  value,
  useSaveCacheBefore,
  className,
  onChange,
  removeImgInDb,
}: {
  aspect?: number;
  value?: any; // file do onchange hoặc fileId string
  className?: string; // className cho style
  useSaveCacheBefore?: boolean;
  onChange?: (value: any) => void;
  removeImgInDb?: () => Promise<boolean>;
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null); // base64 ảnh đã crop để hiển thị
  const [originImage, setOriginImage] = useState<string | null>(null); // base64 ảnh gốc chưa crop
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [cropModalVisible, setCropModalVisible] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setOriginImage(reader.result as string); // ảnh để crop
      setCropModalVisible(true); // mở modal crop
    };
    reader.readAsDataURL(file);
  };

  const getCroppedImage = useCallback(() => {
    console.log(completedCrop);
    if (!completedCrop || !canvasRef.current || !imgRef.current) return;

    const canvas = canvasRef.current;
    const image = imgRef.current;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;

    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );

    const mimeType = image.src.startsWith("data:")
      ? image.src.substring(5, image.src.indexOf(";"))
      : "image/png"; // fallback nếu không có base64

    // Xác định phần mở rộng file
    const extension = mimeType.split("/")[1] || "png";

    canvas.toBlob(
      async (blob) => {
        if (blob) {
          const file = new File([blob], `cropped-image.${extension}`, {
            type: mimeType,
          });
          if (useSaveCacheBefore && useSaveCacheBefore == true) {
            const fileId = await uploadFileToCache(file);
            onChange?.(fileId);
          } else {
            onChange?.(file); // truyền file ra ngoài
          }

          // Chuyển blob sang base64 để hiển thị
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            setImageSrc(reader.result as string);
          };
        }
      },
      mimeType,
      0.8
    ); // không ép type, dùng mime của ảnh gốc - đoạn này tối ưu dung lượng
  }, [completedCrop, onChange]);

  const handleCropDone = () => {
    getCroppedImage();
    setCropModalVisible(false);
    setOriginImage(null); // clear ảnh gốc sau khi crop
  };

  const uploadFileToCache = async (file: File) => {
    try {
      const response = await UploadFileService.uploadFileToCache({ file });
      return response.fileId;
    } catch (err) {}
  };

  const removeImage = async () => {
    const isFileOrString = checkValueIsStringOrFile() && imageSrc;

    if (isFileOrString && removeImgInDb) {
      try {
        const canRemove = await removeImgInDb(); // có thể confirm hoặc xoá ảnh trong DB
        if (!canRemove) return; // nếu không xác nhận xoá thì dừng
      } catch (err) {
        console.error("Lỗi khi xoá ảnh từ DB:", err);
        return; // có lỗi thì dừng
      }
    }
    // Sau khi xoá xong hoặc không có ảnh gốc từ DB
    setImageSrc(null);
    setCompletedCrop(null);
    onChange?.(null);
  };

  const checkValueIsStringOrFile = () => {
    return typeof value === "string" ? true : false;
  };

  const getInitialCrop = (imgWidth: number, imgHeight: number): Crop => {
    let cropWidth = imgWidth * 0.9;
    let cropHeight = imgHeight * 0.9;

    if (aspect) {
      cropHeight = cropWidth / aspect;

      if (cropHeight > imgHeight) {
        cropHeight = imgHeight * 0.9;
        cropWidth = cropHeight * aspect;
      }
    }

    return {
      unit: "px",
      width: cropWidth,
      height: cropHeight,
      x: 0,
      y: 0,
    };
  };

  useEffect(() => {
    if (!value) {
      setImageSrc(null);
      return;
    }
    if (checkValueIsStringOrFile()) {
      setImageSrc(GetFileUrl(value));
      return;
    }
  }, [value]);

  return (
    <div className="relative">
      {!imageSrc ? (
        <>
          <div
            className="react-crop-cus"
            onClick={() => inputRef.current?.click()}
          >
            <UploadImgBtn />
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png, image/jpeg, .ico"
            onChange={handleFileChange}
            style={{ visibility: "hidden", width: "1px" }}
          />
        </>
      ) : (
        <ImgWithDeleteAction url={imageSrc} onRemove={removeImage}>
          <img
            src={imageSrc}
            alt="Cropped"
            style={{ width: 200, borderRadius: 8, objectFit: "contain" }}
          />
        </ImgWithDeleteAction>
      )}

      <Modal
        open={cropModalVisible}
        onCancel={() => {
          setCropModalVisible(false), setImageSrc(null);
        }}
        onOk={handleCropDone}
        okText={l.transCommon("cropImage")}
        cancelText={l.transCommon("actionBtn.cancel")}
        width={500}
        height={300}
        closeIcon={false}
        afterClose={() => {
          if (inputRef && inputRef.current) {
            inputRef.current.value = "";
          }
        }}
      >
        <div className="w-full flex justify-center">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspect}
          >
            {originImage && (
              <img
                ref={imgRef}
                src={originImage}
                alt="Crop source"
                style={{ maxHeight: 400 }}
                onLoad={(e) => {
                  // đợi khi ảnh được load sẽ lấy Rendered size trên dom của ảnh làm kinh thước để tính toán crop
                  const imgEl = e.currentTarget;
                  const renderedWidth = imgEl.clientWidth;
                  const renderedHeight = imgEl.clientHeight;

                  const initialCrop = getInitialCrop(
                    renderedWidth,
                    renderedHeight
                  );
                  setCrop(initialCrop);
                }}
              />
            )}
          </ReactCrop>
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </Modal>
    </div>
  );
};
