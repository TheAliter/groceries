import { RealtimeChannel } from "@supabase/supabase-js";
import create from "zustand";
import { DB_Sample } from "../database/types";
import {
  dbCreateSample,
  dbDeleteSample,
  dbUpdateSample,
} from "../database/_database";
import { Sample } from "../types/_types";
import { useShoppingListStore } from "./_store";

type Options = { updateDB: boolean };
const defaultOptions: Options = { updateDB: false };

export interface SamplesSliceType {
  samplesListListener: RealtimeChannel | null;
  samples: Sample[];
  setSamplesListListener: (samplesListListener: RealtimeChannel) => void;
  updateSamplesList: (samples: Array<Sample>) => void;
  addSample: (sample: Sample, options?: Options) => void;
  updateSample: (updatedSample: Sample, options?: Options) => void;
  deleteSample: (sampleUid: number, options?: Options) => void;
  handleSamplesListChangeFromDB: (changeData: { [key: string]: any }) => void;
  resetSamplesData: () => void;
}

const initialState = {
  samplesListListener: null,
  samples: Array<Sample>(),
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
  addSample: (sample: Sample, { updateDB }: Options = defaultOptions) => {
    if (updateDB) {
      dbCreateSample(sample);
    }

    let samples = [...get().samples, sample];
    set(() => ({
      samples,
    }));
  },
  updateSample: (
    updatedSample: Sample,
    { updateDB }: Options = defaultOptions
  ) => {
    if (updateDB) {
      dbUpdateSample(updatedSample);
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
  handleSamplesListChangeFromDB: (changeData: { [key: string]: any }) => {
    switch (changeData.eventType as "INSERT" | "UPDATE" | "DELETE") {
      case "INSERT": {
        let newSampleData = changeData.new as DB_Sample;
        if (!get().samples.some((sample) => sample.uid === newSampleData.uid)) {
          let samples = [...get().samples, Sample.fromDbMap(newSampleData)];
          set(() => ({
            samples,
          }));
        }
        break;
      }
      case "UPDATE": {
        let updatedSampleData = changeData.new as DB_Sample;
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
        let deletedSampleUid = changeData.old.uid as number;
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
