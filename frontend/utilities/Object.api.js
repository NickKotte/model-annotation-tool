import { handleResponse } from "./helpers"

/*
 * getModels takes an optional query string and returns a list of models.
 * If no query is provided, it returns all models.
 * a query object can be passed in with the following properties:
 * 	- page: Number
 * 	- itemsPerPage: Number
 * 	- classLabel: String
 * 	- filename: String
 *
 * @param {object} query - optional query options
 * @returns {array} - an array of objects
*/
export const getModels = (query) => {
	const queryString = new URLSearchParams(query).toString()
	return fetch(`/api/models${queryString}`)
		.then(handleResponse)
}

/*
 * 
 * @param {String} id 
 * @returns an object with the following properties:
 * 	- objectFilename: String
 * 	- classLabel: String
 * 	- modelDescriptions: Object
 * 		- baseText: String
 * 		- generatedText: String
 * 	- renderImageFilename: String
 * 	- textureDescriptions: Object
 * 		- baseText: String
 * 		- generatedText: String
 * 	- createdAt: Date
 * 	- updatedAt: Date
 * 	- id: String
 */
export const getModel = (id) => {
	return fetch(`/api/models/${id}`)
		.then(handleResponse)
}

/*
 *	Creates a new model
 * @param {Object} model - an object as defined earlier
 * @returns {Object} - the new model object
 */
export const createModel = (model) => {
	return fetch('/api/models', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(model)
	})
		.then(handleResponse)
}

/*
 * Updates a model
 * @param {String} id - the id of the model to update
 * @param {Object} model - an object as defined earlier
 * @returns {Object} - the updated model object
 */
export const updateModel = (id, model) => {
	return fetch(`/api/models/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(model)
	})
		.then(handleResponse)
}

/*
 * Deletes a model
 * @param {String} id - the id of the model to delete
 * @returns {Object} - the deleted model object
 */
export const deleteModel = (id) => {
	return fetch(`/api/models/${id}`, {
		method: 'DELETE'
	})
		.then(handleResponse)
}