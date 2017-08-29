const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

let server;
let gulp;

startup();

fs.watch('./gulpfile.js', () => {
    console.log(chalk.yellow('🤠\t Gulpfile change detected, reloading...'));
    cleanup();
    startup();
});

process.on('SIGINT', cleanup.bind(null, true));

function startup() {
    startServer();
    startGulp();
}

function cleanup(shouldExit) {
    console.log(chalk.gray('🤠\t Killing child processes'));
    server.kill();
    gulp.kill();

    if (shouldExit) {
        process.exit();
    }
}

function startServer() {
    console.log(chalk.gray('🤠\t Starting development server'));
    server = spawn('node', ['server/index'], { stdio: 'inherit' });
}

function startGulp() {
    console.log(chalk.gray('🤠\t Starting gulp task'));
    gulp = spawn('gulp.cmd', ['dev'], { stdio: 'inherit' });
}