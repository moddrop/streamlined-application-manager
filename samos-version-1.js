const info = document.getElementsByClassName('info');
const program = document.getElementsByClassName('program');
const game = document.getElementsByClassName('game');
const intro = document.getElementById('intro');
const button = document.getElementById('makeHtml');
const linkContainer = document.getElementById('linkContainer');
const inspectorConsole = document.getElementById('inspectorConsole');
const introsound = document.getElementById("introsound");
const remindersound = document.getElementById('remindersound');
const reminderfirst = document.getElementById('reminder-1');
const volumemixerfirst = document.getElementById('volumemixer');
const volumemixersound = document.getElementById('volumemixersound');

function openvolumemixer() {
    document.getElementById('volumemixer').style.display = "block";
}

function volumeclosebutton() {
    document.getElementById('volumemixer').style.display = "none";
}

function introclosebutton() {
    document.getElementById('intro').style.display = "none";
}

function updatePreview() {
    const editor = document.getElementById('htmlEditor');
    const preview = document.getElementById('previewFrame');
    const previewDoc = preview.contentWindow.document;
    previewDoc.open();
    previewDoc.write(editor.value);
    previewDoc.close();
}

function reminder1closebutton() {
    document.getElementById('reminder-1').style.display = "none";
}

window.onload = updatePreview;

function show() {
    document.getElementById('image').style.display = "block";
    document.getElementById('image-button').style.display = "none";
}

function preview() {
    document.getElementById('preview').style.display = "block";
    document.getElementById('preview-button').style.display = "none";
}

function bluetheme() { document.body.style.backgroundColor = "blue"; }
function redtheme() { document.body.style.backgroundColor = "red"; }
function greentheme() { document.body.style.backgroundColor = "green"; }
function fontchange() { document.body.style.fontSize = "10px"; }
function skytheme() { document.body.style.backgroundImage = "url('https://images.unsplash.com/photo-1700901555562-952f0008a11f?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhdXRpZnVsJTIwc2t5fGVufDB8fDB8fHww&fm=jpg&q=60&w=3000')"; }
function resettheme() { document.body.style.background = "none"; }
function deskchange1() { document.getElementById('desktop').style.backgroundColor = "blue"; }
function deskchange2() { document.getElementById('desktop').style.backgroundColor = "blue"; }
function updateInspector() { inspectorConsole.textContent = htmlEditor.value; }

let offsetX, offsetY, isDown = false;
intro.addEventListener('mousedown', (e) => {
    isDown = true;
    offsetX = e.clientX - intro.offsetLeft;
    offsetY = e.clientY - intro.offsetTop;
});

document.addEventListener('mouseup', () => { isDown = false; });

document.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    intro.style.left = (e.clientX - offsetX) + 'px';
    intro.style.top = (e.clientY - offsetY) + 'px';
});

intro.addEventListener("mouseenter", () => {
    introsound.currentTime = 0;
    introsound.play();
});

reminderfirst.addEventListener("mouseenter", () => {
    remindersound.currentTime = 0;
    remindersound.play();
});

volumemixerfirst.addEventListener("mouseenter", () => {
    volumemixersound.currentTime = 0;
    volumemixersound.play();
});

const clicker = document.createElement('button');
clicker.textContent = 'Upload .txt File';
document.getElementById('container').appendChild(clicker);

const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = '.txt';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

clicker.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const text = e.target.result;
        const output = document.getElementById('output-txt');
        output.innerHTML = '';
        const icon = document.createElement('img');
        icon.src = 'txt-icon.png';
        icon.style.width = '60px';
        icon.style.cursor = 'pointer';
        output.appendChild(icon);

        icon.addEventListener('click', () => {
            icon.remove();
            createDraggableBox(text);
        });
    };
    reader.readAsText(file);
});

function createDraggableBox(text) {
    const newBox = document.createElement('div');
    newBox.textContent = text;
    newBox.style.position = 'absolute';
    newBox.style.left = '100px';
    newBox.style.top = '100px';
    newBox.style.width = '300px';
    newBox.style.height = '200px';
    newBox.style.overflow = 'auto';
    newBox.style.background = 'rgb(194, 194, 194)';
    newBox.style.border = '2px solid black';
    newBox.style.cursor = 'move';
    document.body.appendChild(newBox);

    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    newBox.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - newBox.offsetLeft;
        dragOffsetY = e.clientY - newBox.offsetTop;
        newBox.style.opacity = '0.8';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            newBox.style.left = e.clientX - dragOffsetX + 'px';
            newBox.style.top = e.clientY - dragOffsetY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        newBox.style.opacity = '1';
    });
}

const musicButton = document.createElement('button');
musicButton.textContent = 'Upload Music File';
document.getElementById('container').appendChild(musicButton);

const musicInput = document.createElement('input');
musicInput.type = 'file';
musicInput.accept = '.mp3, .wav, .ogg';
musicInput.style.display = 'none';
document.body.appendChild(musicInput);

musicButton.addEventListener('click', () => musicInput.click());

musicInput.addEventListener('change', () => {
    const file = musicInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const musicURL = e.target.result;
        const output = document.getElementById('output-txt');
        const icon = document.createElement('img');
        icon.src = 'mp3-icon.png';
        icon.style.width = '60px';
        icon.style.cursor = 'pointer';
        icon.title = file.name;
        output.appendChild(icon);

        icon.addEventListener('click', () => {
            icon.remove();
            createMusicPlayer(file.name, musicURL);
        });
    };
    reader.readAsDataURL(file);
});

function createMusicPlayer(name, url) {
    const playerBox = document.createElement('div');
    playerBox.style.position = 'absolute';
    playerBox.style.left = '150px';
    playerBox.style.top = '150px';
    playerBox.style.width = '300px';
    playerBox.style.height = '150px';
    playerBox.style.background = 'rgb(194, 194, 194)';
    playerBox.style.border = '2px solid black';
    playerBox.style.textAlign = 'center';
    playerBox.style.cursor = 'move';
    playerBox.innerHTML = `
						<div style="background: blue; color: white; padding: 3px;">
							${name} 
							<button style="float: right; background: red; color: white; border: none; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">X</button>
						</div>
						<audio controls style="width: 90%; margin-top: 20px;">
							<source src="${url}" type="audio/mpeg">
							Your browser does not support audio playback.
						</audio>
					`;

    document.body.appendChild(playerBox);

    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    playerBox.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - playerBox.offsetLeft;
        dragOffsetY = e.clientY - playerBox.offsetTop;
        playerBox.style.opacity = '0.8';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            playerBox.style.left = e.clientX - dragOffsetX + 'px';
            playerBox.style.top = e.clientY - dragOffsetY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        playerBox.style.opacity = '1';
    });
}

const imageButton = document.createElement('button');
imageButton.textContent = 'Upload Image File';
document.getElementById('container').appendChild(imageButton);

const imageInput = document.createElement('input');
imageInput.type = 'file';
imageInput.accept = '.png, .jpg, .jpeg, .gif, .webp';
imageInput.style.display = 'none';
document.body.appendChild(imageInput);

imageButton.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageURL = e.target.result;
        const output = document.getElementById('output-txt');
        const icon = document.createElement('img');
        icon.src = 'img-icon.png';
        icon.style.width = '60px';
        icon.style.cursor = 'pointer';
        icon.title = file.name;
        output.appendChild(icon);

        icon.addEventListener('click', () => {
            icon.remove();
            createImageViewer(file.name, imageURL);
        });
    };
    reader.readAsDataURL(file);
});

function createImageViewer(name, url) {
    const imgBox = document.createElement('div');
    imgBox.style.position = 'absolute';
    imgBox.style.left = '200px';
    imgBox.style.top = '200px';
    imgBox.style.width = '400px';
    imgBox.style.height = '300px';
    imgBox.style.background = 'rgb(194, 194, 194)';
    imgBox.style.border = '2px solid black';
    imgBox.style.textAlign = 'center';
    imgBox.style.cursor = 'move';
    imgBox.innerHTML = `
							<div style="background: blue; color: white; padding: 3px;">
								${name}
								<button style="float: right; background: red; color: white; border: none; cursor: pointer;" onclick="this.parentElement.parentElement.remove()">X</button>
							</div>
							<img src="${url}" alt="${name}" style="max-width: 90%; max-height: 80%; margin-top: 10px; border: 1px solid black;">
						`;
    document.body.appendChild(imgBox);

    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    imgBox.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - imgBox.offsetLeft;
        dragOffsetY = e.clientY - imgBox.offsetTop;
        imgBox.style.opacity = '0.8';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            imgBox.style.left = e.clientX - dragOffsetX + 'px';
            imgBox.style.top = e.clientY - dragOffsetY + 'px';
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        imgBox.style.opacity = '1';
    });
}

const instructions = document.getElementById('instructions');
let instructionsOffsetX, instructionsOffsetY, instructionsIsDown = false;

instructions.addEventListener('mousedown', (e) => {
    instructionsIsDown = true;
    instructionsOffsetX = e.clientX - instructions.offsetLeft;
    instructionsOffsetY = e.clientY - instructions.offsetTop;
});

document.addEventListener('mouseup', () => { instructionsIsDown = false; });
document.addEventListener('mousemove', (e) => {
    if (!instructionsIsDown) return;
    instructions.style.left = (e.clientX - instructionsOffsetX) + 'px';
    instructions.style.top = (e.clientY - instructionsOffsetY) + 'px';
});

const volumemixer = document.getElementById('volumemixer');
let volumemixerOffsetX, volumemixerOffsetY, volumemixerIsDown = false;

volumemixer.addEventListener('mousedown', (e) => {
    volumemixerIsDown = true;
    volumemixerOffsetX = e.clientX - volumemixer.offsetLeft;
    volumemixerOffsetY = e.clientY - volumemixer.offsetTop;
});

document.addEventListener('mouseup', () => { volumemixerIsDown = false; });
document.addEventListener('mousemove', (e) => {
    if (!volumemixerIsDown) return;
    volumemixer.style.left = (e.clientX - volumemixerOffsetX) + 'px';
    volumemixer.style.top = (e.clientY - volumemixerOffsetY) + 'px';
});

const reminder1 = document.getElementById('reminder-1');
let reminder1OffsetX, reminder1OffsetY, reminder1IsDown = false;

reminder1.addEventListener('mousedown', (e) => {
    reminder1IsDown = true;
    reminder1OffsetX = e.clientX - reminder1.offsetLeft;
    reminder1OffsetY = e.clientY - reminder1.offsetTop;
});

document.addEventListener('mouseup', () => { reminder1IsDown = false; });
document.addEventListener('mousemove', (e) => {
    if (!reminder1IsDown) return;
    reminder1.style.left = (e.clientX - reminder1OffsetX) + 'px';
    reminder1.style.top = (e.clientY - reminder1OffsetY) + 'px';
});	
