'use client';

import { FC } from 'react';
import { Brain, DollarSign, Zap, Clock } from 'lucide-react';
import { AIUsageStats as AIStats } from '@/types/admin';

interface AIUsageStatsProps {
  stats: AIStats;
  onRefresh: () => void;
}

export const AIUsageStats: FC<AIUsageStatsProps> = ({ stats, onRefresh }) => {
  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Utilisation de l'IA</h3>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Zap className="w-4 h-4" />
            <span>Requêtes totales</span>
          </div>
          <div className="text-2xl font-semibold">
            {stats.totalRequests.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <Clock className="w-4 h-4" />
            <span>Tokens utilisés</span>
          </div>
          <div className="text-2xl font-semibold">
            {stats.tokensUsed.toLocaleString()}
          </div>
        </div>

        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 text-white/70 mb-2">
            <DollarSign className="w-4 h-4" />
            <span>Coût estimé</span>
          </div>
          <div className="text-2xl font-semibold">
            {stats.costEstimate.toFixed(2)}€
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="text-white/70 mb-4">Endpoints populaires</h4>
          <div className="space-y-3">
            {stats.popularEndpoints.map((endpoint) => (
              <div
                key={endpoint.endpoint}
                className="flex items-center justify-between p-3 bg-white/5 rounded"
              >
                <div>
                  <div className="font-medium">{endpoint.endpoint}</div>
                  <div className="text-sm text-white/70">
                    {endpoint.calls.toLocaleString()} appels
                  </div>
                </div>
                <div className="text-right">
                  <div>{endpoint.avgLatency}ms</div>
                  <div className="text-sm text-white/70">latence moyenne</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white/70 mb-4">Utilisation journalière</h4>
          <div className="space-y-2">
            {stats.dailyUsage.map((day) => (
              <div
                key={day.date}
                className="flex items-center gap-4 p-3 bg-white/5 rounded"
              >
                <div className="w-24">
                  {new Date(day.date).toLocaleDateString('fr-FR')}
                </div>
                <div className="flex-1">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{
                        width: `${(day.tokens / stats.tokensUsed) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div>{day.requests.toLocaleString()} req.</div>
                  <div className="text-sm text-white/70">
                    {day.tokens.toLocaleString()} tokens
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
