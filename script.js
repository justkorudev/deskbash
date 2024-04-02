const extensionstoreurl = 'https://justkorudev.github.io/deskbash-extensions/';
const version = '2.0';

const systemcommands = {
    'help': () => {
        console.log('To get help with DeskBash, visit <a href="https://deskbash.gitbook.io/deskbash-docs/">this page</a>.');
        document.getElementById('cli-output').innerHTML += '<div>To get help with DeskBash, visit <a href="https://deskbash.gitbook.io/deskbash-docs/">this page</a>.</div>';
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
    'cat': (fileName) => {
        const filePath = `${lwd}/${fileName}`;
        if (fs[filePath].type !== 'file') {
            console.log('Not a file:', filePath);
            document.getElementById('cli-output').innerHTML += `<div>Not a file: ${filePath}</div>`;
        } else {
            console.log(fs[filePath].content);
            document.getElementById('cli-output').innerHTML += `<div>${fs[filePath].content}</div>`;
        }
    },
    'editfile': (fileName) => {
        let editingfilepath = '';
        if (fileName.includes('/')) {
            editingfilepath = fileName;
        } else {
            editingfilepath = `${lwd}/${fileName}`;
        }
        window.location.href = `textedit.html?file=${editingfilepath}&cli=${lwd}`;
    },
    'ping': (destination) => {
        if (!destination) {
            console.log('Please provide a destination to ping');
            document.getElementById('cli-output').innerHTML += '<div>Please provide a destination to ping</div>';
            return;
        }
        if (!destination.includes('://')) {
            destination = `https://${destination}`;
        }
        fetch("https://corsproxy.io/?" + destination)
            .then(response => response.text())
            .then(data => {
                console.log('Ping successful');
                document.getElementById('cli-output').innerHTML += `<div>Ping successful!</div>`;
            })
            .catch(error => {
                if (error.toString().includes('TypeError: Failed to fetch')) {
                    console.log('Ping failed: CORS error');
                    document.getElementById('cli-output').innerHTML += '<div>Ping failed: CORS error (more info <a href="https://deskbash.gitbook.io/deskbash-docs/common-issues#cors-errors-on-ping-command">here</a>).</div>';
                    return;
                }
                console.log('Ping failed:', error);
                document.getElementById('cli-output').innerHTML += `<div>Ping failed: ${error}</div>`;
            });
    },
    'renfile': (oldName, newName) => {
        const oldPath = `${lwd}/${oldName}`;
        const newPath = `${lwd}/${newName}`;
        if (!fs[oldPath]) {
            console.log('No such file/directory:', oldPath);
            document.getElementById('cli-output').innerHTML += `<div>No such file/directory: ${oldPath}</div>`;
        } else if (fs[newPath]) {
            console.log('File/directory already exists:', newPath);
            document.getElementById('cli-output').innerHTML += `<div>File/directory already exists: ${newPath}</div>`;
        } else {
            if (fs[oldPath].type === 'dir') {
                console.log('You cannot rename directories using this command');
                document.getElementById('cli-output').innerHTML += '<div>You cannot rename directories using this command</div>';
            }
            fs[newPath] = fs[oldPath];
            delete fs[oldPath];
            fs[lwd].children = fs[lwd].children.map((child) => (child === oldName ? newName : child));
            localStorage.setItem('fs', JSON.stringify(fs));
        }
    },
    'rendir': (oldName, newName) => {
        const oldPath = `${lwd}/${oldName}`;
        const newPath = `${lwd}/${newName}`;
        if (!fs[oldPath]) {
            console.log('No such file/directory:', oldPath);
            document.getElementById('cli-output').innerHTML += `<div>No such file/directory: ${oldPath}</div>`;
        } else if (fs[newPath]) {
            console.log('File/directory already exists:', newPath);
            document.getElementById('cli-output').innerHTML += `<div>File/directory already exists: ${newPath}</div>`;
        } else {
            if (fs[oldPath].type === 'file') {
                console.log('You cannot rename files using this command');
                document.getElementById('cli-output').innerHTML += '<div>You cannot rename files using this command</div>';
            }
            fs[newPath] = fs[oldPath];
            delete fs[oldPath];
            fs[lwd].children = fs[lwd].children.map((child) => (child === oldName ? newName : child));
            localStorage.setItem('fs', JSON.stringify(fs));
        }
    },
    'download': (fileName) => {
        const filePath = `${lwd}/${fileName}`;
        if (!fs[filePath]) {
            console.log('No such file:', filePath);
            document.getElementById('cli-output').innerHTML += `<div>No such file: ${filePath}</div>`;
        } else {
            const fileContent = fs[filePath].content;
            const blob = new Blob([fileContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }
    },
    'getextension': (extName) => {
        fetch(`${extensionstoreurl}${extName}.js`)
            .then(response => response.text())
            .then(data => {
                if (extensionsinstalled.find(ext => ext.name === data.name)) {
                    console.log('Extension already installed:', extName);
                    document.getElementById('cli-output').innerHTML += `<div>Extension already installed: ${extName}</div>`;
                    return;
                }
                data = eval(`(${data})`);
                extensioncommands = { ...extensioncommands, ...data.commands };
                // for each function in extensioncommands, convert it to string and add it to extensioncommandsstring, making it a valid json string
                let extensioncommandsstring = '';
                for (const [key, value] of Object.entries(extensioncommands)) {
                    extensioncommandsstring += `{"${key}": ${value.toString()}},`;
                }
                localStorage.setItem('extensioncommands', extensioncommandsstring);
                console.log(localStorage.getItem('extensioncommands'));
                availablecommands = { ...systemcommands, ...extensioncommands };
                extensionsinstalled.push(data.name);
                localStorage.setItem('extensionsinstalled', JSON.stringify(extensionsinstalled));
                console.log('Extension installed:', extName);
                document.getElementById('cli-output').innerHTML += `<div>Extension installed: ${extName}</div>`;
            })
            .catch(error => {
                console.log('Error installing ', extName, ": " + error);
                document.getElementById('cli-output').innerHTML += `<div>Error installing ${extName}.</div>`;
            });
    },
    'installextension': (file) => {
        console.log('Warning: Installing extensions from untrusted sources can be a security risk.');
        document.getElementById('cli-output').innerHTML += '<div style="color: #ff0000">Warning: Installing extensions from untrusted sources can be a security risk. Do you want to continue? (y/n)</div>';
        const containerDiv = document.getElementById('cli-output');
        containerDiv.scrollTop = containerDiv.scrollHeight;
        function waitForUserInput() {
            return new Promise((resolve) => {
                document.getElementById('cli-input').addEventListener('keydown', function (event) {
                    if (event.key === 'y' || event.key === 'n') {
                        const input = event.key;
                        this.value = '';
                        resolve(input);
                    }
                });
            });
        }
        waitForUserInput().then((input) => {
            console.log(input);
            if (input === 'y') {
                console.log('Installation confirmed');
                document.getElementById('cli-input').value = '';
                document.getElementById('cli-output').innerHTML += '<div>Installation confirmed</div>';
                let extensionfile = '';
                if (file.includes('/')) {
                    extensionfile = file;
                } else {
                    extensionfile = `${lwd}/${file}`;
                }
                if (!fs[extensionfile]) {
                    console.log('No such file:', extensionfile);
                    document.getElementById('cli-output').innerHTML += `<div>No such file: ${extensionfile}</div>`;
                    return;
                }
                if (!extensionfile.endsWith('.dbex')) {
                    console.log('Not a .dbex file:', extensionfile);
                    document.getElementById('cli-output').innerHTML += `<div>Not a .dbex extension file: ${extensionfile}</div>`;
                    return;
                }
                const extensioncontent = fs[extensionfile].content;
                let extname = '';
                extname = eval(`(${extensioncontent})`).name;;
                if (extensionsinstalled.find(ext => ext === extname)) {
                    console.log('Extension already installed:', extname);
                    document.getElementById('cli-output').innerHTML += `<div>Extension already installed: ${extname}</div>`;
                    return;
                }
                let extensioncommands = eval(`(${extensioncontent})`).commands;
                extensioncommands = { ...extensioncommands, ...extensioncommands };
                let extensioncommandsstring = '';
                for (const [key, value] of Object.entries(extensioncommands)) {
                    extensioncommandsstring += `{"${key}": ${value.toString()}},`;
                }
                localStorage.setItem('extensioncommands', extensioncommandsstring);
                availablecommands = { ...systemcommands, ...extensioncommands };
                extensionsinstalled.push(extname);
                localStorage.setItem('extensionsinstalled', JSON.stringify(extensionsinstalled));
                console.log('Extension installed:', extname);
                document.getElementById('cli-output').innerHTML += `<div>Extension installed: ${extname}</div>`;
            } else {
                console.log('Installation cancelled');
                document.getElementById('cli-input').value = '';
                document.getElementById('cli-output').innerHTML += '<div>Installation cancelled</div>';
                return;
            }
        });

    },
    'importfile': (url) => {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                const fileName = url.split('/').pop();
                fs[`${lwd}/${fileName}`] = {
                    type: 'file',
                    content: data,
                };
                fs[lwd].children.push(fileName);
                localStorage.setItem('fs', JSON.stringify(fs));
                console.log('File imported:', fileName);
                document.getElementById('cli-output').innerHTML += `<div>File imported: ${fileName}</div>`;
            })
            .catch(error => {
                console.log("Error downloading file: " + error)
                document.getElementById('cli-output').innerHTML += `<div>Error downloading file.</div>`;
            });
    },
    'y' : () => {},
    'n' : () => {}
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

let extensionsinstalled = [];

if (!localStorage.getItem('extensionsinstalled')) {
    localStorage.setItem('extensionsinstalled', JSON.stringify(extensionsinstalled));
} else {
    extensionsinstalled = JSON.parse(localStorage.getItem('extensionsinstalled'));
}

let extensioncommands = {};

if (!localStorage.getItem('extensioncommands')) {
    localStorage.setItem('extensioncommands', JSON.stringify(extensioncommands));
} else {
    const extensioncommandsstring = localStorage.getItem('extensioncommands');
    const extensioncommandsarray = eval(`[${extensioncommandsstring}]`);
    for (const command of extensioncommandsarray) {
        extensioncommands = { ...extensioncommands, ...command };
    }
}

let availablecommands = { ...systemcommands, ...extensioncommands };

if (!fs['/home']) {
    fs['/home'] = {
        type: 'dir',
        children: [],
    };
}
localStorage.setItem('fs', JSON.stringify(fs));
let lwd = '/home';
urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('cli')) {
    changeDir(urlParams.get('cli'));
}

function changeDir(path) {
    lwd = path;
    document.getElementById('cli-prompt').innerHTML = `dbsh:${lwd}/$`;
    window.history.pushState({}, '', `index.html?cli=${lwd}`);
}

document.getElementById('cli-input').addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        if (!this.value) {
            return;
        }
        const input = this.value;
        this.value = '';
        const [command, ...args] = input.split(' ');
        if (availablecommands[command]) {
            availablecommands[command](...args);
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

const title = 'DeskBash v' + version + ' - Developed with ❤️ by @korudev';
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
