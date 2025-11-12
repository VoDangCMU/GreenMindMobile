import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { MOCKED_OCEAN_SCORE } from "@/apis/ai/calculate_ocean_score";
import React from "react";

const OceanPersonalityCard: React.FC = () => {
  const ocean = useAppStore((state) => state.ocean) || MOCKED_OCEAN_SCORE;
  return (
    <Card className="mb-6 border-0 shadow-lg">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-greenery-600 mr-2" />
          <h3 className="font-semibold text-greenery-700 text-base">
            OCEAN Personality
          </h3>
        </div>
        <div className="grid grid-cols-5 gap-2 items-end h-36">
          {Object.entries(ocean).map(([trait, value]) => (
            <div
              key={trait}
              className="flex flex-col items-center space-y-1"
            >
              <div className="w-3 h-28 bg-greenery-100 relative rounded-md overflow-hidden">
                <div
                  className="bg-greenery-500 w-full absolute bottom-0 transition-all duration-500 ease-out"
                  style={{ height: `${value}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-greenery-700 uppercase tracking-tight">
                {trait.charAt(0)}
              </span>
              <span className="text-[10px] text-greenery-500">
                {value.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OceanPersonalityCard;
