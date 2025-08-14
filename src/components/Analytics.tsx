import React, { useState } from 'react';
import { BarChart3, Download, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Robot, Cow } from '../types';

interface AnalyticsProps {
  robots: Robot[];
  cows: Cow[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ robots, cows }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [isExporting, setIsExporting] = useState(false);

  const totalYieldToday = cows.reduce((sum, cow) => sum + cow.dailyYield, 0);
  const activeRobots = robots.filter(r => r.status === 'active').length;

  const weeklyData = [
    { day: 'Понедельник', yield: 245, sessions: 52, efficiency: 85 },
    { day: 'Вторник', yield: 267, sessions: 58, efficiency: 92 },
    { day: 'Среда', yield: 289, sessions: 61, efficiency: 100 },
    { day: 'Четверг', yield: 234, sessions: 49, efficiency: 81 },
    { day: 'Пятница', yield: 278, sessions: 59, efficiency: 96 },
    { day: 'Суббота', yield: 256, sessions: 54, efficiency: 89 },
    { day: 'Сегодня', yield: Math.round(totalYieldToday), sessions: 45, efficiency: 88 }
  ];

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    
    // Симуляция экспорта
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const data = {
      period: selectedPeriod,
      totalYield: totalYieldToday,
      activeRobots,
      weeklyData,
      exportDate: new Date().toISOString(),
      format
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milking-report-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'json' : 'json'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    alert(`Отчет успешно экспортирован в формате ${format.toUpperCase()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Аналитика и отчеты</h1>
          <p className="text-gray-600">Статистика производительности системы</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="day">За день</option>
            <option value="week">За неделю</option>
            <option value="month">За месяц</option>
            <option value="year">За год</option>
          </select>
          <div className="flex space-x-2">
            <button
              onClick={() => handleExport('pdf')}
              disabled={isExporting}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Download size={16} />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              disabled={isExporting}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Download size={16} />
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {isExporting && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-blue-800">
              Подготовка отчета для экспорта...
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Общий надой</p>
              <p className="text-2xl font-bold text-gray-900">{totalYieldToday.toFixed(1)}л</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-sm text-green-600">+12%</span>
              </div>
            </div>
            <BarChart3 className="text-blue-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Среднее время</p>
              <p className="text-2xl font-bold text-gray-900">7.5 мин</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="text-red-500 mr-1" size={16} />
                <span className="text-sm text-red-600">-0.3 мин</span>
              </div>
            </div>
            <Calendar className="text-orange-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Эффективность</p>
              <p className="text-2xl font-bold text-gray-900">94%</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="text-green-500 mr-1" size={16} />
                <span className="text-sm text-green-600">+2%</span>
              </div>
            </div>
            <TrendingUp className="text-green-600" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Время простоя</p>
              <p className="text-2xl font-bold text-gray-900">0.8 ч</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="text-green-500 mr-1" size={16} />
                <span className="text-sm text-green-600">-0.2 ч</span>
              </div>
            </div>
            <Calendar className="text-red-600" size={24} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Качество молока</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Отличное качество:</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
                <span className="font-semibold text-green-600">78%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Хорошее качество:</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                <span className="font-semibold text-blue-600">20%</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Требует внимания:</span>
              <div className="flex items-center space-x-2">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '2%' }}></div>
                </div>
                <span className="font-semibold text-yellow-600">2%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Производительность роботов</h3>
          <div className="space-y-3">
            {robots.map(robot => (
              <div key={robot.id} className="flex justify-between items-center">
                <span className="text-gray-600">{robot.name}:</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        robot.status === 'active' ? 'bg-green-600' :
                        robot.status === 'idle' ? 'bg-blue-600' :
                        robot.status === 'maintenance' ? 'bg-yellow-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${(robot.sessionsToday / 25) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-semibold text-gray-900">{robot.sessionsToday}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Тренды производительности</h3>
        <div className="space-y-4">
          {weeklyData.map((data, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{data.day}</span>
                <div className="flex space-x-4">
                  <span className="font-medium">{data.yield}л</span>
                  <span className="text-gray-500">{data.sessions} сессий</span>
                  <span className="text-gray-500">{data.efficiency}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    data.efficiency >= 95 ? 'bg-green-600' :
                    data.efficiency >= 85 ? 'bg-blue-600' :
                    'bg-yellow-600'
                  }`}
                  style={{ width: `${data.efficiency}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};