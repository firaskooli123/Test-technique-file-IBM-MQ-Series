export interface Partner {
  id: number;
  alias: string;
  type: string;
  direction: 'INBOUND' | 'OUTBOUND';
  application?: string;
  processed_flow_type: 'MESSAGE' | 'ALERTING' | 'NOTIFICATION';
  description: string;
  created_at: string;
  updated_at: string;
} 