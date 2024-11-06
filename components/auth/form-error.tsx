import { AlertCircleIcon } from "lucide-react"

export const FormError = ({ message }: { message?: string }) => {
  if (!message) return null

  return (
    <span className="block p-4 rounded-md bg-red-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircleIcon aria-hidden="true" className="w-5 h-5 text-red-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{message}</p>
        </div>
      </div>
    </span>
  )
}