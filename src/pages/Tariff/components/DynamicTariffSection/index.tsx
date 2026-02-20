import type { FC } from "react";
import { useState } from "react";
import type { TariffSectionUI, DynamicSectionProps } from "./types";


const DynamicTariffSection: FC<DynamicSectionProps> = ({ sections }) => {
  const [activeTab, setActiveTab] = useState(sections?.[0]?.title || "");

  if (!sections || sections.length === 0) {
    return null;
  }

  const currentSection = sections.find((s: TariffSectionUI) => s.title === activeTab);

  if (!currentSection || currentSection.items.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
      {sections.length > 1 && (
        <div className="mb-4 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {sections.map((section) => (
              <button
                key={section.title}
                onClick={() => setActiveTab(section.title)}
                className={`
                  ${activeTab === section.title
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                `}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentSection.title}</h3>
        <ul className="divide-y divide-gray-200">
          {currentSection.items.map((item, index) => (
            <li key={index} className="py-3 flex items-start">
              <span className="text-gray-700 font-medium break-words flex-grow mr-4">
                {item.item || item.descripcion}
              </span>
              {item.precio !== undefined && (
                <span className="text-indigo-600 font-semibold flex-shrink-0 whitespace-nowrap ml-auto">
                  ${" "}
                  {item.precio.toLocaleString("es-AR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  })}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DynamicTariffSection;
