export default function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-[91.8vh] shadow-[2px_0px_4px_0px_rgba(0,0,0,0.3)] overflow-y-auto scrollable-theme">
      {children}
    </div>
  );
}
