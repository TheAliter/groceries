import { useEffect, useState, SyntheticEvent } from "react";
import ImageUploading from "react-images-uploading";
import { useProductsStore, useSampleStore } from "../../store/_store";
import styles from "./styles/ImageUpload.module.css";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

type ProductType = "sample" | "product";

interface Props {
  type: ProductType;
  image?: { data_url: string; file: File } | null;
}

export default function Header({ image, type }: Props) {
  const productsStore = useProductsStore();
  const samplesStore = useSampleStore();

  const [images, setImages] = useState<Array<any>>([]);
  const maxNumber = 1;

  const onChange = (imageList: any) => {
    // data for submit
    setImages(imageList);

    if (imageList.length === 0) {
      productsStore.productImage = null
      return
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
      }) => (
        // write your building UI
        <div className={styles.container}>
          {images.length === 0 && (
            <button
              className={styles.mainbutton}
              onClick={() => onImageUpload()}
              {...dragProps}
            >
              Pievienot bildi
            </button>
          )}
          {imageList.map((image, index) => (
            <div key={index} className={styles.imagecontainer}>
              <PhotoProvider>
                <PhotoView src={image["data_url"]}>
                  <img
                    className={styles.image}
                    src={image["data_url"]}
                    alt=""
                  />
                </PhotoView>
              </PhotoProvider>
              <div className={styles.imageactions}>
                <button
                  className={styles.actionbutton}
                  onClick={() => onImageUpdate(index)}
                >
                  MAINĪT
                </button>
                <button
                  className={styles.actionbutton}
                  onClick={() => onImageRemove(index)}
                >
                  DZĒST
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
}
