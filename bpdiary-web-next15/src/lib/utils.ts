import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tw(strings: TemplateStringsArray, ...values: unknown[]) {
  return String.raw({ raw: strings }, ...values);
}

export function getDatetimeString(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export const DateMonthShortFormat = new Intl.DateTimeFormat("us", {
  month: "short",
});

export const DateMonthLongFormat = new Intl.DateTimeFormat("us", {
  month: "long",
});

export function parseData<T extends z.ZodTypeAny>(
  data: unknown,
  schema: T,
): z.infer<T> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return schema.parse(data) as z.infer<T>; // Safe assertion
}

type FormDataValue = FormDataEntryValue | FormDataEntryValue[] | null;

export function preprocessFormData<Schema extends z.ZodTypeAny>(
  formData: FormData,
  schema: Schema,
) {
  const shape = getShape(schema);
  return mapObj(shape, ([name, propertySchema]) =>
    transformFormDataValue(
      getFormValue(formData, String(name), propertySchema as z.ZodTypeAny),
      propertySchema as z.ZodTypeAny,
    ),
  );
}

function getShape<Schema extends z.ZodTypeAny>(schema: Schema) {
  // find actual shape definition
  let shape: z.ZodTypeAny | null = schema;
  while (shape instanceof z.ZodObject || shape instanceof z.ZodEffects) {
    shape =
      shape instanceof z.ZodObject
        ? (shape.shape as Schema)
        : shape instanceof z.ZodEffects
          ? (shape._def.schema as Schema)
          : null;
    if (shape === null) {
      throw new Error(`Could not find shape`);
    }
  }
  return shape;
}

function getFormValue(
  formData: FormData,
  name: string,
  schema: z.ZodTypeAny,
): FormDataValue {
  if (schema instanceof z.ZodEffects) {
    return getFormValue(formData, name, schema.innerType() as z.ZodTypeAny);
  } else if (schema instanceof z.ZodOptional) {
    return getFormValue(formData, name, schema.unwrap() as z.ZodTypeAny);
  } else if (schema instanceof z.ZodDefault) {
    return getFormValue(formData, name, schema.removeDefault() as z.ZodTypeAny);
  } else if (schema instanceof z.ZodArray) {
    return formData.getAll(name);
  } else {
    return formData.get(name);
  }
}

function transformFormDataValue(
  value: FormDataValue,
  propertySchema: z.ZodTypeAny,
): unknown {
  if (propertySchema instanceof z.ZodEffects) {
    return transformFormDataValue(
      value,
      propertySchema.innerType() as z.ZodTypeAny,
    );
  } else if (propertySchema instanceof z.ZodOptional) {
    return transformFormDataValue(
      value,
      propertySchema.unwrap() as z.ZodTypeAny,
    );
  } else if (propertySchema instanceof z.ZodDefault) {
    return transformFormDataValue(
      value,
      propertySchema.removeDefault() as z.ZodTypeAny,
    );
  } else if (propertySchema instanceof z.ZodArray) {
    if (!value || !Array.isArray(value)) {
      throw new Error("Expected array");
    }
    return value.map((v) =>
      transformFormDataValue(v, propertySchema.element as z.ZodTypeAny),
    );
  } else if (propertySchema instanceof z.ZodObject) {
    throw new Error("Support object types");
  } else if (propertySchema instanceof z.ZodBoolean) {
    return Boolean(value);
  } else if (propertySchema instanceof z.ZodNumber) {
    return Number(value);
  } else if (propertySchema instanceof z.ZodDate) {
    return new Date(value as string);
  } else {
    return value;
  }
}

function mapObj<Key extends string, Value, MappedValue>(
  obj: Record<Key, Value>,
  cb: (entry: [Key, Value]) => MappedValue,
): Record<Key, MappedValue> {
  return Object.entries(obj).reduce(
    (acc, entry) => {
      acc[entry[0] as Key] = cb(entry as [Key, Value]);
      return acc;
    },
    {} as Record<Key, MappedValue>,
  );
}
