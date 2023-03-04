import { useEffect, useState } from "react";
import ImageUploading from "react-images-uploading";
import { useProductsStore, useSampleStore } from "../../store/_store";
import styles from "./styles/ImageUpload.module.css";

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

  const onChange = (imageList: any, addUpdateIndex: any) => {
    // data for submit
    setImages(imageList);

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
        onImageRemoveAll,
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
          &nbsp;
          {imageList.map((image, index) => (
            <div key={index} className={styles.imagecontainer}>
              <img src={image["data_url"]} alt="" className={styles.image} />
              <div className={styles.imageactions}>
                <button onClick={() => onImageUpdate(index)}>MAINĪT</button>
                <button onClick={() => onImageRemove(index)}>DZĒST</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </ImageUploading>
  );
}
