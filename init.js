const util = require('util');
const fs = require('fs');
const net = require('net');
const colors = require('colors'); // Import colors.js for colorized console output

// get current directory
const currentDirectory = process.cwd();

// Read the configuration file
const config = {
  serverStartCommand: "yarn start",
  projectDirectory: currentDirectory,
  buildCommand: "yarn build",
  checkInterval: 1000,
  serverPort: 3000, // Change this to your server's port
};

const execAsync = util.promisify(require('child_process').exec);
const readdirAsync = util.promisify(fs.readdir);
const readFileAsync = util.promisify(fs.readFile);

async function startServer() {
  try {
    // Start the server asynchronously
    const { exec } = await import('child_process');
    const serverProcess = exec(config.serverStartCommand);
    serverProcess.stdout?.on('data', logServerOutput);
    serverProcess.stderr?.on('data', (data) => {
      logServerError(data);
      if (data.includes('EADDRINUSE')) {
        handlePortInUse();
      }
    });
  } catch (error) {
    console.error('Error starting server:'.red, error); // Using colors.js to colorize the error message
  }
}

async function handlePortInUse() {
  console.log('Port in use, waiting for it to become available...'.yellow);
  while (true) {
    try {
      await checkPortAvailability(config.serverPort);
      console.log('Port is now available. Restarting the server...'.green);
      await startServer();
      break;
    } catch (err) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
    }
  }
}

async function checkPortAvailability(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        server.close();
        reject(err);
      }
    });
    server.once('listening', () => {
      server.close();
      resolve();
    });
    server.listen(port, '::', () => {
      server.close();
      resolve();
    });
  });
}

async function executeGitPull() {
  try {
    const { stdout, stderr } = await execAsync('git pull');
    console.log(`Git pull output: ${stdout}`.cyan);
    console.error(`Git pull error: ${stderr}`.red);
  } catch (error) {
    console.error(`Error executing git pull: ${error}`.red);
  }
}
async function updateAndRebuild() {
  await executeGitPull(); // Execute git pull to fetch the latest changes
  
  try {
    // ... Perform other update-related actions like installing dependencies, building the app, etc.
    // Example:
    const { stdout, stderr } = await execAsync('yarn install && yarn build');
    console.log(`Update and rebuild output: ${stdout}`.cyan);
    console.error(`Update and rebuild error: ${stderr}`.red);
  } catch (error) {
    console.error(`Error updating and rebuilding: ${error}`.red);
  }
}

async function checkForUpdatesAndRebuild() {
  try {
    while (true) {
      console.log('Checking for updates...'.yellow);

      await updateAndRebuild(); // Perform update-related actions periodically

      // Sleep for a certain interval before checking for updates again
      await new Promise((resolve) => setTimeout(resolve, config.checkInterval));
    }
  } catch (error) {
    console.error(`Error checking for updates or rebuilding: ${error}`.red);
  }
}
// Log functions (if needed)
function logServerOutput(data) {
  console.log(`Server output: ${data}`.green);
}

function logServerError(data) {
  console.error(`Server error: ${data}`.red);
}

// Run both tasks asynchronously
Promise.all([startServer(), checkForUpdatesAndRebuild()])
  .then(() => {
    console.log('Server and update check started.'.blue);
  })
  .catch((error) => {
    console.error(`Error starting server or update check: ${error}`.red);
  });
