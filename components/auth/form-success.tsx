import { CheckCircle2Icon } from "lucide-react"

export const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null

  return (
    <span className="block p-4 rounded-md bg-green-50">
      <div className="flex">
        <div className="flex-shrink-0">
          <CheckCircle2Icon aria-hidden="true" className="w-5 h-5 text-green-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-green-800">{message}</p>
        </div>
      </div>
    </span>
  )
}