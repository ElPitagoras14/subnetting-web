import { Field } from "formik";

export default function TextField({
  name,
  label,
}: {
  name: string;
  label: string;
}) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="pb-2">
        {label}
      </label>
      <Field id={name} name={name}>
        {({
          field,
          form: { setFieldValue },
          meta: { touched, error },
        }: any) => {
          return (
            <>
              <input
                {...field}
                type="text"
                className="bg-[#F5F5F5] p-2 focus:outline-[#E5E5E5] text-sm"
                onChange={(e) => {
                  const {
                    target: { value },
                  } = e;
                  setFieldValue(name, value);
                }}
              ></input>
              {touched && error ? (
                <div className="text-[#f44336d2] text-xs pt-1">{error}</div>
              ) : null}
            </>
          );
        }}
      </Field>
    </div>
  );
}
