import { useEffect, useState, type ReactNode } from "react";
import ImageUploading from "react-images-uploading";
import { useProductsStore, useSampleStore } from "../../store/_store";
import styles from "./styles/ImageUpload.module.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

type ProductType = "sample" | "product";

export interface ImageUploadLayoutSlots {
  addImageHeaderControl: ReactNode;
  imageArea: ReactNode;
}

interface Props {
  type: ProductType;
  image?: { data_url: string; file: File } | null;
  children: (slots: ImageUploadLayoutSlots) => ReactNode;
}

export default function ImageUpload({ image, type, children }: Props) {
  const productsStore = useProductsStore();
  const samplesStore = useSampleStore();

  const [images, setImages] = useState<Array<any>>([]);
  const maxNumber = 1;

  const onChange = (imageList: any) => {
    // data for submit
    setImages(imageList);

    if (imageList.length === 0) {
      if (type === "product") {
        productsStore.productImage = null;
      } else {
        samplesStore.sampleImage = null;
      }
      return;
    }

    if (type === "product") {
      if (imageList[0]) productsStore.productImage = imageList[0].file;
    } else {
      if (imageList[0]) samplesStore.sampleImage = imageList[0].file;
    }
  };

  useEffect(() => {
    if (image) {
      setImages([image]);
    }
  }, [image]);

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
      dataURLKey="data_url"
    >
      {({
        imageList,
        onImageUpload,
        onImageUpdate,
        onImageRemove,
        dragProps,
        isDragging,
      }) => {
        const addImageHeaderControl =
          images.length === 0 ? (
            <button
              type="button"
              className={
                styles.headerAddImageButton +
                (isDragging ? ` ${styles.headerAddImageButtonDragging}` : "")
              }
              onClick={() => onImageUpload()}
              {...dragProps}
              aria-label="Pievienot bildi"
            >
              <span className="material-icons-outlined" aria-hidden="true">
                add_photo_alternate
              </span>
            </button>
          ) : null;

        const imageArea = (
          <div className={styles.container}>
            {imageList.map((image, index) => (
              <div key={index} className={styles.imagecontainer}>
                <div className={styles.imagePreviewWrap}>
                  <PhotoProvider>
                    <PhotoView src={image["data_url"]}>
                      <img
                        className={styles.image}
                        src={image["data_url"]}
                        alt=""
                      />
                    </PhotoView>
                  </PhotoProvider>
                  <div
                    className={styles.imageFloatingActions}
                    role="group"
                    aria-label="Attēla darbības"
                  >
                    <button
                      type="button"
                      className={styles.floatingActionButton}
                      onClick={() => onImageUpdate(index)}
                      aria-label="Mainīt attēlu"
                    >
                      <span
                        className="material-icons-outlined"
                        aria-hidden="true"
                      >
                        edit
                      </span>
                    </button>
                    <button
                      type="button"
                      className={
                        styles.floatingActionButton +
                        ` ${styles.floatingActionButtonDanger}`
                      }
                      onClick={() => onImageRemove(index)}
                      aria-label="Dzēst attēlu"
                    >
                      <span
                        className="material-icons-outlined"
                        aria-hidden="true"
                      >
                        delete_outline
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

        return (
          <>
            {children({
              addImageHeaderControl,
              imageArea,
            })}
          </>
        );
      }}
    </ImageUploading>
  );
}
