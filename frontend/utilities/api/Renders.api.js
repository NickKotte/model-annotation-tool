import { handleResponse } from '../helpers'

/*
 * @param {ID} id - the id of the model
 * @returns {Array} - an array of rendered images
 * 	- renderImageFilename: String
 * 	- createdAt: Date
 */
export const getRendersByModelId = (id) => {
	return fetch(`/api/models/${id}/renders`)
		.then(handleResponse)
}

/*
 * upload a new render
 * @param {ID} id - the id of the model
 * @param {Base64} image - the image to upload
 * @returns {Object} - the new render object
 */
export const createRender = (id, image) => {
	return fetch(`/api/models/${id}/renders`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ image })
	})
	.then(handleResponse)
}

/*
 * delete a render
 * @param {ID} id - the id of the model
 * @param {ID} renderId - the id of the render to delete
 * @returns {Object} - the deleted render object
 */
export const deleteRenderById = (id, renderId) => {
	return fetch(`/api/models/${id}/renders/${renderId}`, {
		method: 'DELETE'
	})
	.then(handleResponse)
}

/*
 * @param {ID} id - the id of the model
 * @param {ID} renderId - the id of the render
 * @returns {String} - a description of the model
 */
export const getInterrogation = (modelId, renderId) => {
	return fetch(`/api/models/${modelId}/renders/${renderId}/interrogation`)
		.then(handleResponse)
}