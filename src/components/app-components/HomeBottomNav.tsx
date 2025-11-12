import { Home, BarChart2, Users, Plus, User, Target, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const BottomNav = () => {
  return (
    <div className="sticky bottom-0 left-0 z-50 w-full bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div
        className="grid max-w-lg mx-auto grid-cols-5 font-medium"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <Link
          to="/home"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs">Home</span>
        </Link>

        <Link
          to="/quiz"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group"
        >
          <Target className="w-6 h-6 mb-1" />
          <span className="text-xs">Personality</span>
        </Link>

        {/* Floating Add button */}
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="inline-flex items-center justify-center w-14 h-14 font-medium bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800 -mt-6"
          >
            <Plus className="w-7 h-7 text-white" />
          </button>
        </div>

        <Link
          to="/todo"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group"
        >
          <CheckCircle2 className="w-6 h-6 mb-1" />
          <span className="text-xs">Todo</span>
        </Link>

        <Link
          to="/profile"
          className="flex flex-col items-center justify-center py-2 hover:text-blue-600 text-gray-500 dark:text-gray-400 group"
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  )
}

export default BottomNav
