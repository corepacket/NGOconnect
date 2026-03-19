import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaHandsHelping } from 'react-icons/fa'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { useAuth } from '../auth/AuthContext'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'volunteer', // 'volunteer' | 'ngo'
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call - replace with actual auth logic
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (formData.email && formData.password) {
      const userType = formData.userType
      login({
        userType,
        user: {
          name: formData.email.split('@')[0],
          email: formData.email,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          ...(userType === 'ngo' && {
            name: 'Ocean Conservation Society',
            logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          }),
        },
      })
      toast.success(`Welcome back! Logging in as ${userType}...`)
      navigate(userType === 'ngo' ? '/dashboard/ngo' : '/dashboard/volunteer')
    } else {
      toast.error('Please fill in all fields')
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-earth-50 pt-24 pb-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 px-8 py-10 text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-block p-4 bg-white/20 rounded-full mb-4"
            >
              <FaHandsHelping className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-2xl font-display font-bold text-white">
              Welcome Back
            </h1>
            <p className="text-white/80 mt-1 text-sm">
              Sign in to continue making an impact
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* User Type Toggle */}
            <div>
              <label className="block text-sm font-medium text-earth-700 mb-2">
                I am a...
              </label>
              <div className="flex gap-2 p-1 bg-earth-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, userType: 'volunteer' }))}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    formData.userType === 'volunteer'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-earth-600 hover:text-earth-900'
                  }`}
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, userType: 'ngo' }))}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    formData.userType === 'ngo'
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-earth-600 hover:text-earth-900'
                  }`}
                >
                  NGO
                </button>
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-earth-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-earth-700 mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-earth-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-earth-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-earth-400 hover:text-earth-600"
                >
                  {showPassword ? <HiEyeOff className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => toast('Password reset coming soon!', { icon: '🔜' })}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 text-center">
            <p className="text-earth-600 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700">
                Sign up as Volunteer
              </Link>
              {' · '}
              <Link to="/register-ngo" className="font-semibold text-primary-600 hover:text-primary-700">
                Register NGO
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
