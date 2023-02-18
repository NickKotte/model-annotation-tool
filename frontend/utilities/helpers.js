// Provides a consistent interface for handling responses from the server. 
export const handleResponse = (res) => {
	let json = res.json()
	if (res.ok) return json
	return json.then(err => { throw err.error })
}