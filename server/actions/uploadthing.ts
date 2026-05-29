'use server'

import { UTApi } from 'uploadthing/server'

export async function utapiDeleteFiles(key: string) {
  const utapi = new UTApi()
  await utapi.deleteFiles(key)
}