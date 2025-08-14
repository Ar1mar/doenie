import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Cow } from '../types';

interface CowModalProps {
  cow: Cow | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (cow: Omit<Cow, 'id'>) => void;
  isAddMode: boolean;
}

export const CowModal: React.FC<CowModalProps> = ({ cow, isOpen, onClose, onSave, isAddMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    tagId: '',
    lastMilking: '',
    dailyYield: 0,
    avgYield: 0,
    health: 'good' as Cow['health'],
    location: 'pasture' as Cow['location']
  });

  useEffect(() => {
    if (cow && !isAddMode) {
      setFormData({
        name: cow.name,
        tagId: cow.tagId,
        lastMilking: cow.lastMilking,
        dailyYield: cow.dailyYield,
        avgYield: cow.avgYield,
        health: cow.health,
        location: cow.location
      });
    } else if (isAddMode) {
      setFormData({
        name: '',
        tagId: '',
        lastMilking: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        dailyYield: 0,
        avgYield: 25,
        health: 'good',
        location: 'pasture'
      });
    }
  }, [cow, isAddMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {isAddMode ? 'Добавить корову' : 'Редактировать корову'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя коровы
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              RFID Метка
            </label>
            <input
              type="text"
              value={formData.tagId}
              onChange={(e) => setFormData({ ...formData, tagId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Суточный надой (л)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.dailyYield}
                onChange={(e) => setFormData({ ...formData, dailyYield: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Средний надой (л)
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.avgYield}
                onChange={(e) => setFormData({ ...formData, avgYield: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Состояние здоровья
            </label>
            <select
              value={formData.health}
              onChange={(e) => setFormData({ ...formData, health: e.target.value as Cow['health'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="excellent">Отлично</option>
              <option value="good">Хорошо</option>
              <option value="attention">Требует внимания</option>
              <option value="poor">Плохо</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Местоположение
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value as Cow['location'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="pasture">На пастбище</option>
              <option value="waiting">В очереди</option>
              <option value="milking">Доится</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
            >
              {isAddMode ? 'Добавить' : 'Сохранить'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};