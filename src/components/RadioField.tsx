import { Field } from "formik";

export default function RadioField({
  name,
  label,
  value,
}: {
  name: string;
  label: string[];
  value: string[];
}) {
  return (
    <div className="flex items-center space-x-4 font-medium">
      {label.map((label, idx) => {
        return (
          <div key={idx}>
            <Field
              id={name}
              name={name}
              value={value[idx]}
              type="radio"
              className="mr-2 w-4 h-4 hover:before:opacity-20"
            ></Field>
            <label htmlFor={name}>{label}</label>
          </div>
        );
      })}
    </div>
  );
}
