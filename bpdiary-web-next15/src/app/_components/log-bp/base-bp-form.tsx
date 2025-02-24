"use client";

import {
  DatetimePicker,
  DatetimePickerRefs,
} from "../custom-inputs/datetime-picker";
import { Textarea } from "../shadcn/textarea";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../shadcn/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  bpLogFormSchema,
  BpLogFormValues,
  ServerActionSuccess,
} from "~/lib/types";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../shadcn/form";
import { toast } from "~/app/_hooks/use-toast";
import {
  NumberPickerInput,
  NumberPickerInputRefs,
} from "../custom-inputs/number-picker-input";
import { useServerAction } from "~/app/_hooks/use-server-action";
import { CreateOrUpdateBpMeasurement } from "~/server/actions/server-actions";

export interface BpEntryBaseRefs {
  resetForm: () => void;
}

export interface BpEntryBaseProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  header: React.ReactNode;
  footer: React.ReactNode;
  bpFormData?: BpLogFormValues;
}

export const BaseBpForm = forwardRef<BpEntryBaseRefs, BpEntryBaseProps>(
  ({ open, setOpen, header, footer, bpFormData }, ref) => {
    const form = useForm<BpLogFormValues>({
      resolver: zodResolver(bpLogFormSchema),
      defaultValues: useMemo(() => {
        return bpFormData;
      }, [bpFormData]),
    });
    const dateTimePickerRef = useRef<DatetimePickerRefs>(null);
    const systolicRef = useRef<NumberPickerInputRefs>(null);
    const diastolicRef = useRef<NumberPickerInputRefs>(null);
    const pulseRef = useRef<NumberPickerInputRefs>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const [action, isRunning] = useServerAction(CreateOrUpdateBpMeasurement);

    useEffect(() => {
      form.reset(bpFormData);
    }, [bpFormData]);

    useImperativeHandle(
      ref,
      () => ({
        resetForm: () => form.reset(),
      }),
      [],
    );

    async function submit(data: BpLogFormValues) {
      sessionStorage.removeItem("scrollPosition");
      const response = await action(data);
      if (response === ServerActionSuccess) {
        setOpen(!open);
        toast({
          description: data.id
            ? "Edited blood pressure measurement!"
            : "Logged new blood pressure measurement!",
        });
      }
    }

    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>{header}</DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submit)}
              className="flex flex-col gap-6"
              id="bp-entry-base-form"
            >
              <FormField
                control={form.control}
                name="datetime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DatetimePicker
                        name="datetime"
                        selectedDate={field.value}
                        onDateChange={field.onChange}
                        ref={dateTimePickerRef}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="systolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Systolic</FormLabel>
                    <FormControl>
                      <NumberPickerInput
                        name="systolic"
                        number={field.value}
                        setNumber={field.onChange}
                        ref={systolicRef}
                        onRightFocus={() => diastolicRef.current?.focus()}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="diastolic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Diastolic</FormLabel>
                    <FormControl>
                      <NumberPickerInput
                        name="diastolic"
                        number={field.value}
                        setNumber={field.onChange}
                        ref={diastolicRef}
                        onRightFocus={() => pulseRef.current?.focus()}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pulse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pulse</FormLabel>
                    <FormControl>
                      <NumberPickerInput
                        name="pulse"
                        number={field.value}
                        setNumber={field.onChange}
                        ref={pulseRef}
                        onRightFocus={() => notesRef.current?.focus()}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        name="notes"
                        placeholder="Add some notes here ..."
                        ref={notesRef}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed on your profile.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
            <DialogFooter className="w-full">
              <fieldset
                className="flex w-full justify-between"
                disabled={isRunning}
              >
                {footer}
              </fieldset>
            </DialogFooter>
          </Form>
        </DialogContent>
      </Dialog>
    );
  },
);
