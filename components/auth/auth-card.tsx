'use client'

import { BackButton } from "@/components/auth/back-button"
import { OAuthProviders } from "@/components/auth/oauth-providers"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

type AuthCardProps = {
  children?: React.ReactNode,
  title: string,
  description?: string,
  backButtonHref: string,
  backButtonLabel: string,
  showOAuthProviders?: boolean,
}

export const AuthCard = ({
  children,
  title,
  description,
  backButtonHref,
  backButtonLabel,
  showOAuthProviders
}: AuthCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent>
        {children}
        {showOAuthProviders && (
          <OAuthProviders />
        )}
      </CardContent>

      <CardFooter>
        <BackButton backButtonHref={backButtonHref} backButtonLabel={backButtonLabel} />
      </CardFooter>
    </Card>
  )
}