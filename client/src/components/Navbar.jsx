import { useAuth } from '../utils/auth'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Left: Brand */}
        <h1 className="text-xl font-extrabold tracking-tight text-white">
          <span className="text-blue-500">AI</span> Social Scheduler
        </h1>

        {/* Right: User Info + Actions */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:block text-sm text-gray-400">
            Welcome,{" "}
            <span className="font-semibold text-gray-200">
              {user?.displayName || user?.username || "User"}
            </span>
          </div>
          <button
            onClick={logout}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
