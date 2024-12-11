"use client";
import { createContext, useContext, useState } from "react";
import { RouterOutputs } from "~/trpc/react";

type BloodPressureDiary = RouterOutputs["bloodPressure"]["getInfiniteDiary"];

export interface BpEntryContext {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  bpEntryData?: BloodPressureDiary["data"][0];
  setBpEntryData: (data: BloodPressureDiary["data"][0]) => void;
}

export const BpEntryContext = createContext<BpEntryContext>({
  openSheet: false,
  setOpenSheet: function() {
    this.openSheet = !this.openSheet
  },
  setBpEntryData: function(data: BloodPressureDiary["data"][0]) {
    this.bpEntryData = data
  }
});

interface BpEntryContextProviderProps {
  children: React.ReactNode;
}

export const BpEntryContextProvider: React.FC<
  BpEntryContextProviderProps
> = ({ children }) => {
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [bpEntryData, setBpEntryData] = useState<BloodPressureDiary["data"][0]>();

  return (
    <BpEntryContext.Provider
      value={{
        openSheet,
        setOpenSheet,
        bpEntryData, 
        setBpEntryData
      }}
    >
      {children}
    </BpEntryContext.Provider>
  );
};

export const useBpEntryContext = () => {
  return useContext(BpEntryContext);
};
