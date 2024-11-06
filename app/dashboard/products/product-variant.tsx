'use client'

import { forwardRef, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"

import { VariantSchema } from "@/types/variant-schema"
import { createVariant } from "@/server/actions/create-variant"
import { VariantsWithImagesTags } from "@/lib/infer-type"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { deleteVariant } from "@/server/actions/delete-variant"
import { InputTags } from "./input-tags"
import VariantImages from "./variant-images"


type VariantProps = {
  children: React.ReactNode,
  editMode: boolean,
  productID?: number,
  variant?: VariantsWithImagesTags,
}

export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(({ children, editMode, productID, variant }, ref) => {

  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof VariantSchema>>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      id: undefined,
      editMode,
      productID,
      variantName: "",
      color: "#000000",
      tags: [],
      variantImages: [],
    },
  })

  const setEditMode = () => {
    if (!editMode) {
      form.reset()
    }

    if (editMode && variant) {
      form.setValue("editMode", true)
      form.setValue("id", variant.id)
      form.setValue("productID", variant.productID)
      form.setValue("variantName", variant.variantName)
      form.setValue("color", variant.color)
      form.setValue("tags", variant.variantTags.map((tag) => tag.tag))
      form.setValue("variantImages", variant.variantImages.map((img) => ({
        name: img.name,
        url: img.url,
        size: img.size,
      })))
    }
  }

  useEffect(() => {
    setEditMode()
  }, [])

  const { execute, status } = useAction(createVariant, {
    onSuccess({ data, input }) {
      if (data?.error) toast.error(data.error)
      if (data?.success) toast.success(data.success)
    },
    onExecute() {
      setOpen(false)
    },
    onError({ error }) {
			console.error(error)
		},
  })

  const deleteVariantAction = useAction(deleteVariant, {
    onSuccess({ data }) {
      if (data?.error) toast.error(data.error)
      if (data?.success) toast.success(data.success)
    },
    onExecute() {
      setOpen(false)
    },
  })

  function onSubmit(values: z.infer<typeof VariantSchema>) {
    execute(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      {/* <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px]"> */}
      <DialogContent className="lg:max-w-screen-lg overflow-y-auto max-h-[860px]">
        <DialogHeader>
          <DialogTitle>{editMode ? "Edit" : "Create"} Variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. Add tags, images, and more to your products.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 overflow-x-auto">
            <FormField
              control={form.control}
              name="variantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Name your variant" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <VariantImages />

            <span className="flex items-center gap-4">
              {editMode && variant && (
                <Button
                  type="button"
                  variant="destructive"
                  disabled={deleteVariantAction.status === "executing"}
                  onClick={(e) => {
                    e.preventDefault()
                    deleteVariantAction.execute({ id: variant.id })
                  }}
                >
                  Delete
                </Button>
              )}

              <Button
                type="submit"
                disabled={status === "executing"
                  || !form.formState.isValid
                  || !form.formState.isDirty
                }
              >
                {editMode ? "Update" : "Create"}
              </Button>
            </span>

          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
})
