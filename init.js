const { exec } = require('child_process');
const colors = require('colors');

// Function to execute shell commands
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${command}`);
        console.error(stderr);
        reject(error);
      } else {
        resolve(stdout.trim()); // Trimming the output to remove unnecessary spaces or line breaks
      }
    });
  });
};

// Function to perform Git operations
const checkGitStatus = async () => {
  try {
    // Execute 'git status' command
    const statusOutput = await executeCommand('git status');

    // Check if there are changes in the repository
    if (statusOutput.includes('Changes not staged for commit')) {
      console.log('Changes detected. Performing actions...'.yellow);

      // Execute 'git pull'
      await executeCommand('git pull');

      // Execute 'yarn install'
      await executeCommand('yarn');

      // Execute 'yarn build'
      await executeCommand('yarn build');

      // Execute 'screen -r web' (assuming 'screen' is installed)
      await executeCommand('screen -S web -X stuff "yarn start\n"');

      console.log('Actions completed.'.green);
    } else {
      console.log('No changes detected. Waiting for next check...'.cyan);
    }
  } catch (err) {
    console.error('Error occurred:', err);
  }
};

// Function to periodically check Git status
const checkGitStatusPeriodically = () => {
  setInterval(checkGitStatus, 4200); // Interval set to 4.2 seconds (in milliseconds)
};

// Start checking Git status periodically
checkGitStatusPeriodically();
