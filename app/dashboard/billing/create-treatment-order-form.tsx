"use client"
import { useAction } from 'next-safe-action/hooks'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { TreatmentOrderSchema } from '@/types/treatment-order-schema'
import { createTreatmentOrder } from '@/server/actions/create-treatment-order'


export default function CreateTreatmentOrderForm() {

  const form = useForm({
    resolver: zodResolver(TreatmentOrderSchema),
    defaultValues: {
      userEmail: "",
      amount: 0,
      description: "",
      status: "",
      receiptURL: null,
      paymentIntentID: null,
    }
  })

  const { execute, status } = useAction(createTreatmentOrder, {
    onSuccess({ data }) {
      if (data?.error) toast.error(data.error)
      if (data?.success) {
        form.reset()
        toast.success(data.success)
      }
    }
  })

  const onSubmit = (values: z.infer<typeof TreatmentOrderSchema>) => {
    // console.log(values)
    execute(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Treatment Order</CardTitle>
        <CardDescription>Customize order details of treatments.</CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="userEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="johndoe000@email.com"
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Description</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
              Create order
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}