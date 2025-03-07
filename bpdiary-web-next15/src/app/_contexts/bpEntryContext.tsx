"use client";
import { createContext, useContext, useState } from "react";
import { EditBpForm } from "../_components/log-bp/edit-bp-form";
import { LogBpForm } from "../_components/log-bp/log-bp-form";
import { type BpLogFormValues } from "~/lib/types";

export interface BpEntryContext {
  open: boolean;
  setOpen: (open: boolean) => void;
  bpFormData?: BpLogFormValues;
  setBpFormData: (data: BpLogFormValues) => void;
}

export const BpEntryContext = createContext<BpEntryContext>({
  open: false,
  setOpen: function () {
    this.open = !this.open;
  },
  setBpFormData: function (data: BpLogFormValues) {
    this.bpFormData = data;
  },
});

interface BpEntryContextProviderProps {
  children: React.ReactNode;
}

export const BpEntryContextProvider: React.FC<BpEntryContextProviderProps> = ({
  children,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [bpFormData, setBpFormData] = useState<BpLogFormValues>();

  return (
    <BpEntryContext.Provider
      value={{
        open,
        setOpen,
        bpFormData,
        setBpFormData,
      }}
    >
      {children}
    </BpEntryContext.Provider>
  );
};

export const useBpEntryContext = () => {
  return useContext(BpEntryContext);
};

export function EditBpFormProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <BpEntryContextProvider>
      <EditBpForm />
      {children}
    </BpEntryContextProvider>
  );
}

export function LogBpFormProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <BpEntryContextProvider>
      <LogBpForm />
      {children}
    </BpEntryContextProvider>
  );
}
