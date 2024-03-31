const commands = {
    'help': () => {
        console.log('Available commands: help, echo, greet, clear');
        document.getElementById('cli-output').innerHTML += '<br>Available commands: help, echo, greet';
    },
    'echo': (message) => {
        console.log(message);
        document.getElementById('cli-output').innerHTML += `<br>${message}`;
    },
    'greet': () => {
        console.log('Hello, user!');
        document.getElementById('cli-output').innerHTML += '<br>Hello, user!';
    },
    'clear': () => {
        document.getElementById('cli-output').innerHTML = '';
    },
};

document.getElementById('cli-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const input = this.value;
        this.value = '';
        const [command, ...args] = input.split(' ');
        if (commands[command]) {
            commands[command](...args);
        } else {
            console.log('Command not found:', command);
            document.getElementById('cli-output').innerHTML += `<br>Command not found: ${command}`;
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
const dateTimeStyle = 'color: #ffff00;';

appendStyledMessage(title, titleStyle);
appendStyledMessage(dateTime, dateTimeStyle);

document.addEventListener('click', function(event) {
    const cliContainer = document.getElementById('cli-container');
    if (!cliContainer.contains(event.target)) {
        const inputField = document.getElementById('cli-input');
        inputField.focus();
    }
});
