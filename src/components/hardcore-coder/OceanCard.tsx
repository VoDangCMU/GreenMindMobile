import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { IOceanTraitScore } from '@/apis/ai/calculate_ocean_score';
import OceanChart from './OceanChart';

/**
 * OceanRadarChart
 *
 * Presentational component that renders O/C/E/A/N scores in a two-column card:
 * - Left: textual summary + per-trait progress bars
 * - Right: radar chart visualization using Recharts
 *
 * Accepts optional `scores` prop. If provided, it will be used instead of any global store.
 */
const OceanCard = ({ scores }: { scores?: IOceanTraitScore }) => {
  // Ensure a deterministic trait order: O C E A N
  const traits = ["O", "C", "E", "A", "N"];


  // Helper: convert raw value to percent (assume 0-100 scale; clamp)
  const toPercent = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  return (
    <Card className="border-0 shadow-md w-full">
      <CardHeader>
        <CardTitle className="text-base">Your OCEAN</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: textual summary */}
          <div className="space-y-4 flex flex-col items-start">
            {traits.map((t) => (
              <div key={t} className="w-full">
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2">
                  <div className="w-6 text-sm font-semibold text-left">{t}</div>
                  <div className="text-sm text-gray-700">{traitLabel(t)}</div>
                  <div className="text-xs text-gray-500 w-14 text-right">{toPercent(Number(scores?.[t as keyof IOceanTraitScore] ?? 0))}%</div>

                  <div className="col-start-2 col-span-2 mt-1">
                    <Progress value={toPercent(Number(scores?.[t as keyof IOceanTraitScore] ?? 0))} className="h-2 w-full" />
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2 text-xs text-gray-500">This chart visualizes the relative strengths across the five traits.</div>
          </div>

          {/* Right: Radar Chart */}
          <div className="flex items-center justify-center">
            <OceanChart scores={scores} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

function traitLabel(key: string) {
  switch (key) {
    case 'O':
      return 'Openness';
    case 'C':
      return 'Conscientiousness';
    case 'E':
      return 'Extraversion';
    case 'A':
      return 'Agreeableness';
    case 'N':
      return 'Neuroticism';
    default:
      return key;
  }
}

export default OceanCard;