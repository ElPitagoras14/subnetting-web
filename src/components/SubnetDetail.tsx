import Card from "./Card";

export default function SubnetDetail({
  subnetDetail,
  indexedSubnets,
}: {
  subnetDetail: any;
  indexedSubnets: any;
}) {
  const {
    name: nameSubnet,
    attributes: { mask, subnet },
  } = subnetDetail;
  let parsedName = nameSubnet;
  if (nameSubnet.includes("-")) {
    parsedName = nameSubnet.split("-")[1];
  }
  const { first_ip, last_ip, broadcast } = indexedSubnets[parsedName] || {};
  const valuesMap = [
    {
      label: "Name",
      value: nameSubnet,
    },
    {
      label: "Subnet",
      value: subnet,
    },
    {
      label: "Mask",
      value: mask,
    },
    {
      label: "First Ip",
      value: first_ip,
    },
    {
      label: "Last Ip",
      value: last_ip,
    },
    {
      label: "Broadcast",
      value: broadcast,
    },
  ];

  return (
    <Card>
      <div className="flex flex-col space-y-5 p-5 text-base">
        {valuesMap.map((value, idx) => {
          const { label, value: val } = value;
          if (!val) {
            return null;
          }
          return (
            <div key={idx} className="flex flex-col justify-between">
              <div className="pb-2">{label}</div>
              <div className="bg-[#F5F5F5] p-2 focus:outline-[#E5E5E5] text-sm">
                {val}
              </div>
            </div>
          );
        })}
        {nameSubnet.includes("-") && (
          <div className="flex flex-col justify-between">
            <div className="pb-2">Available host</div>
            <div className="bg-[#F5F5F5] p-2 focus:outline-[#E5E5E5] text-sm">
              {Math.pow(2, 32 - mask) - 2}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
