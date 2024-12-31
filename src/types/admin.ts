export interface ExternalService {
  id: string;
  name: string;
  type: 'ai' | 'database' | 'storage' | 'analytics';
  status: 'active' | 'inactive' | 'error';
  config: {
    apiKey?: string;
    endpoint?: string;
    region?: string;
    [key: string]: any;
  };
  lastChecked: string;
  healthStatus: {
    status: 'healthy' | 'degraded' | 'down';
    message?: string;
    latency?: number;
  };
}

export interface DatabaseStats {
  tables: {
    name: string;
    rowCount: number;
    size: string;
    lastUpdated: string;
  }[];
  storage: {
    total: string;
    used: string;
    free: string;
  };
  performance: {
    avgQueryTime: number;
    activeConnections: number;
    slowQueries: number;
  };
}

export interface AIUsageStats {
  totalRequests: number;
  tokensUsed: number;
  costEstimate: number;
  popularEndpoints: {
    endpoint: string;
    calls: number;
    avgLatency: number;
  }[];
  dailyUsage: {
    date: string;
    requests: number;
    tokens: number;
  }[];
}

export interface StorageStats {
  totalSize: string;
  fileCount: number;
  byType: {
    type: string;
    count: number;
    size: string;
  }[];
  recentUploads: {
    filename: string;
    size: string;
    uploadedAt: string;
    type: string;
  }[];
}

export const EXTERNAL_SERVICES: ExternalService[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    type: 'ai',
    status: 'active',
    config: {
      apiKey: process.env.OPENAI_API_KEY || '',
      model: 'gpt-4',
      maxTokens: 2000
    },
    lastChecked: '2024-12-08T00:00:00Z',
    healthStatus: {
      status: 'healthy',
      latency: 245
    }
  },
  {
    id: 'supabase',
    name: 'Supabase',
    type: 'database',
    status: 'active',
    config: {
      url: process.env.SUPABASE_URL || '',
      apiKey: process.env.SUPABASE_API_KEY || '',
      region: 'eu-west-1'
    },
    lastChecked: '2024-12-08T00:00:00Z',
    healthStatus: {
      status: 'healthy',
      latency: 89
    }
  },
  {
    id: 'cloudinary',
    name: 'Cloudinary',
    type: 'storage',
    status: 'active',
    config: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
      apiKey: process.env.CLOUDINARY_API_KEY || '',
      apiSecret: process.env.CLOUDINARY_API_SECRET || ''
    },
    lastChecked: '2024-12-08T00:00:00Z',
    healthStatus: {
      status: 'healthy',
      latency: 156
    }
  }
];
