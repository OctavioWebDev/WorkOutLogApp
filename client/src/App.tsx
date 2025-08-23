import React, { useState } from 'react'

function App() {
  console.log('App component rendering...')
  
  const [currentView, setCurrentView] = useState('landing')
  const [showNewWorkoutForm, setShowNewWorkoutForm] = useState(false)
  const [workouts, setWorkouts] = useState([
    { id: 1, name: 'Squat Day', date: '2024-03-15', exercises: [
      { name: 'Squat', sets: '5x5', weight: '315 lbs' },
      { name: 'Romanian Deadlift', sets: '3x8', weight: '225 lbs' },
      { name: 'Leg Press', sets: '3x12', weight: '450 lbs' }
    ]},
    { id: 2, name: 'Bench Day', date: '2024-03-13', exercises: [
      { name: 'Bench Press', sets: '5x5', weight: '225 lbs' },
      { name: 'Incline Dumbbell Press', sets: '3x8', weight: '70 lbs' },
      { name: 'Tricep Dips', sets: '3x12', weight: 'Bodyweight' }
    ]},
    { id: 3, name: 'Deadlift Day', date: '2024-03-11', exercises: [
      { name: 'Deadlift', sets: '5x3', weight: '405 lbs' },
      { name: 'Bent Over Row', sets: '3x8', weight: '185 lbs' },
      { name: 'Pull-ups', sets: '3x10', weight: 'Bodyweight' }
    ]}
  ])
  const [personalRecords, setPersonalRecords] = useState({
    squat: 405,
    bench: 275,
    deadlift: 455,
    total: 1135
  })
  const [editingPR, setEditingPR] = useState(null)
  const [showNewCompetitionForm, setShowNewCompetitionForm] = useState(false)
  const [competitions, setCompetitions] = useState([
    { id: 1, name: 'Spring Classic', date: '2024-05-15', location: 'Local Gym', status: 'upcoming' },
    { id: 2, name: 'State Championships', date: '2024-02-10', location: 'Convention Center', status: 'completed', placement: '2nd', total: 1100 },
    { id: 3, name: 'Winter Open', date: '2024-01-20', location: 'University Gym', status: 'completed', placement: '1st', total: 1050 }
  ])
  const [showNewGoalForm, setShowNewGoalForm] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [goals, setGoals] = useState([
    { id: 1, name: 'Squat 450 lbs', current: 405, target: 450, deadline: '2024-06-01', progress: 90 },
    { id: 2, name: 'Bench 300 lbs', current: 275, target: 300, deadline: '2024-08-01', progress: 92 },
    { id: 3, name: 'Total 1200 lbs', current: 1135, target: 1200, deadline: '2024-12-01', progress: 95 }
  ])
  const [showNewProgramForm, setShowNewProgramForm] = useState(false)
  const [editingProgram, setEditingProgram] = useState(null)
  const [programs, setPrograms] = useState([
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
  
  const renderLanding = () => (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">WorkOutLog</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentView('login')}
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentView('signup')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Transform Your 
              <span className="text-blue-600"> Powerlifting</span>
              <br />Journey Today
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of powerlifters who've increased their total by an average of 
              <span className="font-semibold text-blue-600"> 200+ lbs</span> using our proven tracking system. 
              Stop guessing, start progressing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg"
              >
                🚀 Try For Free - No Credit Card Required
              </button>
              <p className="text-sm text-gray-500">✓ 14-day free trial ✓ Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Social Proof & Problem */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why 89% of Powerlifters Fail to Hit Their Goals
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Most lifters track workouts on paper or random apps that weren't built for powerlifting. 
              They lose motivation, plateau, and never reach their true potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-red-500 text-4xl mb-4">❌</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Inconsistent Tracking</h3>
              <p className="text-gray-600">Scattered notes and forgotten workouts lead to zero progress visibility</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-red-500 text-4xl mb-4">📉</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Clear Direction</h3>
              <p className="text-gray-600">Without structured programs, you're just lifting weights randomly</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-red-500 text-4xl mb-4">😤</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Lost Motivation</h3>
              <p className="text-gray-600">Can't see progress, lose motivation, and eventually quit</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Solution & Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              The Complete Powerlifting Solution
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to track, analyze, and dominate your powerlifting journey in one powerful platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Smart Analytics</h3>
              <p className="text-gray-600">Visualize your strength gains with interactive charts and progress tracking</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">PR Tracking</h3>
              <p className="text-gray-600">Never miss a personal record with automatic calculations and celebrations</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🥇</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Competition Ready</h3>
              <p className="text-gray-600">Track meets, plan attempts, and dominate on competition day</p>
            </div>
            <div className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Goal Setting</h3>
              <p className="text-gray-600">Set ambitious goals and track your progress with visual milestones</p>
            </div>
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💪</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Proven Programs</h3>
              <p className="text-gray-600">Follow battle-tested programs from 5/3/1 to Sheiko and beyond</p>
            </div>
            <div className="text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mobile Optimized</h3>
              <p className="text-gray-600">Log workouts from your phone, tablet, or computer seamlessly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Testimonials & Social Proof */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Results from Real Powerlifters
            </h2>
            <p className="text-lg text-gray-600">
              Don't just take our word for it - see what our community is achieving
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  MJ
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Mike Johnson</h4>
                  <p className="text-sm text-gray-600">83kg Class</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Increased my total from 1200 to 1450 lbs in 8 months. The analytics showed exactly where I was weak."
              </p>
              <div className="text-green-600 font-semibold">+250 lbs total increase</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  SR
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">Sarah Rodriguez</h4>
                  <p className="text-sm text-gray-600">72kg Class</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Finally hit my goal of a 400lb squat! The program tracking kept me consistent and motivated."
              </p>
              <div className="text-green-600 font-semibold">Goal achieved in 6 months</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                  DL
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-900">David Lee</h4>
                  <p className="text-sm text-gray-600">105kg Class</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Went from recreational lifter to placing 2nd at state championships. This app changed everything."
              </p>
              <div className="text-green-600 font-semibold">2nd Place State Champion</div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <div className="inline-flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">15,000+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">2.5M+</div>
                <div className="text-sm text-gray-600">Workouts Logged</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: CTA & Urgency */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Your Strongest Self is Just One Click Away
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the thousands of powerlifters who've already transformed their training. 
            Limited time: Get your first month completely free.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">✓</div>
                <div className="text-blue-100">14-Day Free Trial</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">✓</div>
                <div className="text-blue-100">No Credit Card Required</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">✓</div>
                <div className="text-blue-100">Cancel Anytime</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-colors shadow-lg"
            >
              🚀 Start Your Free Trial Now
            </button>
            <p className="text-blue-100 text-sm">
              Over 500 people started their journey this week. Don't get left behind.
            </p>
          </div>
          
          <div className="mt-8 flex justify-center space-x-6">
            <button 
              onClick={() => setCurrentView('login')}
              className="text-blue-100 hover:text-white underline"
            >
              Already have an account? Login
            </button>
          </div>
        </div>
      </section>
    </div>
  )

  const renderDashboard = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your powerlifting training platform</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Workouts</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
          <p className="text-sm text-gray-500">This month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Personal Records</h3>
          <p className="text-3xl font-bold text-green-600">8</p>
          <p className="text-sm text-gray-500">New PRs</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Next Competition</h3>
          <p className="text-3xl font-bold text-purple-600">45</p>
          <p className="text-sm text-gray-500">Days away</p>
        </div>
      </div>
      
      {/* Recent Workouts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Workouts</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Squat Day</p>
              <p className="text-sm text-gray-500">3 sets × 5 reps @ 315 lbs</p>
            </div>
            <span className="text-sm text-gray-400">2 days ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Bench Press</p>
              <p className="text-sm text-gray-500">5 sets × 3 reps @ 225 lbs</p>
            </div>
            <span className="text-sm text-gray-400">4 days ago</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Deadlift Day</p>
              <p className="text-sm text-gray-500">1 set × 1 rep @ 405 lbs (PR!)</p>
            </div>
            <span className="text-sm text-gray-400">1 week ago</span>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderNewWorkoutForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">New Workout</h2>
          <button 
            onClick={() => setShowNewWorkoutForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const newWorkout = {
            id: workouts.length + 1,
            name: formData.get('workoutName') as string,
            date: new Date().toISOString().split('T')[0],
            exercises: [
              { name: formData.get('exercise1') as string, sets: formData.get('sets1') as string, weight: formData.get('weight1') as string },
              { name: formData.get('exercise2') as string, sets: formData.get('sets2') as string, weight: formData.get('weight2') as string },
              { name: formData.get('exercise3') as string, sets: formData.get('sets3') as string, weight: formData.get('weight3') as string }
            ].filter(ex => ex.name && ex.name.trim() !== '')
          }
          setWorkouts([newWorkout, ...workouts])
          setShowNewWorkoutForm(false)
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Workout Name</label>
              <input 
                name="workoutName"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Squat Day, Upper Body, etc."
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Exercises</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exercise 1</label>
                    <input 
                      name="exercise1"
                      type="text" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Squat"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sets x Reps</label>
                    <input 
                      name="sets1"
                      type="text" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 5x5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input 
                      name="weight1"
                      type="text" 
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 315 lbs"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exercise 2</label>
                    <input 
                      name="exercise2"
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Romanian Deadlift"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sets x Reps</label>
                    <input 
                      name="sets2"
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 3x8"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input 
                      name="weight2"
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 225 lbs"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exercise 3</label>
                    <input 
                      name="exercise3"
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Leg Press"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sets x Reps</label>
                    <input 
                      name="sets3"
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 3x12"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
                    <input 
                      name="weight3"
                      type="text" 
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 450 lbs"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                onClick={() => setShowNewWorkoutForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Workout
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
  
  const renderWorkouts = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Workouts</h1>
          <p className="text-gray-600">Track your training sessions</p>
        </div>
        <button 
          onClick={() => setShowNewWorkoutForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + New Workout
        </button>
      </div>
      
      {/* Workout List */}
      <div className="space-y-4">
        {workouts.map((workout) => (
          <div key={workout.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{workout.name}</h3>
                <p className="text-sm text-gray-500">{new Date(workout.date).toLocaleDateString()}</p>
              </div>
              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
            </div>
            <div className="space-y-2">
              {workout.exercises.map((exercise, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-700">{exercise.name}</span>
                  <span className="font-medium">{exercise.sets} @ {exercise.weight}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
  
  const updatePR = (lift, newValue) => {
    const updatedPRs = { ...personalRecords, [lift]: parseInt(newValue) }
    if (lift !== 'total') {
      updatedPRs.total = updatedPRs.squat + updatedPRs.bench + updatedPRs.deadlift
    }
    setPersonalRecords(updatedPRs)
    setEditingPR(null)
  }

  const renderNewProgramForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Program</h2>
          <button 
            onClick={() => setShowNewProgramForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const exercisesText = formData.get('exercises') as string
          const exercises = exercisesText.split(',').map(ex => ex.trim()).filter(ex => ex.length > 0)
          
          const newProgram = {
            id: programs.length + 1,
            name: formData.get('programName') as string,
            description: formData.get('description') as string,
            duration: formData.get('duration') as string,
            difficulty: formData.get('difficulty') as string,
            exercises: exercises,
            frequency: formData.get('frequency') as string
          }
          setPrograms([...programs, newProgram])
          setShowNewProgramForm(false)
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Name</label>
              <input 
                name="programName"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Custom 5/3/1, My Powerlifting Program"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                name="description"
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Brief description of the program goals and methodology"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input 
                  name="duration"
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 12 weeks, 6 months"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select 
                  name="difficulty"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <input 
                name="frequency"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 3x per week, 4x per week"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Exercises</label>
              <input 
                name="exercises"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Separate with commas: Squat, Bench Press, Deadlift, Overhead Press"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple exercises with commas</p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                onClick={() => setShowNewProgramForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Program
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )

  const renderNewGoalForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Goal</h2>
          <button 
            onClick={() => setShowNewGoalForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const current = parseInt(formData.get('current') as string)
          const target = parseInt(formData.get('target') as string)
          const progress = Math.round((current / target) * 100)
          
          const newGoal = {
            id: goals.length + 1,
            name: formData.get('goalName') as string,
            current: current,
            target: target,
            deadline: formData.get('deadline') as string,
            progress: progress
          }
          setGoals([...goals, newGoal])
          setShowNewGoalForm(false)
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Name</label>
              <input 
                name="goalName"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Squat 500 lbs, Bench 350 lbs"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current (lbs)</label>
                <input 
                  name="current"
                  type="number" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="405"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target (lbs)</label>
                <input 
                  name="target"
                  type="number" 
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="450"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
              <input 
                name="deadline"
                type="date" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                onClick={() => setShowNewGoalForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Goal
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )

  const renderNewCompetitionForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Register for Competition</h2>
          <button 
            onClick={() => setShowNewCompetitionForm(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.target as HTMLFormElement)
          const newCompetition = {
            id: competitions.length + 1,
            name: formData.get('competitionName') as string,
            date: formData.get('competitionDate') as string,
            location: formData.get('location') as string,
            status: 'upcoming'
          }
          setCompetitions([newCompetition, ...competitions])
          setShowNewCompetitionForm(false)
        }}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Competition Name</label>
              <input 
                name="competitionName"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Spring Classic, State Championships"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                name="competitionDate"
                type="date" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                name="location"
                type="text" 
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Local Gym, Convention Center"
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button 
                type="button"
                onClick={() => setShowNewCompetitionForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )

  const renderPersonalRecords = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal Records</h1>
        <p className="text-gray-600">Track your powerlifting PRs</p>
      </div>
      
      {/* Big 3 PRs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Squat</h3>
          {editingPR === 'squat' ? (
            <div className="flex flex-col items-center space-y-2">
              <input 
                type="number" 
                defaultValue={personalRecords.squat}
                className="text-4xl font-bold text-blue-600 text-center border-b-2 border-blue-500 bg-transparent focus:outline-none w-24"
                onBlur={(e) => updatePR('squat', (e.target as HTMLInputElement).value)}
                onKeyPress={(e) => e.key === 'Enter' && updatePR('squat', (e.target as HTMLInputElement).value)}
                autoFocus
              />
              <p className="text-sm text-gray-500">lbs</p>
            </div>
          ) : (
            <div onClick={() => setEditingPR('squat')} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
              <p className="text-4xl font-bold text-blue-600 mb-2">{personalRecords.squat}</p>
              <p className="text-sm text-gray-500">lbs • Click to edit</p>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bench Press</h3>
          {editingPR === 'bench' ? (
            <div className="flex flex-col items-center space-y-2">
              <input 
                type="number" 
                defaultValue={personalRecords.bench}
                className="text-4xl font-bold text-green-600 text-center border-b-2 border-green-500 bg-transparent focus:outline-none w-24"
                onBlur={(e) => updatePR('bench', (e.target as HTMLInputElement).value)}
                onKeyPress={(e) => e.key === 'Enter' && updatePR('bench', (e.target as HTMLInputElement).value)}
                autoFocus
              />
              <p className="text-sm text-gray-500">lbs</p>
            </div>
          ) : (
            <div onClick={() => setEditingPR('bench')} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
              <p className="text-4xl font-bold text-green-600 mb-2">{personalRecords.bench}</p>
              <p className="text-sm text-gray-500">lbs • Click to edit</p>
            </div>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Deadlift</h3>
          {editingPR === 'deadlift' ? (
            <div className="flex flex-col items-center space-y-2">
              <input 
                type="number" 
                defaultValue={personalRecords.deadlift}
                className="text-4xl font-bold text-red-600 text-center border-b-2 border-red-500 bg-transparent focus:outline-none w-24"
                onBlur={(e) => updatePR('deadlift', (e.target as HTMLInputElement).value)}
                onKeyPress={(e) => e.key === 'Enter' && updatePR('deadlift', (e.target as HTMLInputElement).value)}
                autoFocus
              />
              <p className="text-sm text-gray-500">lbs</p>
            </div>
          ) : (
            <div onClick={() => setEditingPR('deadlift')} className="cursor-pointer hover:bg-gray-50 p-2 rounded">
              <p className="text-4xl font-bold text-red-600 mb-2">{personalRecords.deadlift}</p>
              <p className="text-sm text-gray-500">lbs • Click to edit</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Total */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-lg shadow-md text-center text-white mb-8">
        <h3 className="text-xl font-semibold mb-2">Total</h3>
        <p className="text-5xl font-bold mb-2">{personalRecords.total}</p>
        <p className="text-sm opacity-90">lbs (Auto-calculated)</p>
      </div>
      
      {/* Recent PRs */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent PRs</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Deadlift</p>
              <p className="text-sm text-gray-500">455 lbs (+10 lbs)</p>
            </div>
            <span className="text-sm text-gray-400">March 12, 2024</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Squat</p>
              <p className="text-sm text-gray-500">405 lbs (+5 lbs)</p>
            </div>
            <span className="text-sm text-gray-400">March 10, 2024</span>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderCompetitions = () => {
    const upcomingCompetitions = competitions.filter(comp => comp.status === 'upcoming')
    const completedCompetitions = competitions.filter(comp => comp.status === 'completed')
    
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Competitions</h1>
            <p className="text-gray-600">Track your powerlifting meets</p>
          </div>
          <button 
            onClick={() => setShowNewCompetitionForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Register for Meet
          </button>
        </div>
        
        {/* Upcoming Competitions */}
        {upcomingCompetitions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Competitions</h3>
            <div className="space-y-4">
              {upcomingCompetitions.map((competition) => {
                const daysUntil = Math.ceil((new Date(competition.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                return (
                  <div key={competition.id} className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div className="text-blue-800">
                        <p className="font-medium text-lg">{competition.name}</p>
                        <p className="text-sm">{new Date(competition.date).toLocaleDateString()} • {daysUntil} days away</p>
                        <p className="text-sm">Location: {competition.location}</p>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Registered</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        
        {/* Competition History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Competition History</h3>
          <div className="space-y-4">
            {completedCompetitions.map((competition) => (
              <div key={competition.id} className="border-l-4 border-green-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{competition.name}</p>
                    <p className="text-sm text-gray-500">{new Date(competition.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-600">
                      {competition.total && `Total: ${competition.total} lbs • `}
                      {competition.placement && `${competition.placement} Place`}
                    </p>
                  </div>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Completed</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  const renderAnalytics = () => {
    const strengthData = [
      { month: 'Jan', squat: 385, bench: 255, deadlift: 435 },
      { month: 'Feb', squat: 395, bench: 265, deadlift: 445 },
      { month: 'Mar', squat: 405, bench: 275, deadlift: 455 },
    ]
    
    const volumeData = [
      { week: 'Week 1', sets: 45 },
      { week: 'Week 2', sets: 52 },
      { week: 'Week 3', sets: 48 },
      { week: 'Week 4', sets: 55 },
    ]
    
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Track your progress and performance</p>
        </div>
        
        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Strength Progress (Last 3 Months)</h3>
            <div className="space-y-4">
              {strengthData.map((data, index) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-gray-500">Total: {data.squat + data.bench + data.deadlift} lbs</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-blue-600 w-12">Squat</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{width: `${(data.squat / 500) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-12">{data.squat}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-green-600 w-12">Bench</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-500" 
                          style={{width: `${(data.bench / 400) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-12">{data.bench}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-red-600 w-12">Dead</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-red-600 h-2 rounded-full transition-all duration-500" 
                          style={{width: `${(data.deadlift / 500) * 100}%`}}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-12">{data.deadlift}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Volume (Sets)</h3>
            <div className="h-48 flex items-end justify-between space-x-2">
              {volumeData.map((data, index) => (
                <div key={data.week} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-purple-600 rounded-t transition-all duration-700 hover:bg-purple-700 cursor-pointer"
                    style={{height: `${(data.sets / 60) * 100}%`}}
                    title={`${data.week}: ${data.sets} sets`}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{data.week.split(' ')[1]}</span>
                  <span className="text-xs font-medium text-purple-600">{data.sets}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Interactive Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-2xl font-bold text-blue-600">24</p>
            <p className="text-sm text-gray-500">Workouts This Month</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div className="bg-blue-600 h-1 rounded-full" style={{width: '80%'}}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-2xl font-bold text-green-600">3</p>
            <p className="text-sm text-gray-500">New PRs</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div className="bg-green-600 h-1 rounded-full" style={{width: '60%'}}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-2xl font-bold text-purple-600">48</p>
            <p className="text-sm text-gray-500">Hours Trained</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div className="bg-purple-600 h-1 rounded-full" style={{width: '75%'}}></div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow cursor-pointer">
            <p className="text-2xl font-bold text-indigo-600">92%</p>
            <p className="text-sm text-gray-500">Consistency Rate</p>
            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
              <div className="bg-indigo-600 h-1 rounded-full" style={{width: '92%'}}></div>
            </div>
          </div>
        </div>
        
        {/* Performance Insights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Strongest Lift</p>
                  <p className="text-sm text-green-700">Deadlift improving consistently</p>
                </div>
                <span className="text-green-600">📈</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div>
                  <p className="font-medium text-blue-900">Best Training Day</p>
                  <p className="text-sm text-blue-700">Wednesdays show highest volume</p>
                </div>
                <span className="text-blue-600">💪</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div>
                  <p className="font-medium text-purple-900">Consistency Streak</p>
                  <p className="text-sm text-purple-700">12 weeks of regular training</p>
                </div>
                <span className="text-purple-600">🔥</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div>
                  <p className="font-medium text-yellow-900">Next Goal</p>
                  <p className="text-sm text-yellow-700">45 lbs away from squat goal</p>
                </div>
                <span className="text-yellow-600">🎯</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  const renderProfile = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile & Settings</h1>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>
      
      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              defaultValue="John Doe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              defaultValue="john@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight Class</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>83kg / 183lbs</option>
              <option>93kg / 205lbs</option>
              <option>105kg / 231lbs</option>
              <option>120kg / 264lbs</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Federation</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>USAPL</option>
              <option>IPF</option>
              <option>USPA</option>
              <option>SPF</option>
            </select>
          </div>
        </div>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Save Changes
        </button>
      </div>
      
      {/* App Settings */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">App Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Units</span>
            <select className="px-3 py-1 border border-gray-300 rounded">
              <option>Pounds (lbs)</option>
              <option>Kilograms (kg)</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Email Notifications</span>
            <input type="checkbox" defaultChecked className="rounded" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Dark Mode</span>
            <input type="checkbox" className="rounded" />
          </div>
        </div>
      </div>
    </div>
  )
  
  const deleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId))
  }

  const updateGoal = (goalId, field, value) => {
    setGoals(goals.map(goal => {
      if (goal.id === goalId) {
        const updatedGoal = { ...goal, [field]: value }
        if (field === 'current' || field === 'target') {
          updatedGoal.progress = Math.round((updatedGoal.current / updatedGoal.target) * 100)
        }
        return updatedGoal
      }
      return goal
    }))
    setEditingGoal(null)
  }

  const deleteProgram = (programId) => {
    setPrograms(programs.filter(program => program.id !== programId))
  }

  const updateProgram = (programId, field, value) => {
    setPrograms(programs.map(program => {
      if (program.id === programId) {
        if (field === 'exercises' && typeof value === 'string') {
          return { ...program, [field]: value.split(',').map(ex => ex.trim()).filter(ex => ex.length > 0) }
        }
        return { ...program, [field]: value }
      }
      return program
    }))
    setEditingProgram(null)
  }

  const renderGoals = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Goals</h1>
        <p className="text-gray-600">Set and track your powerlifting goals</p>
      </div>
      
      {/* Current Goals */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Current Goals</h3>
        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                {editingGoal === goal.id ? (
                  <input 
                    type="text" 
                    defaultValue={goal.name}
                    className="font-medium text-gray-900 bg-transparent border-b border-blue-500 focus:outline-none"
                    onBlur={(e) => updateGoal(goal.id, 'name', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateGoal(goal.id, 'name', (e.target as HTMLInputElement).value)}
                    autoFocus
                  />
                ) : (
                  <h4 
                    className="font-medium text-gray-900 cursor-pointer hover:text-blue-600"
                    onClick={() => setEditingGoal(goal.id)}
                  >
                    {goal.name}
                  </h4>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Target: {new Date(goal.deadline).toLocaleDateString()}</span>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{width: `${Math.min(goal.progress, 100)}%`}}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Current:</span>
                    {editingGoal === goal.id ? (
                      <input 
                        type="number" 
                        defaultValue={goal.current}
                        className="w-16 text-sm bg-transparent border-b border-blue-500 focus:outline-none"
                        onBlur={(e) => updateGoal(goal.id, 'current', parseInt(e.target.value))}
                        onKeyPress={(e) => e.key === 'Enter' && updateGoal(goal.id, 'current', parseInt((e.target as HTMLInputElement).value))}
                      />
                    ) : (
                      <span 
                        className="text-sm font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => setEditingGoal(goal.id)}
                      >
                        {goal.current} lbs
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm text-gray-600">Target:</span>
                    {editingGoal === goal.id ? (
                      <input 
                        type="number" 
                        defaultValue={goal.target}
                        className="w-16 text-sm bg-transparent border-b border-blue-500 focus:outline-none"
                        onBlur={(e) => updateGoal(goal.id, 'target', parseInt(e.target.value))}
                        onKeyPress={(e) => e.key === 'Enter' && updateGoal(goal.id, 'target', parseInt((e.target as HTMLInputElement).value))}
                      />
                    ) : (
                      <span 
                        className="text-sm font-medium cursor-pointer hover:text-blue-600"
                        onClick={() => setEditingGoal(goal.id)}
                      >
                        {goal.target} lbs
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-gray-600">Need: {goal.target - goal.current} lbs more</span>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setShowNewGoalForm(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add New Goal
        </button>
      </div>
      
      {/* Completed Goals */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Completed Goals</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Deadlift 450 lbs</p>
              <p className="text-sm text-green-700">Achieved: March 12, 2024</p>
            </div>
            <span className="text-green-600">✓</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Squat 400 lbs</p>
              <p className="text-sm text-green-700">Achieved: March 10, 2024</p>
            </div>
            <span className="text-green-600">✓</span>
          </div>
        </div>
      </div>
    </div>
  )
  
  const renderPrograms = () => (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Training Programs</h1>
        <p className="text-gray-600">Follow structured powerlifting programs</p>
      </div>
      
      {/* Current Program */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Current Program</h3>
        <div className="text-blue-800">
          <p className="font-medium">5/3/1 Boring But Big</p>
          <p className="text-sm">Week 2 of 4 • Cycle 3</p>
          <p className="text-sm">Next workout: Squat Day (Tomorrow)</p>
        </div>
      </div>
      
      {/* Available Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">5/3/1 Boring But Big</h4>
          <p className="text-gray-600 text-sm mb-4">Classic Jim Wendler program focusing on strength and volume</p>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p>• 4-week cycles</p>
            <p>• Main lifts + high volume assistance</p>
            <p>• Beginner to intermediate</p>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Currently Running</span>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Starting Strength</h4>
          <p className="text-gray-600 text-sm mb-4">Linear progression program for beginners</p>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p>• 3x per week</p>
            <p>• Focus on big 3 + press</p>
            <p>• Beginner friendly</p>
          </div>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
            Start Program
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Sheiko #37</h4>
          <p className="text-gray-600 text-sm mb-4">High volume Russian powerlifting program</p>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p>• 4x per week</p>
            <p>• Very high volume</p>
            <p>• Advanced lifters</p>
          </div>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
            Start Program
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Conjugate Method</h4>
          <p className="text-gray-600 text-sm mb-4">Westside Barbell's dynamic effort system</p>
          <div className="space-y-2 text-sm text-gray-700 mb-4">
            <p>• 4x per week</p>
            <p>• Max effort + dynamic effort</p>
            <p>• Advanced lifters</p>
          </div>
          <button className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors">
            Start Program
          </button>
        </div>
      </div>
    </div>
  )
  
  const renderLogin = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Login</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Don't have an account?{' '}
          <button 
            onClick={() => setCurrentView('signup')}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
  
  const renderSignup = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Sign Up</h2>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Create a password"
            />
          </div>
          <button 
            type="button"
            onClick={() => setCurrentView('dashboard')}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <button 
            onClick={() => setCurrentView('login')}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation - Only show for app pages, not landing */}
      {currentView !== 'landing' && (
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">WorkOutLog</h1>
              </div>
              <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'dashboard' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setCurrentView('workouts')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'workouts' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Workouts
              </button>
              <button 
                onClick={() => setCurrentView('records')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'records' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                PRs
              </button>
              <button 
                onClick={() => setCurrentView('competitions')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'competitions' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Competitions
              </button>
              <button 
                onClick={() => setCurrentView('analytics')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'analytics' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button 
                onClick={() => setCurrentView('goals')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'goals' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Goals
              </button>
              <button 
                onClick={() => setCurrentView('programs')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'programs' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Programs
              </button>
              <button 
                onClick={() => setCurrentView('profile')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === 'profile' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Profile
              </button>
              <button 
                onClick={() => setCurrentView('login')}
                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Login
              </button>
              <button 
                onClick={() => setCurrentView('signup')}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>
      )}
      
      {/* Main Content */}
      {currentView === 'landing' && renderLanding()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'workouts' && renderWorkouts()}
      {currentView === 'records' && renderPersonalRecords()}
      {currentView === 'competitions' && renderCompetitions()}
      {currentView === 'analytics' && renderAnalytics()}
      {currentView === 'goals' && renderGoals()}
      {currentView === 'programs' && renderPrograms()}
      {currentView === 'profile' && renderProfile()}
      {currentView === 'login' && renderLogin()}
      {currentView === 'signup' && renderSignup()}
      
      {/* Modals */}
      {showNewWorkoutForm && renderNewWorkoutForm()}
      {showNewCompetitionForm && renderNewCompetitionForm()}
      {showNewGoalForm && renderNewGoalForm()}
    </div>
  )
}

export default App
