'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export const BackButton = ({ backButtonHref, backButtonLabel }: { backButtonHref: string, backButtonLabel: string }) => {
  return (
    <Button asChild variant="link" className="w-full">
      <Link href={backButtonHref} aria-label={backButtonLabel}>
        {backButtonLabel}
      </Link>
    </Button>
  )
}
