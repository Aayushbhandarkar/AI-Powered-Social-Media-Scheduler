import Chatbot from '../components/Chatbot'

const Dashboard = () => {
  return (
    <div className="h-full space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          AI Content Assistant
        </h1>
      </div>

      {/* Main Card */}
      <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 h-[75vh] flex flex-col">
        <div className="flex-1 overflow-hidden">
          <Chatbot />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
