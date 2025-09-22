import { Link, useLocation } from 'react-router-dom'
import { 
  HiHome, 
  HiCalendar, 
  HiCog,
  HiTemplate
} from 'react-icons/hi'

const Sidebar = () => {
  const location = useLocation()

  const menuItems = [
    { path: '/', name: 'Home', icon: HiHome },
    { path: '/dashboard', name: 'Chatbot', icon: HiTemplate },
    { path: '/calendar', name: 'Calendar', icon: HiCalendar },
    { path: '/settings', name: 'Settings', icon: HiCog },
  ]

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
      {/* Brand Logo / Title */}
      <div className="p-6">
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          <span className="text-blue-500">AI</span> Scheduler
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-gray-800 text-gray-500 text-sm">
        <p>v1.0.0</p>
      </div>
    </div>
  )
}

export default Sidebar
