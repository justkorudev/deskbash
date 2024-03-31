const commands = {
    'help': () => {
        console.log('Available commands: help, echo, greet, clear');
        document.getElementById('cli-output').innerHTML += '<div>Available commands: help, echo, greet</div>';
    },
    'echo': (message) => {
        console.log(message);
        document.getElementById('cli-output').innerHTML += `<div>${message}</div>`;
    },
    'greet': () => {
        console.log('Hello, user!');
        document.getElementById('cli-output').innerHTML += '<div>Hello, user!</div>';
    },
    'clear': () => {
        document.getElementById('cli-output').innerHTML = '';
    },
    'ls': () => {
        const currentDir = fs[lwd];
        const files = currentDir.children;
        for (let i = 0; i < files.length; i++) {
            if (fs[`${lwd}/${files[i]}`].type === 'dir') {
                // Make directory names light blue
                files[i] = `<span style="color: #00ffff">${files[i]}</span>`;
            }
        }
        const filesString = files.join(' ');
        if (!filesString) {
            console.log('No files/folders in this directory');
            document.getElementById('cli-output').innerHTML += '<div>No files/folders in this directory</div>';
        } else {
            console.log(filesString);
            document.getElementById('cli-output').innerHTML += `<div>${filesString}</div>`;
        }
    },
    'cd': (dirName) => {
        if (dirName === '..') {
            const pathParts = lwd.split('/');
            pathParts.pop();
            const newPath = pathParts.join('/');
            if (newPath) {
                changeDir(newPath);
            }
        }
        if (fs[`${lwd}/${dirName}`].type !== 'dir') {
            console.log('Not a directory:', dirName);
            document.getElementById('cli-output').innerHTML += `<div>Not a directory: ${dirName}</div>`;
            return;
        }
        changeDir(`${lwd}/${dirName}`);
    },
    'mkdir': (dirName) => {
        const newDirPath = `${lwd}/${dirName}`;
        if (fs[newDirPath]) {
            console.log('Directory already exists:', newDirPath);
            document.getElementById('cli-output').innerHTML += `<div>Directory already exists: ${newDirPath}</div>`;
        } else {
            fs[newDirPath] = {
                type: 'dir',
                children: [],
            };
            fs[lwd].children.push(dirName);
            localStorage.setItem('fs', JSON.stringify(fs));
        }
    },
    'rmdir': (dirName) => {
        const dirPath = `${lwd}/${dirName}`;
        if (!fs[dirPath]) {
            console.log('No such directory:', dirPath);
            document.getElementById('cli-output').innerHTML += `<div>No such directory: ${dirPath}</div>`;
        } else {
            delete fs[dirPath];
            fs[lwd].children = fs[lwd].children.filter((child) => child !== dirName);
            localStorage.setItem('fs', JSON.stringify(fs));
        }
    },
    'touch': (fileName) => {
        const newFilePath = `${lwd}/${fileName}`;
        if (fs[newFilePath]) {
            console.log('File already exists:', newFilePath);
            document.getElementById('cli-output').innerHTML += `<div>File already exists: ${newFilePath}</div>`;
        } else {
            fs[newFilePath] = {
                type: 'file',
                content: '',
            };
            fs[lwd].children.push(fileName);
            localStorage.setItem('fs', JSON.stringify(fs));
        }
    },
    'rm': (fileName) => {
        const filePath = `${lwd}/${fileName}`;
        if (!fs[filePath]) {
            console.log('No such file:', filePath);
            document.getElementById('cli-output').innerHTML += `<div>No such file: ${filePath}</div>`;
        } else {
            delete fs[filePath];
            fs[lwd].children = fs[lwd].children.filter((child) => child !== fileName);
            localStorage.setItem('fs', JSON.stringify(fs));
        }
    },
};

let fs = {
    '/': {
        type: 'dir',
        children: ['/home'],
    },
    '/home': {
        type: 'dir',
        children: [],
    },
};

if (!localStorage.getItem('fs')) {
    localStorage.setItem('fs', JSON.stringify(fs));
} else {
    fs = JSON.parse(localStorage.getItem('fs'));
}

if (!fs['/home']) {
    fs['/home'] = {
        type: 'dir',
        children: [],
    };
}
localStorage.setItem('fs', JSON.stringify(fs));
let lwd = '/home';

function changeDir(path) {
    lwd = path;
    document.getElementById('cli-prompt').innerHTML = `dbsh:${lwd}/$`;
}

document.getElementById('cli-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        const input = this.value;
        this.value = '';
        const [command, ...args] = input.split(' ');
        if (commands[command]) {
            commands[command](...args);
        } else {
            console.log('Command not found:', command);
            document.getElementById('cli-output').innerHTML += `<div>Command not found: ${command}</div>`;
        }
        const containerDiv = document.getElementById('cli-output');
        containerDiv.scrollTop = containerDiv.scrollHeight;
    }
});

function appendStyledMessage(message, style) {
    const outputDiv = document.getElementById('cli-output');
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = style;
    messageDiv.innerHTML = message;
    outputDiv.appendChild(messageDiv);
}

const now = new Date();
const dateTimeString = now.toLocaleString();

const title = 'DeskBash v0.5 - Developed with ❤️ by @korudev';
const dateTime = `The current date and time is: ${dateTimeString}`;

const titleStyle = 'color: #00ff00; font-weight: bold;';
const heartStyle = 'color: #ff0000;';
const authorStyle = 'color: #00ffff;';
const dateTimeStyle = 'color: #ffff00; margin-top: 0px';

appendStyledMessage(title, titleStyle);
appendStyledMessage(dateTime, dateTimeStyle);

document.addEventListener('click', function (event) {
    const cliContainer = document.getElementById('cli-container');
    if (!cliContainer.contains(event.target)) {
        const inputField = document.getElementById('cli-input');
        inputField.focus();
    }
});
