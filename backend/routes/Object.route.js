const router = require('express').Router()
const Object = require('../models/Object.model')
const createError = require('http-errors')

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
		if (page) query.page = page

		const models = await Object.find(query).skip(skip).limit(itemsPerPage);
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
		const model = await Object.findById(id)
		if (!model) throw createError(404, 'Could not find model')
		Object.keys(req.body).forEach(key => {
			model[key] = req.body[key]
		})
		const savedModel = await model.save()
		if (!savedModel) throw createError(400, 'Could not save model')
		res.status(200).json(savedModel)
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

module.exports = router