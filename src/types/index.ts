export interface Robot {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'error';
  currentCow?: string;
  lastMaintenance: string;
  sessionsToday: number;
}

export interface Cow {
  id: string;
  name: string;
  tagId: string;
  lastMilking: string;
  dailyYield: number;
  avgYield: number;
  health: 'excellent' | 'good' | 'attention' | 'poor';
  location: 'waiting' | 'milking' | 'pasture';
}

export interface MilkingSession {
  id: string;
  cowId: string;
  robotId: string;
  startTime: string;
  duration: number;
  yield: number;
  quality: 'excellent' | 'good' | 'poor';
}