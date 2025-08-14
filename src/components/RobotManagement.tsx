import React, { useState } from 'react';
import { Activity, AlertTriangle, Settings, Play, Pause, Wrench, RotateCcw } from 'lucide-react';
import { Robot } from '../types';

interface RobotManagementProps {
  robots: Robot[];
  onUpdateRobot: (robot: Robot) => void;
}

export const RobotManagement: React.FC<RobotManagementProps> = ({ robots, onUpdateRobot }) => {
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-blue-600 bg-blue-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleStartRobot = (robot: Robot) => {
    if (robot.status === 'error') {
      alert('Невозможно запустить робота с ошибкой. Сначала выполните диагностику.');
      return;
    }
    onUpdateRobot({ ...robot, status: 'active' });
  };

  const handleStopRobot = (robot: Robot) => {
    if (robot.status === 'active' && robot.currentCow) {
      if (!window.confirm('Робот сейчас доит корову. Вы уверены, что хотите остановить его?')) {
        return;
      }
    }
    onUpdateRobot({ ...robot, status: 'idle', currentCow: undefined });
  };

  const handleMaintenance = (robot: Robot) => {
    if (robot.status === 'active' && robot.currentCow) {
      alert('Невозможно перевести в режим обслуживания активного робота. Сначала остановите его.');
      return;
    }
    onUpdateRobot({ 
      ...robot, 
      status: 'maintenance',
      lastMaintenance: new Date().toISOString().split('T')[0],
      currentCow: undefined
    });
  };

  const handleDiagnostics = (robot: Robot) => {
    setSelectedRobot(robot.id);
    // Симуляция диагностики
    setTimeout(() => {
      const isHealthy = Math.random() > 0.3; // 70% шанс что все в порядке
      if (isHealthy) {
        onUpdateRobot({ ...robot, status: 'idle' });
        alert(`Диагностика ${robot.name} завершена. Все системы в норме.`);
      } else {
        alert(`Диагностика ${robot.name} выявила проблемы. Требуется техническое обслуживание.`);
      }
      setSelectedRobot(null);
    }, 2000);
  };

  const handleReset = (robot: Robot) => {
    if (!window.confirm('Вы уверены, что хотите перезагрузить робота? Это может занять несколько минут.')) {
      return;
    }
    onUpdateRobot({ ...robot, status: 'maintenance' });
    setTimeout(() => {
      onUpdateRobot({ ...robot, status: 'idle', currentCow: undefined });
    }, 3000);
  };

  return (
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

              {selectedRobot === robot.id && (
                <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-sm font-medium text-blue-800">
                      Выполняется диагностика...
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                {robot.status === 'idle' || robot.status === 'error' ? (
                  <button
                    onClick={() => handleStartRobot(robot)}
                    disabled={robot.status === 'error'}
                    className="flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                  >
                    <Play size={16} />
                    <span>Запустить</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStopRobot(robot)}
                    className="flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                  >
                    <Pause size={16} />
                    <span>Остановить</span>
                  </button>
                )}

                <button
                  onClick={() => handleMaintenance(robot)}
                  disabled={robot.status === 'active' && !!robot.currentCow}
                  className="flex items-center justify-center space-x-2 bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                >
                  <Wrench size={16} />
                  <span>ТО</span>
                </button>

                <button
                  onClick={() => handleDiagnostics(robot)}
                  disabled={selectedRobot === robot.id}
                  className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 text-sm font-medium"
                >
                  <Settings size={16} />
                  <span>Диагностика</span>
                </button>

                <button
                  onClick={() => handleReset(robot)}
                  className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                >
                  <RotateCcw size={16} />
                  <span>Сброс</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};