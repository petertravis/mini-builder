import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "Database", path: "/" },
  { label: "Project", path: "/project" },
  { label: "Fields Index", path: "/fields-index" },
  { label: "Rule builder", path: "/rule-builder" },
];

export function PrototypeNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-0 flex items-center shrink-0">
      <div className="flex gap-0">
        {tabs.map((tab) => (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              location.pathname === tab.path
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
