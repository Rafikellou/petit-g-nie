'use client';

import { FC, useState } from 'react';
import { Settings2, Check, AlertTriangle, XOctagon, RefreshCw } from 'lucide-react';
import { ExternalService } from '@/types/admin';

interface ServiceCardProps {
  service: ExternalService;
  onConfigUpdate: (serviceId: string, newConfig: ExternalService['config']) => void;
  onRefresh: (serviceId: string) => void;
}

export const ServiceCard: FC<ServiceCardProps> = ({
  service,
  onConfigUpdate,
  onRefresh
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [config, setConfig] = useState(service.config);

  const getStatusIcon = (status: ExternalService['healthStatus']['status']) => {
    switch (status) {
      case 'healthy':
        return <Check className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'down':
        return <XOctagon className="w-5 h-5 text-red-400" />;
    }
  };

  const handleSave = () => {
    onConfigUpdate(service.id, config);
    setIsEditing(false);
  };

  const getServiceIcon = (type: ExternalService['type']) => {
    switch (type) {
      case 'ai':
        return '🤖';
      case 'database':
        return '🗄️';
      case 'storage':
        return '💾';
      case 'analytics':
        return '📊';
    }
  };

  return (
    <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getServiceIcon(service.type)}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{service.name}</h3>
            <div className="text-sm text-white/70">
              Dernière vérification : {new Date(service.lastChecked).toLocaleString('fr-FR')}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(service.healthStatus.status)}
          <button
            onClick={() => onRefresh(service.id)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {service.healthStatus.latency && (
        <div className="text-sm text-white/70 mb-4">
          Latence : {service.healthStatus.latency}ms
        </div>
      )}

      {isEditing ? (
        <div className="space-y-4">
          {Object.entries(config).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm text-white/70 mb-1">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <input
                type={key.includes('key') || key.includes('secret') ? 'password' : 'text'}
                value={value}
                onChange={(e) => setConfig({ ...config, [key]: e.target.value })}
                className="w-full p-2 bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-sm text-white/70 hover:text-white"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-purple-500 text-sm rounded hover:bg-purple-600"
            >
              Sauvegarder
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-white/70">{key}</span>
              <span className="font-mono">
                {key.includes('key') || key.includes('secret')
                  ? '••••••••'
                  : value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
