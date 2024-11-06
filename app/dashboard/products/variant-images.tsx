'use client'

import Image from "next/image"
import { z } from "zod"
import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { Reorder } from "framer-motion"

import { VariantSchema } from "@/types/variant-schema"
import { UploadDropzone } from "@/app/api/uploadthing/uploadthing"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { TrashIcon } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"


export default function VariantImages() {
  const { control, getValues, setError } = useFormContext<z.infer<typeof VariantSchema>>()

  // fields and control in this case is the variantImages properties { url, size, name, id, key }
  const { fields, append, remove, update, move } = useFieldArray({
    control,
    name: 'variantImages',
  })

  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div>
      <FormField
        control={control}
        name="variantImages"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Images</FormLabel>
            <FormControl>
              <UploadDropzone
                className="transition-all duration-150 cursor-pointer upload-button-custom hover:bg-primary/10"
                endpoint="variantImagesUploader"
                onBeforeUploadBegin={(files) => {
                  files.map((file) => {
                    append({
                      name: file.name,
                      size: file.size,
                      url: URL.createObjectURL(file),
                    })
                  })
                  return files
                }}
                onClientUploadComplete={(files) => {
                  const images = getValues("variantImages")
                  images.map((field, index) => {
                    if (field.url.search("blob:") === 0) {
                      const image = files.find((img) => img.name === field.name)
                      if (image) update(index, { url: image.url, name: image.name, size: image.size, key: image.key })
                    }
                  })
                }}
                onUploadError={(error) => {
                  setError("variantImages", {
                    type: "validate",
                    message: error.message,
                  })
                  return
                }}
                config={{ mode: "auto" }} // auto upload file as soon as it is selected / dropped in
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <Reorder.Group
            as="tbody"
            values={fields}
            onReorder={(e) => {
              const activeElement = fields[activeIndex]
              e.map((item, index) => {
                if (item === activeElement) {
                  move(activeIndex, index)
                  setActiveIndex(index)
                  return
                }
                return
              })
            }}
          >
            {fields.map((field, index) => {
              return (
                <Reorder.Item
                  as="tr"
                  key={field.id}
                  id={field.id}
                  value={field}
                  onDragStart={() => setActiveIndex(index)}
                  className={cn(field.url.search("blob:") === 0 ? "animate-pulse transition-all" : "", "text-sm font-semibold text-muted-foreground hover:text-primary")}
                >
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{field.name}</TableCell>
                  <TableCell>{(field.size / (1024 * 1024)).toFixed(2)} MB</TableCell>
                  <TableCell>
                    <figure className="flex items-center justify-center">
                      <Image
                        src={field.url}
                        alt={field.name}
                        className="rounded-md"
                        width={48}
                        height={48}
                      />
                    </figure>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={((e) => {
                        e.preventDefault()
                        remove(index)
                      })}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </Reorder.Item>
              )
            })}
          </Reorder.Group>
        </Table>
      </div>
    </div>
  )
}
