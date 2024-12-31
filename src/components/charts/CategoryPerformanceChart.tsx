import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip
} from 'recharts'

interface CategoryScore {
  category: string
  averageScore: number
}

interface CategoryPerformanceChartProps {
  scores: CategoryScore[]
}

export default function CategoryPerformanceChart({ scores }: CategoryPerformanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scores}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 12 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 10]}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '8px',
            border: '1px solid #e2e8f0',
          }}
          formatter={(value: number) => [`${value}/10`, 'Score moyen']}
        />
        <Radar
          name="Score"
          dataKey="averageScore"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
