require('dotenv').config()

// const helmet = require('helmet')
const multer = require('multer')
const upload = multer()
const fs = require('fs')

const sharp = require('sharp')

const express = require('express')
const app = express()
// app.use(helmet())
app.use(express.json())
app.use('/', express.static(__dirname+'/dist'))


app.post('/upload', upload.single('file'), async (req,res) => {
	try {

		if(!req.file.mimetype.includes('image/')){
			return res.status(400).send({error:'NOT_IMAGE'})
		}

		if(req.file.size>3e+8){
			return res.status(400).send({error:"SIZE_TO_BIG"})
		}
		
		const { width, height, format, position } = req.body;

		const formatedName = req.file.originalname.split('.')[0].concat('.'+format)
		const path = __dirname + "/temp/" + formatedName;

		const resized = await sharp(req.file.buffer)
			.resize({
				width: isNaN(width) ? null : Number(width),
				height: isNaN(height) ? null : Number(height),
				background: "#000",
				fit: position,
			})
			.toFile(path);

			res.status(200).sendFile(path)

			setTimeout(()=>{
				fs.unlink(path,(err)=>{
					if(err) console.log('Error: ',err)
				})
			},10_000)
	} catch (error) {
		console.log(error)
		return res.status(500).send({error:'SERVER_ERROR'})
	}

})

app.get('*', (req,res)=>{
	return res.redirect('/')
})

app.listen(process.env.PORT, ()=> console.log("Server image-Resize running at http://localhost:"+process.env.PORT))