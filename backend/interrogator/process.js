const { spawn, exec } = require('child_process');
const path = require('path');

let python;
let isPythonRunning = false;

// Function to start the Python process
function startPython() {
	const interrogator_path = path.join(__dirname, 'main.py');
	const activate_path = path.join(__dirname, '../../py_env', 'Scripts', 'activate.bat');

	// Activate the virtual environment
	exec(activate_path, (err, stdout, stderr) => {
		if (err) {
			console.log('Error activating virtual environment: ' + err);
			return;
		}
		console.log('Virtual environment activated.');
	});

	python = spawn('python ' + interrogator_path, { shell: true });

	// Collect the output from stdout and stderr
	let stdout = '';
	let stderr = '';
	python.stdout.on('data', (data) => {
		console.log('Interrogator process is ready!');
		stdout += data.toString();
	});
	python.stderr.on('data', (data) => {
		stderr += data.toString();
		console.log('stderr: ' + stderr);
	});
	console.log('Python process started...')

	// When the Python process exits, log the exit code and attempt to restart it
	python.on('close', (code) => {
		isPythonRunning = false;
		console.log(`Python process exited with code ${code}`);
		console.log('Attempting to restart Python process...');
		startPython();
	});

	isPythonRunning = true;
}

// Start the Python process on module load
startPython();

// Export a function to communicate with the Python process
function runInterrogator(baseText) {
  return new Promise((resolve, reject) => {
	if (!isPythonRunning) {
	  reject(new Error('Python script is not running. Attempting to start it...'));
	  startPython();
	  return;
	}

	// Send the parameters to the Python process using stdin
	python.stdin.write(`${baseText}\n`);

	// Collect the output from stdout and stderr
	let stdout = '';
	let stderr = '';
	python.stdout.on('data', (data) => {
	  stdout += data.toString();
	});
	python.stderr.on('data', (data) => {
	  stderr += data.toString();
	});

	// When the Python process returns the result, resolve the promise with the result
	python.stdout.once('data', (data) => {
	  resolve(data.toString());
	});

	// Set a timeout to handle cases where the Python process fails to respond
	setTimeout(() => {
	  reject(new Error('Interrogator did not respond in time'));
	}, 60000);
  });
}

module.exports = {
	runInterrogator,
};