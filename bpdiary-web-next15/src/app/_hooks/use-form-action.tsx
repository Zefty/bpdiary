import { type FieldValues, useForm, type UseFormProps } from "react-hook-form";

export function useFormAction<
  TFieldValues extends FieldValues = FieldValues,
  TContext = unknown,
  TTransformedValues extends FieldValues | undefined = undefined,
>(props?: UseFormProps<TFieldValues, TContext>) {
  const form = useForm<TFieldValues, TContext, TTransformedValues>(props);

  const submitAction = (onAction: (formData: TFieldValues) => void) => {
    if (form.formState.isValid) {
      return { action: () => onAction(form.getValues()) };
    }
    return { onSubmit: form.handleSubmit(onAction as never) };
  };

  return {
    ...form,
    submitAction,
  };
}
