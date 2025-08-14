import React, { useState } from 'react';
import { Camera, Cog, Activity, Clock, CheckCircle, Edit, Trash2, Plus } from 'lucide-react';
import { Cow } from '../types';
import { CowModal } from './CowModal';

interface CowManagementProps {
  cows: Cow[];
  onUpdateCow: (cow: Cow) => void;
  onDeleteCow: (cowId: string) => void;
  onAddCow: (cow: Omit<Cow, 'id'>) => void;
}

export const CowManagement: React.FC<CowManagementProps> = ({ cows, onUpdateCow, onDeleteCow, onAddCow }) => {
  const [selectedCow, setSelectedCow] = useState<Cow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'attention': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleEditCow = (cow: Cow) => {
    setSelectedCow(cow);
    setIsAddMode(false);
    setIsModalOpen(true);
  };

  const handleAddCow = () => {
    setSelectedCow(null);
    setIsAddMode(true);
    setIsModalOpen(true);
  };

  const handleDeleteCow = (cowId: string) => {
    if (window.confirm('Вы уверены, что хотите удалить эту корову из системы?')) {
      onDeleteCow(cowId);
    }
  };

  const handleSaveCow = (cowData: Omit<Cow, 'id'>) => {
    if (isAddMode) {
      onAddCow(cowData);
    } else if (selectedCow) {
      onUpdateCow({ ...cowData, id: selectedCow.id });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Управление стадом</h1>
          <p className="text-gray-600">Мониторинг коров и система идентификации</p>
        </div>
        <button
          onClick={handleAddCow}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Добавить корову</span>
        </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCow(cow)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCow(cow.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <CowModal
          cow={selectedCow}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveCow}
          isAddMode={isAddMode}
        />
      )}
    </div>
  );
};