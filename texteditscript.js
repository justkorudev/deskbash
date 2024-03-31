const urlParams = new URLSearchParams(window.location.search);

if (!localStorage.getItem('fs')) {
    const cli = urlParams.get('cli');
    if (cli) {
        window.location.href = `index.html?cli=${cli}`;
    } else {
        window.location.href = 'index.html';
    }
}

let fs = JSON.parse(localStorage.getItem('fs'));

const fileToEdit = urlParams.get('file');
if (fileToEdit) {
    if (!fs[fileToEdit]) {
        console.log('No such file:', fileToEdit);
        const cli = urlParams.get('cli');
        if (cli) {
            window.location.href = `index.html?cli=${cli}`;
        } else {
            window.location.href = 'index.html';
        }
    } else {
        if (fs[fileToEdit].type !== 'file') {
            console.log('Not a file:', fileToEdit);
            const cli = urlParams.get('cli');
            if (cli) {
                window.location.href = `index.html?cli=${cli}`;
            } else {
                window.location.href = 'index.html';
            }
        }
        console.log(fs[fileToEdit].content)
            document.getElementById('filecontent').value = fs[fileToEdit].content;
    }
}

document.addEventListener('keydown', (event) => {
    if (event.ctrlKey || event.metaKey) {
        if (event.key === 's') {
            event.preventDefault();
            const fileContent = document.getElementById('filecontent').value;
            fs[fileToEdit].content = fileContent;
            localStorage.setItem('fs', JSON.stringify(fs));
            console.log('File saved:', fileToEdit);
        }
        if (event.key === 'x') {
            event.preventDefault();
            const cli = urlParams.get('cli');
            if (cli) {
                window.location.href = `index.html?cli=${cli}`;
            } else {
                window.location.href = 'index.html';
            }
        }
    }
});