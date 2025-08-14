import React, { useState, useEffect } from 'react';
import { Activity, Monitor, Cog, BarChart3, Settings } from 'lucide-react';
import { Robot, Cow, MilkingSession } from './types';
import { Dashboard } from './components/Dashboard';
import { CowManagement } from './components/CowManagement';
import { RobotManagement } from './components/RobotManagement';
import { Analytics } from './components/Analytics';
import { Settings as SettingsComponent } from './components/Settings';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [robots, setRobots] = useState<Robot[]>([
    { id: 'R001', name: 'Робот Alpha', status: 'active', currentCow: 'C123', lastMaintenance: '2025-01-14', sessionsToday: 18 },
    { id: 'R002', name: 'Робот Beta', status: 'idle', lastMaintenance: '2025-01-13', sessionsToday: 22 },
    { id: 'R003', name: 'Робот Gamma', status: 'maintenance', lastMaintenance: '2025-01-12', sessionsToday: 15 },
    { id: 'R004', name: 'Робот Delta', status: 'error', lastMaintenance: '2025-01-11', sessionsToday: 8 }
  ]);

  const [cows, setCows] = useState<Cow[]>([
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

  // Симуляция обновления данных роботов
  useEffect(() => {
    const interval = setInterval(() => {
      setRobots(prevRobots => 
        prevRobots.map(robot => {
          if (robot.status === 'active' && Math.random() < 0.1) {
            // 10% шанс завершить сессию
            return {
              ...robot,
              currentCow: undefined,
              sessionsToday: robot.sessionsToday + 1
            };
          }
          if (robot.status === 'idle' && Math.random() < 0.05) {
            // 5% шанс начать новую сессию
            const waitingCow = cows.find(c => c.location === 'waiting');
            if (waitingCow) {
              return {
                ...robot,
                status: 'active',
                currentCow: waitingCow.id
              };
            }
          }
          return robot;
        })
      );
    }, 10000); // Обновление каждые 10 секунд

    return () => clearInterval(interval);
  }, [cows]);

  const handleUpdateRobot = (updatedRobot: Robot) => {
    setRobots(prevRobots => 
      prevRobots.map(robot => 
        robot.id === updatedRobot.id ? updatedRobot : robot
      )
    );
  };

  const handleUpdateCow = (updatedCow: Cow) => {
    setCows(prevCows => 
      prevCows.map(cow => 
        cow.id === updatedCow.id ? updatedCow : cow
      )
    );
  };

  const handleDeleteCow = (cowId: string) => {
    setCows(prevCows => prevCows.filter(cow => cow.id !== cowId));
  };

  const handleAddCow = (newCowData: Omit<Cow, 'id'>) => {
    const newCow: Cow = {
      ...newCowData,
      id: `C${Date.now().toString().slice(-3)}`
    };
    setCows(prevCows => [...prevCows, newCow]);
  };

  const handleSaveSettings = (settings: any) => {
    console.log('Настройки сохранены:', settings);
    // Здесь можно добавить логику сохранения настроек в localStorage или отправки на сервер
    localStorage.setItem('milkingSystemSettings', JSON.stringify(settings));
  };

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

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': 
        return <Dashboard robots={robots} cows={cows} recentSessions={recentSessions} currentTime={currentTime} />;
      case 'cows': 
        return <CowManagement cows={cows} onUpdateCow={handleUpdateCow} onDeleteCow={handleDeleteCow} onAddCow={handleAddCow} />;
      case 'robots': 
        return <RobotManagement robots={robots} onUpdateRobot={handleUpdateRobot} />;
      case 'analytics': 
        return <Analytics robots={robots} cows={cows} />;
      case 'settings': 
        return <SettingsComponent onSaveSettings={handleSaveSettings} />;
      default: 
        return <Dashboard robots={robots} cows={cows} recentSessions={recentSessions} currentTime={currentTime} />;
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