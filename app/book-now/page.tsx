import BookNow from "@/app/book-now/index"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Book Now",
}

export default function Page() {
  return (
    <BookNow />
  )
}
