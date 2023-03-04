import { RealtimeChannel } from "@supabase/supabase-js";
import create from "zustand";
import { DB_Sample } from "../database/types";
import {
  dbCreateSample,
  dbDeleteSample,
  dbUpdateSample,
  dbUploadProductImage,
} from "../database/_database";
import { Sample } from "../types/_types";
import { useShoppingListStore } from "./_store";

type Options = { updateDB: boolean; updateImage?: boolean };
const defaultOptions: Options = { updateDB: false, updateImage: true };

export interface SamplesSliceType {
  samples: Sample[];
  sampleImage: File | null;
  samplesListListener: RealtimeChannel | null;
  setSamplesListListener: (samplesListListener: RealtimeChannel) => void;
  updateSamplesList: (samples: Array<Sample>) => void;
  addSample: (sample: Sample, options?: Options) => void;
  updateSample: (updatedSample: Sample, options?: Options) => void;
  deleteSample: (sampleUid: number, options?: Options) => void;
  handleSamplesListChangeFromDB: (changeData: { [key: string]: any }) => void;
  resetSamplesData: () => void;
}

const initialState = {
  samples: Array<Sample>(),
  sampleImage: null,
  samplesListListener: null,
};

export const useSampleStore = create<SamplesSliceType>()((set, get) => ({
  ...initialState,
  setSamplesListListener: (samplesListListener: RealtimeChannel) => {
    set(() => ({
      samplesListListener,
    }));
  },
  updateSamplesList: (samples: Array<Sample>) => {
    set(() => ({
      samples,
    }));
  },
  addSample: (
    sample: Sample,
    { updateDB, updateImage }: Options = defaultOptions
  ) => {
    if (updateDB) {
      dbCreateSample(sample);

      if (updateImage && sample.imageName !== "") {
        dbUploadProductImage(get().sampleImage!).then(() => {
          set(() => ({
            sampleImage: null,
          }));
        });
      }
    }

    let samples = [...get().samples, sample];
    set(() => ({
      samples,
    }));
  },
  updateSample: (
    updatedSample: Sample,
    { updateDB, updateImage }: Options = defaultOptions
  ) => {
    if (updateDB) {
      dbUpdateSample(updatedSample);

      if (updateImage && updatedSample.imageName !== "") {
        dbUploadProductImage(get().sampleImage!).then(() => {
          set(() => ({
            sampleImage: null,
          }));
        });
      }
    }

    let samples = get().samples.map((sample) =>
      sample.uid === updatedSample.uid ? updatedSample : sample
    );
    set(() => ({
      samples,
    }));
  },
  deleteSample: (sampleUid: number, { updateDB }: Options = defaultOptions) => {
    if (updateDB) {
      let shopListId = useShoppingListStore.getState().id;
      dbDeleteSample(shopListId, sampleUid);
    }

    let samples = get().samples.filter((sample) => sample.uid !== sampleUid);
    set(() => ({
      samples,
    }));
  },
  handleSamplesListChangeFromDB: (newData: { [key: string]: any }) => {
    switch (newData.eventType as "INSERT" | "UPDATE" | "DELETE") {
      case "INSERT": {
        let newSampleData = newData.new as DB_Sample;
        if (!get().samples.some((sample) => sample.uid === newSampleData.uid)) {
          let samples = [...get().samples, Sample.fromDbMap(newSampleData)];
          set(() => ({
            samples,
          }));
        }
        break;
      }
      case "UPDATE": {
        let updatedSampleData = newData.new as DB_Sample;
        let updateSample = Sample.fromDbMap(updatedSampleData);
        let originalSample = get().samples.find(
          (sample) => sample.uid === updateSample.uid
        );
        if (!originalSample?.sameAs(updateSample, { checkRank: true })) {
          let samples = get().samples.map((sample) =>
            sample.uid === updateSample.uid ? updateSample : sample
          );
          set(() => ({
            samples,
          }));
        }
        break;
      }
      case "DELETE": {
        let deletedSampleUid = newData.old.uid as number;
        if (get().samples.some((sample) => sample.uid === deletedSampleUid)) {
          let samples = get().samples.filter(
            (sample) => sample.uid !== deletedSampleUid
          );
          set(() => ({
            samples,
          }));
        }
        break;
      }
    }
  },
  resetSamplesData: () => {
    set(() => ({
      ...initialState,
    }));
  },
}));
