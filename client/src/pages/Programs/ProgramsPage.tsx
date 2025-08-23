import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Calendar, Users, Target } from 'lucide-react'

interface Program {
  id: number
  name: string
  description: string
  duration: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  exercises: string[]
  frequency: string
}

const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      name: 'Starting Strength',
      description: 'A beginner program focused on compound movements',
      duration: '12 weeks',
      difficulty: 'Beginner',
      exercises: ['Squat', 'Bench Press', 'Deadlift', 'Overhead Press'],
      frequency: '3x per week'
    },
    {
      id: 2,
      name: '5/3/1 BBB',
      description: 'Intermediate program with boring but big assistance work',
      duration: '16 weeks',
      difficulty: 'Intermediate',
      exercises: ['Squat', 'Bench Press', 'Deadlift', 'Overhead Press'],
      frequency: '4x per week'
    },
    {
      id: 3,
      name: 'Smolov Jr',
      description: 'High intensity peaking program for bench press',
      duration: '3 weeks',
      difficulty: 'Advanced',
      exercises: ['Bench Press', 'Close Grip Bench', 'Incline Press'],
      frequency: '4x per week'
    }
  ])

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    difficulty: 'Beginner' as Program['difficulty'],
    exercises: '',
    frequency: ''
  })

  const handleCreateProgram = (e: React.FormEvent) => {
    e.preventDefault()
    const newProgram: Program = {
      id: programs.length + 1,
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      difficulty: formData.difficulty,
      exercises: formData.exercises.split(',').map(ex => ex.trim()).filter(ex => ex.length > 0),
      frequency: formData.frequency
    }
    setPrograms([...programs, newProgram])
    setFormData({
      name: '',
      description: '',
      duration: '',
      difficulty: 'Beginner',
      exercises: '',
      frequency: ''
    })
    setShowCreateForm(false)
  }

  const handleEditProgram = (program: Program) => {
    setEditingProgram(program.id)
    setFormData({
      name: program.name,
      description: program.description,
      duration: program.duration,
      difficulty: program.difficulty,
      exercises: program.exercises.join(', '),
      frequency: program.frequency
    })
    setShowCreateForm(true)
  }

  const handleUpdateProgram = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProgram) {
      setPrograms(programs.map(program => 
        program.id === editingProgram 
          ? {
              ...program,
              name: formData.name,
              description: formData.description,
              duration: formData.duration,
              difficulty: formData.difficulty,
              exercises: formData.exercises.split(',').map(ex => ex.trim()).filter(ex => ex.length > 0),
              frequency: formData.frequency
            }
          : program
      ))
      setEditingProgram(null)
      setFormData({
        name: '',
        description: '',
        duration: '',
        difficulty: 'Beginner',
        exercises: '',
        frequency: ''
      })
      setShowCreateForm(false)
    }
  }

  const handleDeleteProgram = (id: number) => {
    setPrograms(programs.filter(program => program.id !== id))
  }

  const getDifficultyColor = (difficulty: Program['difficulty']) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800'
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800'
      case 'Advanced':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Programs</h1>
        <p className="text-gray-600">Create and manage your powerlifting programs</p>
      </div>

      {/* Create Program Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create New Program
        </button>
      </div>

      {/* Create/Edit Program Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingProgram ? 'Edit Program' : 'Create New Program'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setEditingProgram(null)
                  setFormData({
                    name: '',
                    description: '',
                    duration: '',
                    difficulty: 'Beginner',
                    exercises: '',
                    frequency: ''
                  })
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={editingProgram ? handleUpdateProgram : handleCreateProgram}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Custom 5/3/1, My Powerlifting Program"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Brief description of the program goals and methodology"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 12 weeks, 6 months"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select
                      required
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Program['difficulty'] })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <input
                    type="text"
                    required
                    value={formData.frequency}
                    onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3x per week, 4x per week"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Main Exercises</label>
                  <input
                    type="text"
                    required
                    value={formData.exercises}
                    onChange={(e) => setFormData({ ...formData, exercises: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Separate with commas: Squat, Bench Press, Deadlift, Overhead Press"
                  />
                  <p className="text-xs text-gray-500 mt-1">Separate multiple exercises with commas</p>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false)
                      setEditingProgram(null)
                      setFormData({
                        name: '',
                        description: '',
                        duration: '',
                        difficulty: 'Beginner',
                        exercises: '',
                        frequency: ''
                      })
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingProgram ? 'Update Program' : 'Create Program'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-md p-6 relative">
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleEditProgram(program)}
                className="text-blue-500 hover:text-blue-700 p-1"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteProgram(program.id)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2 pr-16">
              {program.name}
            </h3>
            <p className="text-gray-600 mb-4">{program.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-2" />
                  Duration:
                </div>
                <span className="text-sm font-medium">{program.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Target className="w-4 h-4 mr-2" />
                  Difficulty:
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(program.difficulty)}`}>
                  {program.difficulty}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="w-4 h-4 mr-2" />
                  Frequency:
                </div>
                <span className="text-sm font-medium">{program.frequency}</span>
              </div>
            </div>

            <div className="mb-4">
              <span className="text-sm text-gray-500 mb-2 block">Main Exercises:</span>
              <div className="flex flex-wrap gap-1">
                {program.exercises.map((exercise, index) => (
                  <span
                    key={index}
                    className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                  >
                    {exercise}
                  </span>
                ))}
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Start Program
            </button>
          </div>
        ))}
      </div>

      {programs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Target className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs yet</h3>
          <p className="text-gray-500 mb-4">Create your first training program to get started</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Program
          </button>
        </div>
      )}
    </div>
  )
}

export default ProgramsPage
