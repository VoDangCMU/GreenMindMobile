import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { type ReactNode } from "react"

interface AppHeaderProps {
  title: string
  showBack?: boolean
  rightActions?: ReactNode[]
}

const AppHeader = ({ title, showBack = false, rightActions = [] }: AppHeaderProps) => {
  const navigate = useNavigate()

  return (
    <header
      className="w-full flex items-center justify-between px-4 py-3 bg-greenery-200 shadow-sm fixed top-0 left-0 z-30"
      style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}
    >
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </button>
        )}
        <span className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {rightActions.map((action, idx) => (
          <div key={idx}>{action}</div>
        ))}
      </div>
    </header>
  )
}

export default AppHeader
