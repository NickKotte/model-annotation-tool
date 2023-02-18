const router = require('express').Router()
const Object = require('../models/Object.model')
const createError = require('http-errors')
const multer = require('multer')
const sharp = require('sharp')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
// const { runInterrogator } = require('../interrogator/process')

const storage = multer.memoryStorage()
const upload = multer({
	storage,
	fileFilter: (req, file, cb) => {
	  const isBase64 = file.mimetype === 'text/plain';
	  if (isBase64) {
		cb(null, true);
	  } else {
		cb(new Error('Invalid file type.'));
	  }
	},
  })

// @route   GET api/models
// @desc    Get all models
// @access  Public
router.get('/', async (req, res, next) => {
	try {
		const { classLabel, filename } = req.query
		const itemsPerPage = req.query.itemsPerPage || 10;
		const page = req.query.page || 1;
		const skip = (page - 1) * itemsPerPage;

		let query = {}
		if (classLabel) query.classLabel = classLabel
		if (filename) query.objectFilename = { $regex: filename, $options: 'i' }
		
		const models = await Object.find(query).skip(skip).limit(itemsPerPage)
		for(let model of models) {
			const imagesDirectory = path.join(__dirname, `../../public/${model._id}/renders`)
			const images = getImages(imagesDirectory).map(image => `/public/${model._id}/renders/${image}`)
			model.renderImages = images
		}
		console.log(models)
		res.status(200).json(models);
	} catch (err) {
		next(err)
	}
})

// @route   GET api/models/:id
// @desc    Get a model by id
// @access  Public
router.get('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		if (!id) throw createError(400, 'No id provided')
		const model = await Object.findById(id)
		if (!model) throw createError(404, 'Could not find model')
		res.status(200).json(model)
	} catch (err) {
		next(err)
	}
})

// @route   POST api/models
// @desc    Create a model
// @access  Public
router.post('/', async (req, res, next) => {
	try {
		console.log(req.body)
		const model = await Object.create(req.body)
		if (!model) throw createError(400, 'Could not create model')
		res.status(201).json(model)
	} catch (err) {
		next(err)
	}
})

// @route   PUT api/models/:id
// @desc    Update a model
// @access  Public
router.put('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		if (!id) throw createError(400, 'No id provided')
		const update = req.body
		if (!update) throw createError(400, 'No update provided')
		const model = await Object.findByIdAndUpdate(
			id,
			update,
			{ new: true }
		)
		if (!model) throw createError(404, 'Could not find model')
		res.status(200).json(model)

	} catch (err) {
		next(err)
	}
})

// @route   DELETE api/models/:id
// @desc    Delete a model
// @access  Public
router.delete('/:id', async (req, res, next) => {
	try {
		const { id } = req.params
		if (!id) throw createError(400, 'No id provided')
		const model = await Object.findById(id)
		if (!model) throw createError(404, 'Could not find model')
		const deletedModel = await model.remove()
		if (!deletedModel) throw createError(400, 'Could not delete model')
		res.status(200).json(deletedModel)
	} catch (err) {
		next(err)
	}
})

// @route   GET api/models/:id/renders
// @desc    Get all renders for a model
// @access  Public
router.get('/:id/renders', async (req, res, next) => {
	try {
		const { id } = req.params
		if (!id) throw createError(400, 'No id provided')
		const model = await Object.findById(id)
		if (!model) throw createError(404, 'Could not find model')
		
	} catch (err) {
		next(err)
	}
})

// @route   POST api/models/:id/renders
// @desc    Create a render for a model
// @access  Public
router.post('/:id/renders', upload.single('image'), async (req, res, next) => {
	try {
		const { id } = req.params
		if (!id) throw createError(400, 'No id provided')
		
		// get the base64 encoded image from the request body
		const { image } = req.body
		if (!image) throw createError(400, 'No image provided')

		const base64Data = image.replace(/^data:image\/png;base64,/, "");
		const shortUUID = uuidv4().substring(0, 8)
		const filename = shortUUID + '.jpeg';
		const outputDir = path.join(__dirname, `../../public/${id}/renders`)
		const filepath = path.join(outputDir, filename)

		// create the output directory if it doesn't exist
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true })
		}

		// use sharp to decrompress and compress the image, then store it
		sharp(Buffer.from(base64Data, 'base64'))
			.toFormat('jpeg', { quality: 80 })
			.resize(512, 512)
			.toFile(filepath, async (err, info) => {
				if (err) createError(400, err)
				// const interrogation = await runInterrogator(filepath)
				// console.log(interrogation)
			})

		const model = await getModel(id)
		res.status(201).json(model)
		
	} catch (err) {
		next(err)
	}
})

// @route   DELETE api/models/:id/renders/:renderId
// @desc    Delete a render for a model
// @access  Public
router.delete('/:id/renders/:renderId', async (req, res, next) => {
	try {
		const { id, renderId } = req.params
		if (!id) throw createError(400, 'No id provided')
		if (!renderId) throw createError(400, 'No renderId provided')
		// delete the image from the file system
		const dir = path.join(__dirname, `../../public/${id}/renders`)
		const images = getImages(dir)
		const image = images.find(image => image.startsWith(renderId))
		if (!image) throw createError(404, 'Could not find image')
		// delete the image
		const imagePath = path.join(dir, image)
		await fs.promises.unlink(imagePath)
		const model = await getModel(id)
		res.status(200).json(model)

	} catch (err) {
		next(err)
	}
})


module.exports = router

// helper function to get images from a directory
const getImages = (dir) => {
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true })
	}
	const files = fs.readdirSync(dir)
	const images = files.filter(file => file.endsWith('.jpeg'))
	return images
}

const getModel = async (id) => {
	const model = await Object.findById(id);
	if (!model) throw createError(404, 'Could not find model')
	const dir = path.join(__dirname, `../../public/${id}/renders`)
	const images = getImages(dir)
	const renderImages = images.map(image => `/public/${id}/renders/${image}`)
	return { ...model._doc, renderImages }
}