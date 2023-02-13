const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const objectSchema = new Schema({
	objectFilename: {
		type: String,
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
	renderImageFilename: {
		type: String,
		default: null,
	},
	textureDescriptions: {
		type: Object,
		default: {
			baseText: null,
			generatedText: null,
		},
	},
}, { timestamps: true });

const Model = mongoose.model('Object', objectSchema);
module.exports = Model;
