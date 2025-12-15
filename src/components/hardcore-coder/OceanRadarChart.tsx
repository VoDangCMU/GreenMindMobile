import { useOcean } from '@/hooks/v1/useOcean';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

/**
 * OceanRadarChart
 *
 * Presentational component that renders O/C/E/A/N scores in a two-column card:
 * - Left: textual summary + per-trait progress bars
 * - Right: radar chart visualization using Recharts
 *
 * The component consumes the `useOcean` hook and normalizes values for display.
 */
const OceanRadarChart = () => {
  const { ocean } = useOcean();

  // Ensure a deterministic trait order: O C E A N
  const traits = ["O", "C", "E", "A", "N"];

  // Map to chart-friendly data; if a value is missing fallback to 0
  const data = traits.map((t) => ({ subject: t, A: Number(ocean?.[t as keyof typeof ocean] ?? 0) }));

  // Helper: convert raw value to percent (assume 0-100 scale; clamp)
  const toPercent = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

  return (
    <Card className="w-full max-w-4xl mx-auto border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Your OCEAN</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Left: textual summary */}
          <div className="space-y-4">
            {traits.map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-8 text-sm font-semibold">{t}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-sm text-gray-700">{traitLabel(t)}</div>
                    <div className="text-xs text-gray-500">{toPercent(Number(ocean?.[t as keyof typeof ocean] ?? 0))}%</div>
                  </div>
                  <Progress value={toPercent(Number(ocean?.[t as keyof typeof ocean] ?? 0))} className="h-2" />
                </div>
              </div>
            ))}

            <div className="pt-2 text-xs text-gray-500">This chart visualizes the relative strengths across the five traits.</div>
          </div>

          {/* Right: Radar Chart */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-[420px] h-64 md:h-[420px]" role="img" aria-label="OCEAN radar chart">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart outerRadius={"80%"} data={data}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} />
                  <Radar name="OCEAN" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
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

export default OceanRadarChart;