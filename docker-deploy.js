const { spawn } = require('child_process');

const env = process.argv[2] || 'dev';

const imageName = env === 'prod'
    ? 'zorinalex/ticketsback_prod'
    : 'zorinalex/ticketsback';

const dockerfilePath = `./Dockerfile`;

// Docker build and push commands
const buildCommand = `docker build -t ${imageName} -f ${dockerfilePath} .`;
const pushCommand = `docker push ${imageName}`;

// Function to run a shell command and return a promise
const runCommand = (command, commandName) => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, { shell: true });

        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        process.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        process.on('close', (code) => {
            if (code === 0) {
                console.log(`${commandName} completed successfully.`);
                resolve();
            } else {
                reject(new Error(`${commandName} exited with code ${code}.`));
            }
        });
    });
};

// Execute the commands sequentially
(async () => {
    try {
        console.log('Building Docker image...');
        await runCommand(buildCommand, 'Docker build');

        console.log('Pushing Docker image...');
        await runCommand(pushCommand, 'Docker push');

        console.log('Docker build and push process completed successfully.');
    } catch (error) {
        console.error('Error during Docker process:', error.message);
        process.exit(1);
    }
})();
