'use client';

import { FC } from 'react';
import { Report } from '@/data/notifications';
import { Award, TrendingUp, Clock, AlertTriangle, CheckCircle, BookOpen } from 'lucide-react';

interface ProgressReportProps {
  report: Report;
}

export const ProgressReport: FC<ProgressReportProps> = ({ report }) => {
  return (
    <div className="space-y-8">
      {/* En-tête du rapport */}
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Rapport de progression {report.type === 'weekly' ? 'hebdomadaire' : 'mensuel'}
        </h2>
        <p className="text-white/70">
          Période : du {new Date(report.period.start).toLocaleDateString()} au{' '}
          {new Date(report.period.end).toLocaleDateString()}
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-blue-400" />
            <span className="text-white/70">Histoires terminées</span>
          </div>
          <div className="text-2xl font-bold">{report.metrics.storiesCompleted}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span className="text-white/70">Score moyen</span>
          </div>
          <div className="text-2xl font-bold">{report.metrics.averageScore}%</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
            <span className="text-white/70">Temps d'apprentissage</span>
          </div>
          <div className="text-2xl font-bold">{Math.floor(report.metrics.timeSpent / 60)}min</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-white/70">Nouveaux badges</span>
          </div>
          <div className="text-2xl font-bold">{report.metrics.newBadges.length}</div>
        </div>
      </div>

      {/* Badges obtenus */}
      {report.metrics.newBadges.length > 0 && (
        <div>
          <h3 className="text-xl font-bold mb-4">Badges obtenus</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {report.metrics.newBadges.map((badge, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <Award className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="font-medium">{badge}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Points forts et à améliorer */}
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
            Points forts
          </h3>
          <div className="space-y-2">
            {report.metrics.strengths.map((strength, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                {strength}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Points à améliorer
          </h3>
          <div className="space-y-2">
            {report.metrics.improvementAreas.map((area, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                {area}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div>
        <h3 className="text-xl font-bold mb-4">Recommandations</h3>
        <div className="space-y-2">
          {report.recommendations.map((recommendation, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              {recommendation}
            </div>
          ))}
        </div>
      </div>

      {/* Pied de page */}
      <div className="text-sm text-white/50 text-right">
        Rapport généré le {new Date(report.generatedAt).toLocaleString()}
      </div>
    </div>
  );
};

export default ProgressReport;
