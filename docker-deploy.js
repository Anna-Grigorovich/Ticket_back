const { spawn } = require('child_process');

const imageName = `grigorovich826/ticketsback`;
const dockerfilePath = `../Dockerfile`;

const dockerUsername = process.env.DOCKER_USERNAME;
const dockerPassword = process.env.DOCKER_PASSWORD;

if (!dockerUsername || !dockerPassword) {
    console.error('Error: Docker username or password not set in environment variables.');
    process.exit(1);
}

// Docker login command
const loginCommand = `echo ${dockerPassword} | docker login -u ${dockerUsername} --password-stdin`;

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
        console.log('Logging into Docker...');
        await runCommand(loginCommand, 'Docker login');

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
