"use client";
import Card from "@/components/Card";
import FormField from "@/components/FormField";
import Sidebar from "@/components/Sidebar";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { ipRegex } from "@/utils/utils";
import SubnetDetail from "@/components/SubnetDetail";
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
      .min(1, "Initial mask must be equal or greater than 1")
      .max(32, "Initial mask must be equal or less than 32"),
    initValue: "",
  },
  {
    name: "byType",
    label: ["Per Host", "Per Network"],
    value: ["hosts", "networks"],
    type: "radio",
    validation: Yup.string().required("By Type is required"),
    initValue: "hosts",
  },
  {
    name: "minValue",
    label: "Minimum Value",
    type: "text",
    validation: Yup.number()
      .required("Minimum Value is required")
      .min(1, "Minimum Value must be equal or greater than 1"),
    initValue: "",
  },
];

const validationSchema = Yup.object().shape(
  formInputs.reduce((acc, input) => {
    const { name, validation } = input;
    return {
      ...acc,
      [name]: validation,
    };
  }, {})
);

const initValues = formInputs.reduce((acc, input) => {
  const { name, initValue } = input;
  return {
    ...acc,
    [name]: initValue,
  };
}, {});

const FLSMResult = ({ result }: { result: any }) => {
  if (!result.networks) {
    return null;
  }
  const {
    subnet_info: {
      initial_ip,
      initial_mask,
      m,
      n,
      number_of_networks,
      number_of_hosts,
    },
  } = result;

  const valuesMap = [
    {
      label: "Initial Ip",
      value: initial_ip,
    },
    {
      label: "Initial Mask",
      value: initial_mask,
    },
    {
      label: "n",
      value: n,
    },
    {
      label: "m",
      value: m,
    },
    {
      label: "Number of Networks",
      value: number_of_networks,
    },
    {
      label: "Number of Hosts",
      value: number_of_hosts,
    },
  ];

  return (
    <Card>
      <div className="flex flex-col space-y-5 p-5 text-base">
        {valuesMap.map((value, idx) => {
          const { label, value: val } = value;
          return (
            <div key={idx} className="flex flex-col justify-between">
              <div className="pb-2">{label}</div>
              <div className="bg-[#F5F5F5] p-2 focus:outline-[#E5E5E5] text-sm">
                {val}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function FLSM() {
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
    const { initialIp, mask, byType, minValue } = values;
    const response = await fetch(`${backendUrl}/api/v1/subnet/flsm/${byType}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        init_ip: initialIp,
        init_mask: mask,
        min_value: minValue,
      }),
    });
    setResult(await response.json());
  };

  return (
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
            initialValues={initValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ validateForm, submitForm }: any) => {
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
                    {result && <FLSMResult result={result}></FLSMResult>}
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
  );
}
