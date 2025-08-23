import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

interface Goal {
  id?: string;
  title: string;
  description: string;
  type: 'fitness' | 'weight' | 'strength' | 'endurance' | 'habit';
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
  targetValue?: string;
  deadline?: string;
  unit?: string;
}

const CreateGoalsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [goal, setGoal] = useState<Goal>({
    title: '',
    description: '',
    type: 'fitness',
    targetValue: 0,
    currentValue: 0,
    unit: '',
    deadline: '',
    priority: 'medium',
    isActive: true
  });

  const goalTypes = [
    { value: 'fitness', label: 'General Fitness', icon: '🏃‍♂️' },
    { value: 'weight', label: 'Weight Management', icon: '⚖️' },
    { value: 'strength', label: 'Strength Training', icon: '💪' },
    { value: 'endurance', label: 'Endurance', icon: '🏃‍♀️' },
    { value: 'habit', label: 'Healthy Habit', icon: '✅' }
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' }
  ];

  const commonUnits = {
    fitness: ['workouts', 'minutes', 'hours', 'days'],
    weight: ['lbs', 'kg', 'pounds', 'kilograms'],
    strength: ['lbs', 'kg', 'reps', 'sets'],
    endurance: ['miles', 'km', 'minutes', 'hours'],
    habit: ['days', 'times', 'weeks', 'months']
  };

  const handleInputChange = (field: keyof Goal, value: string | number | boolean) => {
    setGoal(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!goal.title.trim()) {
      newErrors.title = 'Goal title is required';
    }

    if (!goal.description.trim()) {
      newErrors.description = 'Goal description is required';
    }

    if (goal.targetValue <= 0) {
      newErrors.targetValue = 'Target value must be greater than 0';
    }

    if (!goal.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (!goal.deadline) {
      newErrors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(goal.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate <= today) {
        newErrors.deadline = 'Deadline must be in the future';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      await createGoal(goal);
      
      // Navigate back to goals list or dashboard
      navigate('/goals');
    } catch (error) {
      console.error('Failed to create goal:', error);
      // Handle error (show toast, etc.)
    } finally {
      setLoading(false);
    }
  };

  // Mock API function - replace with actual API call
  const createGoal = async (goalData: Goal): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate potential API error
    if (Math.random() < 0.1) {
      throw new Error('Failed to create goal');
    }
    
    console.log('Goal created:', goalData);
  };

  const handleCancel = () => {
    navigate('/goals');
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-4xl mx-auto p-8 min-h-screen bg-gray-50">
      <div className="mb-8">
        <button 
          onClick={handleCancel} 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4 text-sm font-medium"
        >
          ← Back to Goals
        </button>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Goal</h1>
        <p className="text-lg text-gray-600">Set a new fitness goal to track your progress</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            Goal Details
          </h2>
          
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Goal Title *
            </label>
            <input
              type="text"
              id="title"
              value={goal.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Run 5K in under 30 minutes"
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 ${
                errors.title 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-4`}
            />
            {errors.title && <span className="text-red-500 text-xs mt-1 block">{errors.title}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={goal.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your goal and why it's important to you..."
              rows={3}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 resize-y min-h-[80px] ${
                errors.description 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-4`}
            />
            {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description}</span>}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Goal Type</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
              {goalTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  className={`flex flex-col items-center gap-2 p-4 border-2 rounded-xl transition-all duration-200 hover:border-blue-500 hover:-translate-y-1 hover:shadow-lg ${
                    goal.type === type.value 
                      ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-200' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onClick={() => handleInputChange('type', type.value)}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-sm font-medium text-gray-700 text-center">{type.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Target & Timeline</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="targetValue" className="block text-sm font-medium text-gray-700 mb-2">
                Target Value *
              </label>
              <input
                type="number"
                id="targetValue"
                value={goal.targetValue || ''}
                onChange={(e) => handleInputChange('targetValue', parseFloat(e.target.value) || 0)}
                placeholder="0"
                min="0"
                step="0.1"
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 ${
                  errors.targetValue 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                } focus:outline-none focus:ring-4`}
              />
              {errors.targetValue && <span className="text-red-500 text-xs mt-1 block">{errors.targetValue}</span>}
            </div>

            <div>
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                Unit *
              </label>
              <select
                id="unit"
                value={goal.unit}
                onChange={(e) => handleInputChange('unit', e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 bg-white ${
                  errors.unit 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                } focus:outline-none focus:ring-4`}
              >
                <option value="">Select unit</option>
                {commonUnits[goal.type as keyof typeof commonUnits].map((unit) => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              {errors.unit && <span className="text-red-500 text-xs mt-1 block">{errors.unit}</span>}
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline *
            </label>
            <input
              type="date"
              id="deadline"
              value={goal.deadline}
              onChange={(e) => handleInputChange('deadline', e.target.value)}
              min={getMinDate()}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all duration-200 ${
                errors.deadline 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
              } focus:outline-none focus:ring-4`}
            />
            {errors.deadline && <span className="text-red-500 text-xs mt-1 block">{errors.deadline}</span>}
          </div>

          <div className="mb-6">
            <label htmlFor="currentValue" className="block text-sm font-medium text-gray-700 mb-2">
              Current Progress
            </label>
            <input
              type="number"
              id="currentValue"
              value={goal.currentValue || ''}
              onChange={(e) => handleInputChange('currentValue', parseFloat(e.target.value) || 0)}
              placeholder="0"
              min="0"
              step="0.1"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 focus:outline-none"
            />
            <small className="block text-gray-500 text-xs mt-1">Optional: Set your starting point</small>
          </div>
        </div>

        <div className="p-8 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Priority & Settings</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {priorityLevels.map((priority) => (
                <button
                  key={priority.value}
                  type="button"
                  className={`p-3 border-2 rounded-lg text-center transition-all duration-200 hover:-translate-y-1 ${
                    goal.priority === priority.value 
                      ? `border-[${priority.color}] shadow-lg` 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => handleInputChange('priority', priority.value)}
                  style={{
                    borderColor: goal.priority === priority.value ? priority.color : undefined,
                    backgroundColor: goal.priority === priority.value ? `${priority.color}10` : undefined,
                    boxShadow: goal.priority === priority.value ? `0 0 0 3px ${priority.color}20` : undefined
                  }}
                >
                  <span className="font-medium text-gray-700">{priority.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={goal.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Start tracking this goal immediately
              </span>
            </label>
          </div>
        </div>

        <div className="flex flex-col-reverse md:flex-row justify-end gap-4 p-8 bg-gray-50">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-lg transition-all duration-200 hover:border-gray-400 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed min-w-[120px] flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:-translate-y-1 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none min-w-[120px] flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGoalsPage;