import React from 'react';
import { TrendingUp, Activity, Clock, Cog } from 'lucide-react';
import { Robot, Cow, MilkingSession } from '../types';
import { StatCard } from './StatCard';

interface DashboardProps {
  robots: Robot[];
  cows: Cow[];
  recentSessions: MilkingSession[];
  currentTime: Date;
}

export const Dashboard: React.FC<DashboardProps> = ({ robots, cows, recentSessions, currentTime }) => {
  const totalYieldToday = cows.reduce((sum, cow) => sum + cow.dailyYield, 0);
  const activeRobots = robots.filter(r => r.status === 'active').length;
  const totalSessions = robots.reduce((sum, robot) => sum + robot.sessionsToday, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Панель управления</h1>
          <p className="text-gray-600">Мониторинг автоматизированной системы доения</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Текущее время</p>
          <p className="text-lg font-semibold text-gray-900">
            {currentTime.toLocaleTimeString('ru-RU')}
          </p>
          <p className="text-sm text-gray-500">
            {currentTime.toLocaleDateString('ru-RU')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Суточный надой"
          value={`${totalYieldToday.toFixed(1)}л`}
          subtitle="+12% к вчерашнему"
          icon={TrendingUp}
          color="green"
        />
        <StatCard 
          title="Активные роботы"
          value={`${activeRobots}/4`}
          subtitle="В работе сейчас"
          icon={Activity}
          color="blue"
        />
        <StatCard 
          title="Сессии доения"
          value={totalSessions.toString()}
          subtitle="За сегодня"
          icon={Clock}
          color="orange"
        />
        <StatCard 
          title="Коровы в очереди"
          value={cows.filter(c => c.location === 'waiting').length.toString()}
          subtitle="Ожидают доения"
          icon={Cog}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Состояние роботов</h3>
          <div className="space-y-4">
            {robots.map(robot => (
              <div key={robot.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    robot.status === 'active' ? 'bg-green-500 animate-pulse' :
                    robot.status === 'idle' ? 'bg-blue-500' :
                    robot.status === 'maintenance' ? 'bg-yellow-500' :
                    'bg-red-500 animate-pulse'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{robot.name}</p>
                    <p className="text-sm text-gray-600">
                      {robot.currentCow ? `Доит корову ${robot.currentCow}` : 
                       robot.status === 'maintenance' ? 'Техобслуживание' :
                       robot.status === 'error' ? 'Требует внимания' :
                       'Ожидает'}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(robot.status)}`}>
                  {robot.status === 'active' ? 'Активен' :
                   robot.status === 'idle' ? 'Ожидает' :
                   robot.status === 'maintenance' ? 'ТО' :
                   'Ошибка'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Последние сессии</h3>
          <div className="space-y-4">
            {recentSessions.map(session => {
              const cow = cows.find(c => c.id === session.cowId);
              return (
                <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{cow?.name}</p>
                    <p className="text-sm text-gray-600">{session.startTime} • {session.duration} мин</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{session.yield}л</p>
                    <div className={`inline-block px-2 py-1 rounded text-xs ${
                      session.quality === 'excellent' ? 'bg-green-100 text-green-700' :
                      session.quality === 'good' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {session.quality === 'excellent' ? 'Отлично' :
                       session.quality === 'good' ? 'Хорошо' : 'Средне'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};