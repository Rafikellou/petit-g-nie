'use client';

import { FC, useState } from 'react';
import { Database, Table, BarChart2, RefreshCw } from 'lucide-react';
import { DatabaseStats } from '@/types/admin';

interface DatabaseViewerProps {
  stats: DatabaseStats;
  onRefresh: () => void;
}

export const DatabaseViewer: FC<DatabaseViewerProps> = ({ stats, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'tables' | 'performance'>('tables');

  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">Base de données</h3>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/70">Espace total</div>
          <div className="text-xl font-semibold mt-1">{stats.storage.total}</div>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/70">Espace utilisé</div>
          <div className="text-xl font-semibold mt-1">{stats.storage.used}</div>
        </div>
        <div className="flex-1 bg-white/5 rounded-lg p-4">
          <div className="text-sm text-white/70">Espace libre</div>
          <div className="text-xl font-semibold mt-1">{stats.storage.free}</div>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={() => setActiveTab('tables')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            activeTab === 'tables' ? 'bg-purple-500' : 'hover:bg-white/10'
          }`}
        >
          <Table className="w-5 h-5" />
          Tables
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-4 py-2 rounded transition-colors ${
            activeTab === 'performance' ? 'bg-purple-500' : 'hover:bg-white/10'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          Performance
        </button>
      </div>

      {activeTab === 'tables' ? (
        <div className="space-y-4">
          {stats.tables.map((table) => (
            <div
              key={table.name}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
            >
              <div>
                <div className="font-medium">{table.name}</div>
                <div className="text-sm text-white/70">
                  {table.rowCount.toLocaleString()} lignes
                </div>
              </div>
              <div className="text-right">
                <div>{table.size}</div>
                <div className="text-sm text-white/70">
                  Mis à jour {new Date(table.lastUpdated).toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <div className="text-sm text-white/70 mb-2">Temps moyen des requêtes</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-semibold">
                {stats.performance.avgQueryTime}
              </div>
              <div className="text-white/70">ms</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-white/70 mb-2">Connexions actives</div>
            <div className="text-2xl font-semibold">
              {stats.performance.activeConnections}
            </div>
          </div>

          <div>
            <div className="text-sm text-white/70 mb-2">Requêtes lentes</div>
            <div className="text-2xl font-semibold text-yellow-400">
              {stats.performance.slowQueries}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
