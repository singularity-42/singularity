const util = require('util');
const fs = require('fs');
const net = require('net');

// Read the configuration file
const config = {
  serverStartCommand: "yarn start",
  projectDirectory: ".",
  buildCommand: "yarn build",
  checkInterval: 5000,
  serverPort: 3000, // Change this to your server's port
};

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
    console.error(`Error starting server: ${error}`);
  }
}

async function handlePortInUse() {
  console.log('Port in use, waiting for it to become available...');
  while (true) {
    try {
      await checkPortAvailability(config.serverPort);
      console.log('Port is now available. Restarting the server...');
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

async function checkForUpdatesAndRebuild() {
  try {
    while (true) {
      // Check for updates - for example, read a directory or file content
      const files = await readdirAsync(config.projectDirectory);

      // Simulated check for updates - check if certain files have changed
      const fileContentsPromises = files.map(async (file) => {
        const content = await readFileAsync(`${config.projectDirectory}/${file}`, 'utf-8');
        return { file, content };
      });

      const fileContents = await Promise.all(fileContentsPromises);

      // Here, you can compare the file contents with some previous state
      // If changes are detected, rebuild the project
      const rebuildNeeded = /* Your logic to determine if rebuild is needed based on fileContents */ true;

      if (rebuildNeeded) {
        console.log(chalk.cyan('Rebuilding project...'));
        const { stdout, stderr } = await execAsync(config.buildCommand);
        console.log(chalk.green(`Build output: ${stdout}`));
        console.error(chalk.red(`Build error: ${stderr}`));
      }

      // Sleep for a certain interval before checking for updates again
      await new Promise((resolve) => setTimeout(resolve, config.checkInterval));
    }
  } catch (error) {
    console.error(chalk.red(`Error checking for updates or rebuilding: ${error}`));
  }
}

// Log functions (if needed)
function logServerOutput(data) {
  console.log(`Server output: ${data}`);
}

function logServerError(data) {
  console.error(`Server error: ${data}`);
}

// Run both tasks asynchronously
Promise.all([startServer(), checkForUpdatesAndRebuild()])
  .then(() => {
    console.log('Server and update check started.');
  })
  .catch((error) => {
    console.error(`Error starting server or update check: ${error}`);
  });
