import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface AudiobookProgress {
  audiobook_id: string
  progress: number
  audiobook: {
    title: string
  }
}

interface AudiobookProgressChartProps {
  progress: AudiobookProgress[]
}

export default function AudiobookProgressChart({ progress }: AudiobookProgressChartProps) {
  // Formater les données pour le graphique
  const chartData = progress.map(item => ({
    name: item.audiobook.title,
    progress: item.progress,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        layout="vertical"
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 12 }}
        />
        <YAxis
          dataKey="name"
          type="category"
          tick={{ fontSize: 12 }}
          width={150}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '8px',
            border: '1px solid #e2e8f0',
          }}
          formatter={(value: number) => [`${value}%`, 'Progression']}
        />
        <Legend />
        <Bar
          dataKey="progress"
          fill="#8b5cf6"
          name="Progression (%)"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
