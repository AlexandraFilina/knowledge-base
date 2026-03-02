import { TabType } from "../utils/types";

interface ProjectTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs: { key: TabType; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "goals", label: "Goals" },
  { key: "knowledge", label: "Knowledge" },
  { key: "practice", label: "Practice" },
];

export function ProjectTabs({ activeTab, onTabChange }: ProjectTabsProps) {
  return (
    <nav className="flex">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-6 py-4 text-sm font-medium transition-colors ${
            activeTab === tab.key
              ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50"
              : "text-stone-500 hover:text-stone-700 hover:bg-stone-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
