import React, { useState } from 'react';
import { Save, Shield, Download, Upload, AlertTriangle } from 'lucide-react';

interface SettingsProps {
  onSaveSettings: (settings: any) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onSaveSettings }) => {
  const [settings, setSettings] = useState({
    milking: {
      minInterval: 6,
      maxSessionTime: 15,
      minVolume: 2.5
    },
    identification: {
      rfid: true,
      visual: true,
      weight: false
    },
    notifications: {
      systemErrors: true,
      maintenance: true,
      lowQuality: false,
      dailyReports: false
    },
    system: {
      autoBackup: true,
      backupInterval: 24,
      logLevel: 'info'
    }
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Симуляция сохранения настроек
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSaveSettings(settings);
    setIsSaving(false);
    alert('Настройки успешно сохранены!');
  };

  const handleEmergencyStop = () => {
    if (showEmergencyConfirm) {
      alert('Экстренная остановка всех роботов выполнена!');
      setShowEmergencyConfirm(false);
    } else {
      setShowEmergencyConfirm(true);
      setTimeout(() => setShowEmergencyConfirm(false), 5000);
    }
  };

  const handleExportSettings = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `milking-system-settings-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          setSettings(importedSettings);
          alert('Настройки успешно импортированы!');
        } catch (error) {
          alert('Ошибка при импорте настроек. Проверьте формат файла.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Настройки системы</h1>
          <p className="text-gray-600">Конфигурация автоматизированной системы доения</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleExportSettings}
            className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Download size={16} />
            <span>Экспорт</span>
          </button>
          <label className="flex items-center space-x-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
            <Upload size={16} />
            <span>Импорт</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
          </label>
        </div>
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
                value={settings.milking.minInterval}
                onChange={(e) => setSettings({
                  ...settings,
                  milking: { ...settings.milking, minInterval: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Максимальное время сессии (минуты)
              </label>
              <input 
                type="number" 
                value={settings.milking.maxSessionTime}
                onChange={(e) => setSettings({
                  ...settings,
                  milking: { ...settings.milking, maxSessionTime: parseInt(e.target.value) }
                })}
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
                value={settings.milking.minVolume}
                onChange={(e) => setSettings({
                  ...settings,
                  milking: { ...settings.milking, minVolume: parseFloat(e.target.value) }
                })}
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
                <input 
                  type="checkbox" 
                  checked={settings.identification.rfid}
                  onChange={(e) => setSettings({
                    ...settings,
                    identification: { ...settings.identification, rfid: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">RFID идентификация</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.identification.visual}
                  onChange={(e) => setSettings({
                    ...settings,
                    identification: { ...settings.identification, visual: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Визуальное распознавание</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.identification.weight}
                  onChange={(e) => setSettings({
                    ...settings,
                    identification: { ...settings.identification, weight: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
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
                <input 
                  type="checkbox" 
                  checked={settings.notifications.systemErrors}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, systemErrors: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Ошибки системы</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.notifications.maintenance}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, maintenance: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Техническое обслуживание</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.notifications.lowQuality}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, lowQuality: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Низкое качество молока</span>
              </label>
            </div>
            <div>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.notifications.dailyReports}
                  onChange={(e) => setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, dailyReports: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Ежедневные отчеты</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Системные настройки</h3>
          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  checked={settings.system.autoBackup}
                  onChange={(e) => setSettings({
                    ...settings,
                    system: { ...settings.system, autoBackup: e.target.checked }
                  })}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" 
                />
                <span className="text-sm text-gray-700">Автоматическое резервное копирование</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Интервал резервного копирования (часы)
              </label>
              <input 
                type="number" 
                value={settings.system.backupInterval}
                onChange={(e) => setSettings({
                  ...settings,
                  system: { ...settings.system, backupInterval: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Уровень логирования
              </label>
              <select
                value={settings.system.logLevel}
                onChange={(e) => setSettings({
                  ...settings,
                  system: { ...settings.system, logLevel: e.target.value }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="error">Только ошибки</option>
                <option value="warn">Предупреждения</option>
                <option value="info">Информация</option>
                <option value="debug">Отладка</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Безопасность и управление</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={20} />
            )}
            <span>{isSaving ? 'Сохранение...' : 'Сохранить настройки'}</span>
          </button>

          <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium">
            <Shield size={20} />
            <span>Сменить пароль</span>
          </button>

          <button
            onClick={handleEmergencyStop}
            className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-lg transition-colors duration-200 font-medium ${
              showEmergencyConfirm 
                ? 'bg-red-600 text-white hover:bg-red-700' 
                : 'border border-red-300 text-red-700 hover:bg-red-50'
            }`}
          >
            <AlertTriangle size={20} />
            <span>
              {showEmergencyConfirm ? 'Подтвердить остановку' : 'Экстренная остановка'}
            </span>
          </button>
        </div>

        {showEmergencyConfirm && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Внимание! Это действие немедленно остановит все доильные роботы. 
              Нажмите кнопку еще раз в течение 5 секунд для подтверждения.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Информация о системе</h3>
            <p className="text-sm text-gray-600">Версия 2.4.1 - 10 января 2025</p>
            <p className="text-sm text-gray-600">Последнее обновление: {new Date().toLocaleDateString('ru-RU')}</p>
          </div>
          <button className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium">
            Проверить обновления
          </button>
        </div>
      </div>
    </div>
  );
};