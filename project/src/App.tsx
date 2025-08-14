import React, { useState, useEffect } from 'react';
import { Activity, Camera, Settings, BarChart3, Clock, AlertTriangle, CheckCircle, XCircle, Zap, Cog, Monitor, Calendar, TrendingUp, Bell } from 'lucide-react';

interface Robot {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'maintenance' | 'error';
  currentCow?: string;
  lastMaintenance: string;
  sessionsToday: number;
}

interface Cow {
  id: string;
  name: string;
  tagId: string;
  lastMilking: string;
  dailyYield: number;
  avgYield: number;
  health: 'excellent' | 'good' | 'attention' | 'poor';
  location: 'waiting' | 'milking' | 'pasture';
}

interface MilkingSession {
  id: string;
  cowId: string;
  robotId: string;
  startTime: string;
  duration: number;
  yield: number;
  quality: 'excellent' | 'good' | 'poor';
}

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [robots] = useState<Robot[]>([
    { id: 'R001', name: 'Робот Alpha', status: 'active', currentCow: 'C123', lastMaintenance: '2025-01-14', sessionsToday: 18 },
    { id: 'R002', name: 'Робот Beta', status: 'idle', lastMaintenance: '2025-01-13', sessionsToday: 22 },
    { id: 'R003', name: 'Робот Gamma', status: 'maintenance', lastMaintenance: '2025-01-12', sessionsToday: 15 },
    { id: 'R004', name: 'Робот Delta', status: 'error', lastMaintenance: '2025-01-11', sessionsToday: 8 }
  ]);

  const [cows] = useState<Cow[]>([
    { id: 'C123', name: 'Буренка', tagId: 'TAG-001', lastMilking: '14:30', dailyYield: 28.5, avgYield: 26.2, health: 'excellent', location: 'milking' },
    { id: 'C124', name: 'Зорька', tagId: 'TAG-002', lastMilking: '13:45', dailyYield: 31.2, avgYield: 29.8, health: 'good', location: 'waiting' },
    { id: 'C125', name: 'Ночка', tagId: 'TAG-003', lastMilking: '12:20', dailyYield: 24.8, avgYield: 25.1, health: 'attention', location: 'pasture' },
    { id: 'C126', name: 'Майка', tagId: 'TAG-004', lastMilking: '11:15', dailyYield: 33.1, avgYield: 31.4, health: 'excellent', location: 'waiting' }
  ]);

  const [recentSessions] = useState<MilkingSession[]>([
    { id: 'S001', cowId: 'C123', robotId: 'R001', startTime: '14:30', duration: 8, yield: 12.5, quality: 'excellent' },
    { id: 'S002', cowId: 'C124', robotId: 'R002', startTime: '13:45', duration: 7, yield: 13.8, quality: 'excellent' },
    { id: 'S003', cowId: 'C125', robotId: 'R001', startTime: '12:20', duration: 9, yield: 11.2, quality: 'good' },
    { id: 'S004', cowId: 'C126', robotId: 'R004', startTime: '11:15', duration: 6, yield: 14.1, quality: 'excellent' }
  ]);

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'attention': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalYieldToday = cows.reduce((sum, cow) => sum + cow.dailyYield, 0);
  const activeRobots = robots.filter(r => r.status === 'active').length;
  const totalSessions = robots.reduce((sum, robot) => sum + robot.sessionsToday, 0);

  const MenuButton = ({ id, label, icon: Icon, active }: { id: string; label: string; icon: React.ComponentType<any>; active: boolean }) => (
    <button
      onClick={() => setCurrentView(id)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
        active 
          ? 'bg-blue-600 text-white shadow-lg' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  const StatCard = ({ title, value, subtitle, icon: Icon, color = 'blue' }: { 
    title: string; 
    value: string; 
    subtitle: string; 
    icon: React.ComponentType<any>; 
    color?: string;
  }) => {
    const colorClasses = {
      blue: 'text-blue-600 bg-blue-50',
      green: 'text-green-600 bg-green-50',
      orange: 'text-orange-600 bg-orange-50',
      red: 'text-red-600 bg-red-50'
    };

    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
            <Icon size={24} />
          </div>
        </div>
      </div>
    );
  };

  const renderDashboard = () => (
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

  const renderCows = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление стадом</h1>
        <p className="text-gray-600">Мониторинг коров и система идентификации</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-4">
            <Camera className="text-blue-600" size={24} />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Система машинного зрения</h3>
              <p className="text-sm text-gray-600">Автоматическая идентификация по меткам</p>
            </div>
            <div className="ml-auto flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">Активна</span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Корова</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">RFID Метка</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Последнее доение</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Суточный надой</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Здоровье</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Местоположение</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cows.map(cow => (
                <tr key={cow.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Cog className="text-gray-400 mr-3" size={20} />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{cow.name}</p>
                        <p className="text-sm text-gray-500">ID: {cow.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {cow.tagId}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cow.lastMilking}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cow.dailyYield}л</p>
                      <p className="text-sm text-gray-500">Ср: {cow.avgYield}л</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getHealthColor(cow.health)}`}>
                      {cow.health === 'excellent' ? 'Отлично' :
                       cow.health === 'good' ? 'Хорошо' :
                       cow.health === 'attention' ? 'Внимание' : 'Плохо'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {cow.location === 'milking' && <Activity className="text-green-500 mr-2" size={16} />}
                      {cow.location === 'waiting' && <Clock className="text-orange-500 mr-2" size={16} />}
                      {cow.location === 'pasture' && <CheckCircle className="text-blue-500 mr-2" size={16} />}
                      <span className="text-sm text-gray-900">
                        {cow.location === 'milking' ? 'Доится' :
                         cow.location === 'waiting' ? 'В очереди' :
                         'На пастбище'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderRobots = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Роботизированные системы</h1>
        <p className="text-gray-600">Управление доильными роботами</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {robots.map(robot => (
          <div key={robot.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${
                  robot.status === 'active' ? 'bg-green-100 text-green-600' :
                  robot.status === 'idle' ? 'bg-blue-100 text-blue-600' :
                  robot.status === 'maintenance' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-red-100 text-red-600'
                }`}>
                  <Activity size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{robot.name}</h3>
                  <p className="text-sm text-gray-600">Система #{robot.id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(robot.status)}`}>
                {robot.status === 'active' ? 'Активен' :
                 robot.status === 'idle' ? 'Ожидает' :
                 robot.status === 'maintenance' ? 'ТО' :
                 'Ошибка'}
              </span>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Сессии сегодня</p>
                  <p className="text-2xl font-bold text-gray-900">{robot.sessionsToday}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm font-medium text-gray-600">Последнее ТО</p>
                  <p className="text-sm font-semibold text-gray-900">{robot.lastMaintenance}</p>
                </div>
              </div>

              {robot.status === 'active' && robot.currentCow && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <p className="text-sm font-medium text-green-800">
                      Текущая сессия: Корова {robot.currentCow}
                    </p>
                  </div>
                </div>
              )}

              {robot.status === 'error' && (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="text-red-600" size={16} />
                    <p className="text-sm font-medium text-red-800">
                      Требуется техническое обслуживание
                    </p>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium">
                  Диагностика
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium">
                  Настройки
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Аналитика и отчеты</h1>
        <p className="text-gray-600">Статистика производительности системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Суточная статистика</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Общий надой:</span>
              <span className="font-semibold">{totalYieldToday.toFixed(1)}л</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Среднее время доения:</span>
              <span className="font-semibold">7.5 мин</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Эффективность:</span>
              <span className="font-semibold text-green-600">94%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Качество молока</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Отличное качество:</span>
              <span className="font-semibold text-green-600">78%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Хорошее качество:</span>
              <span className="font-semibold text-blue-600">20%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Требует внимания:</span>
              <span className="font-semibold text-yellow-600">2%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Производительность</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Роботы активны:</span>
              <span className="font-semibold">{(activeRobots/robots.length*100).toFixed(0)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Время простоя:</span>
              <span className="font-semibold">0.8 ч</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Сессий в час:</span>
              <span className="font-semibold">2.8</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Тренды производительности</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Понедельник</span>
              <span className="font-medium">245л</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Вторник</span>
              <span className="font-medium">267л</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Среда</span>
              <span className="font-medium">289л</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Четверг</span>
              <span className="font-medium">234л</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '81%' }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Сегодня</span>
              <span className="font-medium">{totalYieldToday.toFixed(0)}л</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '88%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки системы</h1>
        <p className="text-gray-600">Конфигурация автоматизированной системы доения</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Параметры доения</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Минимальный интервал между доениями (часы)
              </label>
              <input 
                type="number" 
                defaultValue="6" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Максимальное время сессии (минуты)
              </label>
              <input 
                type="number" 
                defaultValue="15" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Минимальный объем для завершения (литры)
              </label>
              <input 
                type="number" 
                step="0.1" 
                defaultValue="2.5" 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Система идентификации</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">RFID идентификация</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Визуальное распознавание</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Резервная идентификация по весу</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Уведомления</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Ошибки системы</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Техническое обслуживание</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Низкое качество молока</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                <span className="text-sm text-gray-700">Ежедневные отчеты</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Безопасность</h3>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
              Сменить пароль администратора
            </button>
            <button className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
              Экспорт данных
            </button>
            <button className="w-full border border-red-300 text-red-700 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium">
              Экстренная остановка всех роботов
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Последнее обновление системы</h3>
            <p className="text-sm text-gray-600">Версия 2.4.1 - 10 января 2025</p>
          </div>
          <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
            Проверить обновления
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'cows': return renderCows();
      case 'robots': return renderRobots();
      case 'analytics': return renderAnalytics();
      case 'settings': return renderSettings();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg border-r border-gray-200">
          <div className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AgroBot</h1>
                <p className="text-sm text-gray-600">Система доения</p>
              </div>
            </div>
          </div>

          <nav className="px-4 pb-6 space-y-2">
            <MenuButton id="dashboard" label="Панель управления" icon={Monitor} active={currentView === 'dashboard'} />
            <MenuButton id="cows" label="Управление стадом" icon={Cog} active={currentView === 'cows'} />
            <MenuButton id="robots" label="Роботы" icon={Activity} active={currentView === 'robots'} />
            <MenuButton id="analytics" label="Аналитика" icon={BarChart3} active={currentView === 'analytics'} />
            <MenuButton id="settings" label="Настройки" icon={Settings} active={currentView === 'settings'} />
          </nav>

          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Система активна</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;