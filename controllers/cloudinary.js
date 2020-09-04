require('dotenv').config()
const fs = require('fs')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const Formidable = require('formidable')

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`)
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)
        if (ext !== '.jpg' || ext !== '.png') {
            return cb(res.status(400).end('only jpg, png are allowed'), false);
        }
        cb(null, true)
    }
})


const upload = multer({ storage: storage }).single("file")


exports.postImg = (req, res, next) => {
  
    upload(req, res, (err) => {
      if (err) {
        return res.json({ success: false, err })
      }
      console.log('file uploaded to server')
      console.log(req.file)
      
      const path = req.file.path
      const uniqueFilename = new Date().toISOString()
  
      cloudinary.uploader.upload(
        path,
        { public_id: `merneco/${uniqueFilename}`, tags: `merneco` }, // directory and tags are optional
        (err, image) => {
          if (err) return res.send(err)
          console.log('file uploaded to Cloudinary')
          // remove file from server
          
          fs.unlinkSync(path)
          // return image details
          res.json(image)
        }
      )
    })
  }

exports.ImgUpload = (req, res, next) => {
    const form = new Formidable()
    form.parse(req, (err, fields, files) =>{
      console.log(req.file)
      // const path = req.file.path
      const uniqueFilename = new Date().toISOString()
  
      cloudinary.uploader.upload(
        files.file.path,
        { public_id: `merneco/${uniqueFilename}`, tags: `merneco` }, // directory and tags are optional
        (err, image) => {
          if (err) return res.send(err)
          console.log('file uploaded to Cloudinary')
          res.json(image)
        }
      )
    })
      
}

exports.removeImg = (photoId) => {
  cloudinary.uploader.destroy(photoId, function(result) { console.log(result) })
}