const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const objectSchema = new Schema({
	objectFilename: {
		type: String,
		required: true,
	},
	fileSize: {
		type: Number,
		required: true,
	},
	classLabel: {
		type: String,
		required: true,
	},
	modelDescriptions: {
		type: Object,
		default: {
			baseText: {
				type: String,
				required: true,
			},
			generatedText: null,
		},
	},
	textureDescriptions: {
		type: Object,
		default: {
			baseText: null,
			generatedText: null,
		},
	},
	numTokens: {
		type: Number,
		default: 0,
	},
	isComplex: {
		type: Boolean,
		default: false,
	},
	renderImages: {
		type: Array,
		default: [],
	},
}, { timestamps: true });

const Model = mongoose.model('Object', objectSchema);
module.exports = Model;
