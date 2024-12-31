'use client'

interface ProgressData {
  topic: string
  total: number
  completed: number
  percentage: number
}

interface ProgressChartProps {
  data: ProgressData[]
}

export default function ProgressChart({ data }: ProgressChartProps) {
  return (
    <div className="glass-card p-6">
      <h2 className="text-xl font-semibold text-gradient mb-6">Progression par compétence</h2>
      
      <div className="space-y-6">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80">{item.topic}</span>
              <span className="text-sm text-white/60">
                {item.completed}/{item.total} ({item.percentage}%)
              </span>
            </div>
            <div className="h-2 bg-[var(--background-light)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-500"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
