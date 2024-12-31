import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

interface QuizResult {
  quiz_date: string
  score: number
  category_id: string
}

interface QuizScoreChartProps {
  results: QuizResult[]
}

export default function QuizScoreChart({ results }: QuizScoreChartProps) {
  // Formater les données pour le graphique
  const chartData = results.map(result => ({
    date: new Date(result.quiz_date).toLocaleDateString(),
    score: result.score * 10, // Convertir en score sur 10
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          tickFormatter={(value) => value}
        />
        <YAxis
          domain={[0, 10]}
          ticks={[0, 2, 4, 6, 8, 10]}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '8px',
            border: '1px solid #e2e8f0',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#8b5cf6"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          name="Score sur 10"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
