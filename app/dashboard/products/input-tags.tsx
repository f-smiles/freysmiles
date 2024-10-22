'use client'

import { Dispatch, forwardRef, SetStateAction, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useFormContext } from "react-hook-form"
import { XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input, InputProps } from "@/components/ui/input"


type InputTagsProps = InputProps & {
  value: string[],
  onChange: Dispatch<SetStateAction<string[]>>,
}

export const InputTags = forwardRef<HTMLInputElement, InputTagsProps>(({ onChange, value, ...props }, ref) => {

  const [pendingTag, setPendingTag] = useState("")
  const [focused, setFocused] = useState(false)

  function addPendingTags() {
    if (pendingTag) {
      const newTags = new Set([...value, pendingTag])
      onChange(Array.from(newTags))
      setPendingTag("")
    }
  }

  const { setFocus } = useFormContext()

  return (
    <div
      onClick={() => setFocus("tags")}
      className={cn("flex items-center min-h-12 px-2 py-2 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        focused ? "ring-ring ring-2 ring-offset-2 border-transparent outline-none" : "ring-0 ring-offset-0"
      )}
    >
      <motion.ul className="inline-flex w-full gap-2">
        <AnimatePresence>
          {value.map((tag) => (
            <motion.li
              key={tag}
              animate={{ scale: 1 }}
              initial={{ scale: 0 }}
              exit={{ scale: 0 }}
              className="flex items-center"
            >
              <Badge className="flex items-center h-10 gap-2 pl-3 pr-3 transition-all duration-300 ease-in-out rounded-full group w-max bg-primary/20 text-primary hover:bg-primary/100 hover:pr-2 hover:text-primary-foreground active:bg-primary/70">
                <p className="text-sm font-normal">{tag}</p>
                <Button
                  className="p-1 transition-colors duration-300 rounded-full w-max h-max bg-primary group-hover:bg-primary-foreground"
                  onClick={(e) => {
                    e.preventDefault()
                    onChange(value.filter((_) => _ !== tag))}
                  }
                >
                  <XIcon className="translate-x-[200%] w-0 h-0 transition-all duration-300 text-primary-foreground group-hover:translate-x-0 group-hover:w-4 group-hover:h-4 group-hover:text-primary group-active:-rotate-45" />
                </Button>
              </Badge>
            </motion.li>
          ))}
        </AnimatePresence>
        <Input
          className={cn("w-full focus-visible:ring-0 focus-visible:ring-offset-0", focused ? "border" : "border-transparent")}
          value={pendingTag}
          onFocus={(e) => setFocused(true)}
          onBlurCapture={(e) => setFocused(false)}
          onChange={(e) => setPendingTag(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addPendingTags()
            }
          }}
          {...props}
        />
      </motion.ul>
    </div>
  )
})

InputTags.displayName = "InputTags"