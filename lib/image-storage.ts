import { randomUUID } from 'crypto'
import { mkdir, unlink, writeFile } from 'fs/promises'
import { resolve, sep } from 'path'
import { del, put } from '@vercel/blob'

const maxAge = 60 * 60 * 24 * 365

export class ImageStorageConfigurationError extends Error {
  constructor() {
    super('Image storage is not configured. Connect a Vercel Blob store to this project.')
    this.name = 'ImageStorageConfigurationError'
  }
}

function isBlobConfigured() {
  return Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
    (process.env.VERCEL_OIDC_TOKEN && process.env.BLOB_STORE_ID)
  )
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_') || 'image'
}

export async function storeImage(file: File) {
  const filename = `${randomUUID()}-${sanitizeFilename(file.name)}`

  if (isBlobConfigured()) {
    const blob = await put(`uploads/${filename}`, file, {
      access: 'public',
      addRandomSuffix: true,
      cacheControlMaxAge: maxAge,
    })
    return { url: blob.url, path: blob.url, filename: blob.pathname }
  }

  if (process.env.NODE_ENV === 'production') {
    throw new ImageStorageConfigurationError()
  }

  const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })
  await writeFile(resolve(uploadsDir, filename), Buffer.from(await file.arrayBuffer()))

  return {
    url: `/uploads/${filename}`,
    path: `uploads/${filename}`,
    filename,
  }
}

export async function deleteStoredImage(filePath: string) {
  if (filePath.startsWith('https://')) {
    const url = new URL(filePath)
    if (!url.hostname.endsWith('.public.blob.vercel-storage.com')) {
      throw new Error('Only images stored in Vercel Blob can be deleted.')
    }

    if (!isBlobConfigured()) {
      throw new ImageStorageConfigurationError()
    }

    await del(filePath)
    return
  }

  const relativePath = filePath.replace(/^\/+/, '').replace(/\\/g, '/')
  if (!relativePath.startsWith('uploads/') || relativePath.split('/').includes('..')) {
    throw new Error('Invalid image path.')
  }

  const uploadsDir = resolve(process.cwd(), 'public', 'uploads')
  const fullPath = resolve(process.cwd(), 'public', relativePath)
  if (!fullPath.startsWith(`${uploadsDir}${sep}`)) {
    throw new Error('Invalid image path.')
  }
  await unlink(fullPath)
}
