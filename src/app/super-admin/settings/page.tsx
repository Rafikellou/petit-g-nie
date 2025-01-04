'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ServiceCard } from '@/components/admin/ServiceCard';
import { DatabaseViewer } from '@/components/admin/DatabaseViewer';
import { AIUsageStats } from '@/components/admin/AIUsageStats';
import { DatabaseStats, AIUsageStats as AIStats } from '@/types/admin';
import { Settings } from 'lucide-react';
import { Database } from 'lucide-react';
import { Brain } from 'lucide-react';
import { HardDrive } from 'lucide-react';

type HealthStatus = 'healthy' | 'degraded' | 'down';

type ExternalService = {
  id: string;
  name: string;
  type: 'ai' | 'database' | 'storage' | 'analytics';
  status: 'active' | 'inactive' | 'error';
  lastChecked: string;
  healthStatus: {
    status: HealthStatus;
    latency: number;
  };
  config: {
    apiKey?: string;
    endpoint?: string;
    region?: string;
    [key: string]: any;
  };
};

const EXTERNAL_SERVICES: ExternalService[] = [
  {
    id: 'service-1',
    name: 'Service 1',
    type: 'ai',
    status: 'active',
    lastChecked: '2024-12-07T15:30:00Z',
    healthStatus: {
      status: 'healthy',
      latency: 100
    },
    config: {
      apiKey: 'api-key-1',
      endpoint: 'https://api.service1.com'
    }
  },
  {
    id: 'service-2',
    name: 'Service 2',
    type: 'database',
    status: 'active',
    lastChecked: '2024-12-07T15:30:00Z',
    healthStatus: {
      status: 'healthy',
      latency: 50
    },
    config: {
      endpoint: 'https://database.service2.com',
      region: 'us-west-1'
    }
  },
  {
    id: 'service-3',
    name: 'Service 3',
    type: 'storage',
    status: 'active',
    lastChecked: '2024-12-07T15:30:00Z',
    healthStatus: {
      status: 'healthy',
      latency: 200
    },
    config: {
      apiKey: 'api-key-3',
      endpoint: 'https://storage.service3.com'
    }
  }
];

export default function AdminSettingsPage() {
  const [services, setServices] = useState<ExternalService[]>(EXTERNAL_SERVICES);
  const [dbStats, setDbStats] = useState<DatabaseStats>({
    tables: [
      {
        name: 'users',
        rowCount: 1250,
        size: '2.3 MB',
        lastUpdated: '2024-12-07T15:30:00Z'
      },
      {
        name: 'stories',
        rowCount: 3420,
        size: '8.7 MB',
        lastUpdated: '2024-12-08T00:15:00Z'
      },
      {
        name: 'activities',
        rowCount: 15680,
        size: '12.4 MB',
        lastUpdated: '2024-12-08T01:00:00Z'
      }
    ],
    storage: {
      total: '1 GB',
      used: '456 MB',
      free: '544 MB'
    },
    performance: {
      avgQueryTime: 123,
      activeConnections: 8,
      slowQueries: 2
    }
  });

  const [aiStats, setAiStats] = useState<AIStats>({
    totalRequests: 12450,
    tokensUsed: 1250000,
    costEstimate: 25.80,
    popularEndpoints: [
      {
        endpoint: '/api/generate-story',
        calls: 4520,
        avgLatency: 850
      },
      {
        endpoint: '/api/generate-image',
        calls: 2840,
        avgLatency: 1200
      },
      {
        endpoint: '/api/analyze-text',
        calls: 1980,
        avgLatency: 450
      }
    ],
    dailyUsage: [
      {
        date: '2024-12-01',
        requests: 1200,
        tokens: 120000
      },
      {
        date: '2024-12-02',
        requests: 1450,
        tokens: 145000
      },
      {
        date: '2024-12-03',
        requests: 980,
        tokens: 98000
      }
    ]
  });

  const handleServiceUpdate = (serviceId: string, newConfig: ExternalService['config']) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, config: newConfig }
        : service
    ));
  };

  const handleServiceRefresh = async (serviceId: string) => {
    // Simuler une vérification du service
    const service = services.find(s => s.id === serviceId);
    if (service) {
      const updatedService: ExternalService = {
        ...service,
        lastChecked: new Date().toISOString(),
        healthStatus: {
          status: Math.random() > 0.1 ? 'healthy' : 'degraded',
          latency: Math.floor(Math.random() * 500)
        }
      };
      setServices(services.map(s =>
        s.id === serviceId ? updatedService : s
      ));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-bold">Console d'Administration</h1>
      </div>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="bg-white/5 p-1 rounded-lg">
          <TabsTrigger
            value="services"
            className="flex items-center gap-2 data-[state=active]:bg-purple-500"
          >
            <Settings className="w-4 h-4" />
            Services Externes
          </TabsTrigger>
          <TabsTrigger
            value="database"
            className="flex items-center gap-2 data-[state=active]:bg-purple-500"
          >
            <Database className="w-4 h-4" />
            Base de données
          </TabsTrigger>
          <TabsTrigger
            value="ai"
            className="flex items-center gap-2 data-[state=active]:bg-purple-500"
          >
            <Brain className="w-4 h-4" />
            Intelligence Artificielle
          </TabsTrigger>
          <TabsTrigger
            value="storage"
            className="flex items-center gap-2 data-[state=active]:bg-purple-500"
          >
            <HardDrive className="w-4 h-4" />
            Stockage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onConfigUpdate={handleServiceUpdate}
              onRefresh={handleServiceRefresh}
            />
          ))}
        </TabsContent>

        <TabsContent value="database">
          <DatabaseViewer
            stats={dbStats}
            onRefresh={() => {
              // Simuler un rafraîchissement des stats
              setDbStats({
                ...dbStats,
                performance: {
                  ...dbStats.performance,
                  activeConnections: Math.floor(Math.random() * 20)
                }
              });
            }}
          />
        </TabsContent>

        <TabsContent value="ai">
          <AIUsageStats
            stats={aiStats}
            onRefresh={() => {
              // Simuler un rafraîchissement des stats
              setAiStats({
                ...aiStats,
                totalRequests: aiStats.totalRequests + Math.floor(Math.random() * 100)
              });
            }}
          />
        </TabsContent>

        <TabsContent value="storage">
          <div className="bg-white/5 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Stockage</h3>
            {/* TODO: Implémenter la vue stockage */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
