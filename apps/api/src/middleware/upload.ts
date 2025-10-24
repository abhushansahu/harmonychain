import multer from 'multer'
import path from 'path'

// Configure multer for memory storage (we'll upload to IPFS)
const storage = multer.memoryStorage()

// File filter for audio files
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedMimes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/flac',
    'audio/aac',
    'audio/ogg',
    'audio/m4a'
  ]
  
  const allowedExtensions = ['.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a']
  
  const isAllowedMime = allowedMimes.includes(file.mimetype)
  const isAllowedExt = allowedExtensions.some(ext => 
    file.originalname.toLowerCase().endsWith(ext)
  )
  
  if (isAllowedMime || isAllowedExt) {
    cb(null, true)
  } else {
    cb(new Error('Only audio files are allowed'), false)
  }
}

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 2 // Maximum 2 files (audio + cover art)
  }
})

// Middleware for single audio file
export const uploadAudio = upload.single('audioFile')

// Middleware for cover art
export const uploadCoverArt = upload.single('coverArt')

// Middleware for both files
export const uploadFiles = upload.fields([
  { name: 'audioFile', maxCount: 1 },
  { name: 'coverArt', maxCount: 1 }
])

// Error handler for multer
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large',
        message: 'File size must be less than 100MB'
      })
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        error: 'Too many files',
        message: 'Maximum 2 files allowed'
      })
    }
  }
  
  if (error.message === 'Only audio files are allowed') {
    return res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: 'Only audio files are allowed'
    })
  }
  
  next(error)
}
