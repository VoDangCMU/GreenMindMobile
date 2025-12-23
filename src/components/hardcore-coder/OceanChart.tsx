import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import type { IOceanTraitScore } from '@/apis/ai/calculate_ocean_score';

/**
 * OceanChart
 *
 * Presentational component that renders the radar chart for O/C/E/A/N.
 * Props:
 * - scores?: IOceanTraitScore
 * - size?: 'sm' | 'md' | 'lg'  // controls the container size
 */
const traits = ["O", "C", "E", "A", "N"];

const SIZE_CLASSES: Record<string, string> = {
  sm: 'w-full max-w-[220px] h-44 md:h-56',
  md: 'w-full max-w-[320px] h-56 md:h-[360px]',
  lg: 'w-full max-w-[420px] h-64 md:h-[420px]',
};

const OceanChart = ({ scores, size = 'md' }: { scores?: IOceanTraitScore; size?: 'sm' | 'md' | 'lg' }) => {
  const data = traits.map((t) => ({ subject: t, A: Number(scores?.[t as keyof IOceanTraitScore] ?? 0) }));
  const cls = SIZE_CLASSES[size] ?? SIZE_CLASSES.md;

  return (
    <div className={cls} role="img" aria-label="OCEAN radar chart">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart outerRadius={"80%"} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} />
          <Radar name="OCEAN" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OceanChart;
