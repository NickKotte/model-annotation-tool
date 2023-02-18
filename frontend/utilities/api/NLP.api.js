const { handleResponse } = require("../helpers")

/*
 * @param {String} description - the description to expand on
 * @returns {String} - the GPT expanded description
 */
export const expandDescription = (description, type) => {
	fetch(`/api/NLP/expand`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ description, type })
	})
	.then(handleResponse)
}