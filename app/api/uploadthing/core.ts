import { createUploadthing, type FileRouter } from "uploadthing/next"


const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata }
    }),
  variantImagesUploader: f({ image: { maxFileCount: 8, maxFileSize: "4MB" } })
    .onUploadComplete(async ({ file, metadata }) => {
      return { uploadedBy: metadata }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter