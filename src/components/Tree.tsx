import Tree from "react-d3-tree";

export default function TreeComponent({ d3Tree, setDetail }: any) {
  const horizontalWidth = (window.innerWidth * 3) / 4;
  const verticalHeight = (window.innerHeight * 1) / 14;
  return (
    <div className="w-full h-full">
      <Tree
        data={d3Tree}
        pathFunc={"straight"}
        orientation={"vertical"}
        translate={{ x: horizontalWidth / 2, y: verticalHeight }}
        separation={{ siblings: 2, nonSiblings: 2 }}
        collapsible={false}
        onNodeClick={(nodeData, event) => {
          const { data } = nodeData;
          setDetail(data);
        }}
      />
    </div>
  );
}
