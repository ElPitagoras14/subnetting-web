import RadioField from "./RadioField";
import TextField from "./TextField";

export default function FormField({
  name,
  label,
  type,
  values = [],
}: {
  name: string;
  label: any;
  type: string;
  values?: string[];
}) {
  if (type === "text") {
    return <TextField name={name} label={label}></TextField>;
  }
  if (type === "radio") {
    return <RadioField name={name} label={label} value={values}></RadioField>;
  }
}
