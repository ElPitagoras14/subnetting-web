"use client";
import Card from "@/components/Card";
import FormField from "@/components/FormField";
import Sidebar from "@/components/Sidebar";
import SubnetDetail from "@/components/SubnetDetail";
import { ipRegex } from "@/utils/utils";
import {
  ArrowsUpDownIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { FieldArray, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TreeComponent from "@/components/Tree";

const lefTabShadow =
  "bg-[#E5E5E5] shadow-[inset_-2px_2px_4px_0px_rgba(0,0,0,0.3)]";
const rightTabShadow =
  "bg-[#E5E5E5] shadow-[inset_2px_2px_4px_0px_rgba(0,0,0,0.3)]";

const formInputs = [
  {
    name: "initialIp",
    label: "Initial Ip",
    type: "text",
    validation: Yup.string()
      .required("Initial Ip is required")
      .matches(ipRegex, "Invalid IP Address"),
    initValue: "",
  },
  {
    name: "mask",
    label: "Initial Mask",
    type: "text",
    validation: Yup.number()
      .required("Initial Mask is required")
      .min(0, "Initial mask must be equal or greater than 0")
      .max(32, "Initial mask must be equal or less than 32"),
    initValue: "",
  },
  {
    name: "byType",
    label: ["Ordered", "Unordered"],
    value: ["hosts-ordered", "hosts"],
    type: "radio",
    validation: Yup.string().required("By Type is required"),
    initValue: "hosts-ordered",
  },
];

const especialInputs = {
  newHost: {
    name: "newHost",
    label: "New Host",
    type: "text",
    validation: Yup.number().min(1, "New Host must be equal or greater than 1"),
    initValue: "",
  },
  hosts: {
    name: "hosts",
    label: "Hosts",
    type: "array",
    validation: Yup.array().of(
      Yup.number().min(1, "New Host must be equal or greater than 1")
    ),
    initValue: [],
  },
};

const basicValidation = formInputs.reduce((acc, input) => {
  const { name, validation } = input;
  return {
    ...acc,
    [name]: validation,
  };
}, {});

const specialValidation = Object.keys(especialInputs).reduce((acc, input) => {
  const { name, validation } =
    especialInputs[input as keyof typeof especialInputs];
  return {
    ...acc,
    [name]: validation,
  };
}, {});

const validationSchema = Yup.object().shape(
  Object.assign(basicValidation, specialValidation)
);

const basicInitValues = formInputs.reduce((acc, input) => {
  const { name, initValue } = input;
  return {
    ...acc,
    [name]: initValue,
  };
}, {});

const specialInitValues = Object.keys(especialInputs).reduce((acc, input) => {
  const { name, initValue } =
    especialInputs[input as keyof typeof especialInputs];
  return {
    ...acc,
    [name]: initValue,
  };
}, {});

const VLSMResult = ({ result }: { result: any }) => {
  if (!result.networks) {
    return null;
  }
  const {
    subnet_info: {
      initial_ip,
      initial_mask,
      initial_host_per_network,
      host_per_network,
    },
  } = result;

  const valuesMap = [
    {
      label: "Initial Ip",
      value: initial_ip,
      type: "text",
    },
    {
      label: "Initial Mask",
      value: initial_mask,
      type: "text",
    },
    {
      label: "Initial Host Per Network",
      value: initial_host_per_network,
      type: "array",
    },
    {
      label: "Host Per Network",
      value: host_per_network,
      type: "array",
    },
  ];

  return (
    <Card>
      <div className="flex flex-col space-y-5 p-5 text-base">
        {valuesMap.map((value, idx: number) => {
          const { label, value: val, type } = value;
          if (type === "text") {
            return (
              <div key={idx} className="flex flex-col justify-between">
                <div className="pb-2">{label}</div>
                <div className="bg-[#F5F5F5] p-2 focus:outline-[#E5E5E5] text-sm">
                  {val}
                </div>
              </div>
            );
          }
          if (type === "array") {
            return (
              <div key={idx} className="flex flex-col justify-between">
                <div className="pb-2">{label}</div>
                <div className="bg-[#F5F5F5] p-2 focus:outline-[#E5E5E5] text-sm">
                  {`[${val.join(", ")}]`}
                </div>
              </div>
            );
          }
        })}
      </div>
    </Card>
  );
};

interface HostItemProps {
  index: number;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  host: string;
  remove: () => void;
}

const HostItem: React.FC<HostItemProps> = ({
  index,
  moveRow,
  host,
  remove,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const [, drag] = useDrag({
    type: "HOST",
    item: { type: "HOST", index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "HOST",
    hover: (item: any, monitor) => {
      if (!drag) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveRow(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <div
      ref={(node) => drag(drop(node))}
      className={`grid grid-cols-6 justify-center items-center cursor-move ${
        isDragging ? "hover:opacity-50" : "hover:opacity-100"
      }`}
    >
      <div className="justify-self-center">
        <ArrowsUpDownIcon className="h-6 w-6" />
      </div>
      <div className="col-span-4">
        <div className="bg-[#FAFAFA] p-2 focus:outline-[#E5E5E5] text-sm">
          {host}
        </div>
      </div>
      <div className="justify-self-center">
        <button
          type="button"
          className="flex items-center justify-center w-8 h-8 bg-[#D05E2B] text-white rounded-full hover:opacity-80"
          onClick={remove}
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function VLSM() {
  const [activeTab, setActiveTab] = useState<string>("data");
  const [result, setResult] = useState<any>(null);
  const [detail, setDetail] = useState<any>(null);
  const [indexedNetworks, setIndexedNetworks] = useState<any>({});

  useEffect(() => {
    if (result && result.networks) {
      const indexedNetworks = result.networks.reduce(
        (acc: any, network: any) => {
          const { name } = network;
          return {
            ...acc,
            [name]: network,
          };
        },
        {}
      );
      setIndexedNetworks(indexedNetworks);
    }
  }, [result]);

  const handleSubmit = async (values: any) => {
    const { initialIp, mask, byType, hosts } = values;
    const response = await fetch(`${backendUrl}/api/v1/subnet/vlsm/${byType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init_ip: initialIp,
        init_mask: mask,
        host_list: hosts,
      }),
    });
    setResult(await response.json());
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <main>
        <div className="grid grid-cols-4">
          <Sidebar>
            <div className="grid grid-cols-2 text-center text-lg font-medium">
              <div
                className={`py-4 ${
                  activeTab !== "data" ? lefTabShadow : ""
                } hover:cursor-pointer`}
                onClick={() => setActiveTab("data")}
              >
                Data
              </div>
              <div
                className={`py-4 ${
                  activeTab !== "detail" ? rightTabShadow : ""
                } hover:cursor-pointer`}
                onClick={() => setActiveTab("detail")}
              >
                Details
              </div>
            </div>
            <Formik
              initialValues={Object.assign(basicInitValues, specialInitValues)}
              onSubmit={handleSubmit}
              validationSchema={validationSchema}
            >
              {({ values, validateForm, submitForm }: any) => {
                if (activeTab === "data") {
                  return (
                    <>
                      <Card>
                        <Form>
                          <div className="flex flex-col space-y-5 p-5 text-base">
                            {formInputs.map((input, idx) => {
                              const { name, label, type, value } = input;
                              return (
                                <FormField
                                  key={idx}
                                  name={name}
                                  label={label}
                                  type={type}
                                  values={value}
                                ></FormField>
                              );
                            })}
                            <FieldArray name={"hosts"}>
                              {({ push, remove, form: { setFieldValue } }) => {
                                const {
                                  newHost: {
                                    name: newHostName,
                                    label: newHostLabel,
                                    type: newHostType,
                                  },
                                } = especialInputs;
                                const { hosts, [newHostName]: newHost } =
                                  values;
                                const moveRow = (
                                  dragIndex: number,
                                  hoverIndex: number
                                ) => {
                                  const draggedHost = hosts[dragIndex];
                                  const updatedHosts = [...hosts];
                                  updatedHosts.splice(dragIndex, 1);
                                  updatedHosts.splice(
                                    hoverIndex,
                                    0,
                                    draggedHost
                                  );
                                  setFieldValue("hosts", updatedHosts);
                                };
                                return (
                                  <>
                                    <div className="grid grid-cols-12 items-center">
                                      <div className="col-span-10">
                                        <FormField
                                          name={newHostName}
                                          label={newHostLabel}
                                          type={newHostType}
                                        ></FormField>
                                      </div>
                                      <div className="col-span-2 justify-self-center self-end">
                                        <button
                                          onClick={() => {
                                            if (newHost) {
                                              push(newHost);
                                              setFieldValue(newHostName, "");
                                            }
                                          }}
                                          type="button"
                                          className="flex items-center justify-center w-8 h-8 bg-[#2F79C1] text-white rounded-full hover:opacity-80"
                                        >
                                          <PlusIcon className="h-6 w-6" />
                                        </button>
                                      </div>
                                    </div>
                                    <div className="flex flex-col justify-between justify-items-center">
                                      {hosts.length > 0 && (
                                        <>
                                          <div className="pb-2">Hosts</div>
                                          <div className="bg-[#F5F5F5] px-2 py-3 space-y-3 max-h-96 overflow-y-auto scrollable-theme">
                                            {hosts.map(
                                              (host: any, idx: number) => {
                                                return (
                                                  <HostItem
                                                    key={idx}
                                                    index={idx}
                                                    moveRow={moveRow}
                                                    host={host}
                                                    remove={() => remove(idx)}
                                                  ></HostItem>
                                                );
                                              }
                                            )}
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </>
                                );
                              }}
                            </FieldArray>

                            <div className="flex justify-around pt-2">
                              <button
                                type="button"
                                className="bg-[#2F79C1] p-2 px-4 rounded-md hover:opacity-80 text-[#FFFFFF]"
                                onClick={async () => {
                                  const errors = await validateForm();
                                  if (Object.keys(errors).length === 0) {
                                    submitForm();
                                  }
                                }}
                              >
                                Create Tree
                              </button>
                              <button
                                type="button"
                                className="bg-[#FFFFFF] p-2 px-4 rounded-md hover:opacity-80 text-[#2F79C1] border-[1px] border-[#2F79C1]"
                              >
                                Download
                              </button>
                            </div>
                          </div>
                        </Form>
                      </Card>
                      {result && <VLSMResult result={result}></VLSMResult>}
                    </>
                  );
                }
                if (activeTab === "detail") {
                  if (!detail) {
                    return null;
                  }
                  return (
                    <SubnetDetail
                      subnetDetail={detail}
                      indexedSubnets={indexedNetworks}
                    ></SubnetDetail>
                  );
                }
              }}
            </Formik>
          </Sidebar>
          <div className="col-span-3">
            {result && (
              <TreeComponent
                d3Tree={result.d3_tree}
                setDetail={setDetail}
              ></TreeComponent>
            )}
          </div>
        </div>
      </main>
    </DndProvider>
  );
}
