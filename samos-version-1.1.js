document.addEventListener("DOMContentLoaded", () => {
    const introsound = document.getElementById("introsound");
    const remindersound = document.getElementById('remindersound');
    const volumemixerfirst = document.getElementById('volumemixer');
    const volumemixersound = document.getElementById('volumemixersound');
    const reminderfirst = document.getElementById('reminder-1');
    const container = document.getElementById('container');


    if (reminderfirst) {
        reminderfirst.addEventListener("mouseenter", () => {
            remindersound.currentTime = 0;
            remindersound.play();
        });
    }

    if (volumemixerfirst) {
        volumemixerfirst.addEventListener("mouseenter", () => {
            volumemixersound.currentTime = 0;
            volumemixersound.play();
        });
    }

    const txtButton = document.createElement('button');
    txtButton.textContent = 'Upload .txt File';
    container.appendChild(txtButton);

    const txtInput = document.createElement('input');
    txtInput.type = 'file';
    txtInput.accept = '.txt';
    txtInput.style.display = 'none';
    document.body.appendChild(txtInput);

    txtButton.addEventListener('click', () => txtInput.click());

    txtInput.addEventListener('change', () => {
        const file = txtInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
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
                createDraggableBox(file.name, text);
            });
        };
        reader.readAsText(file);
    });

    const musicButton = document.createElement('button');
    musicButton.textContent = 'Upload .mp3 File';
    container.appendChild(musicButton);

    const musicInput = document.createElement('input');
    musicInput.type = 'file';
    musicInput.accept = '.mp3,.wav,.ogg';
    musicInput.style.display = 'none';
    document.body.appendChild(musicInput);

    musicButton.addEventListener('click', () => musicInput.click());

    musicInput.addEventListener('change', () => {
        const file = musicInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const url = e.target.result;
            const output = document.getElementById('output-txt');
            const icon = document.createElement('img');
            icon.src = 'mp3-icon.png';
            icon.style.width = '60px';
            icon.style.cursor = 'pointer';
            output.appendChild(icon);

            icon.addEventListener('click', () => {
                icon.remove();
                createMusicPlayer(file.name, url);
            });
        };
        reader.readAsDataURL(file);
    });

    const imageButton = document.createElement('button');
    imageButton.textContent = 'Upload .png File';
    container.appendChild(imageButton);

    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = '.png,.jpg,.jpeg,.gif,.webp';
    imageInput.style.display = 'none';
    document.body.appendChild(imageInput);

    imageButton.addEventListener('click', () => imageInput.click());

    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            const url = e.target.result;
            const output = document.getElementById('output-txt');
            const icon = document.createElement('img');
            icon.src = 'img-icon.png';
            icon.style.width = '60px';
            icon.style.cursor = 'pointer';
            output.appendChild(icon);

            icon.addEventListener('click', () => {
                icon.remove();
                createImageViewer(file.name, url);
            });
        };
        reader.readAsDataURL(file);
    });

    function createDraggableBox(name, text) {
        const box = document.createElement('div');
        box.style.position = 'absolute';
        box.style.left = '100px';
        box.style.top = '100px';
        box.style.width = '300px';
        box.style.height = '200px';
        box.style.background = 'rgb(194, 194, 194)';
        box.style.border = '2px solid black';
        box.style.overflow = 'auto';
        box.style.cursor = 'move';
        box.innerHTML = `
                    <div style="background: blue; color: white; padding: 3px;">
                        ${name}
                        <button style="float:right; background:red; color:white; border:none; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">X</button>
                    </div>
                    <pre style="text-align:left; padding:5px;">${text}</pre>
                `;
        document.body.appendChild(box);
        makeDraggable(box);
    }

    function createMusicPlayer(name, url) {
        const box = document.createElement('div');
        box.style.position = 'absolute';
        box.style.left = '150px';
        box.style.top = '150px';
        box.style.width = '300px';
        box.style.height = '150px';
        box.style.background = 'rgb(194, 194, 194)';
        box.style.border = '2px solid black';
        box.style.cursor = 'move';
        box.innerHTML = `
                    <div style="background: blue; color: white; padding: 3px;">
                        ${name}
                        <button style="float:right; background:red; color:white; border:none; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">X</button>
                    </div>
                    <audio controls style="width:90%; margin-top:10px;">
                        <source src="${url}" type="audio/mpeg">
                    </audio>
                `;
        document.body.appendChild(box);
        makeDraggable(box);
    }

    function createImageViewer(name, url) {
        const box = document.createElement('div');
        box.style.position = 'absolute';
        box.style.left = '200px';
        box.style.top = '200px';
        box.style.width = '400px';
        box.style.height = '300px';
        box.style.background = 'rgb(194, 194, 194)';
        box.style.border = '2px solid black';
        box.style.cursor = 'move';
        box.innerHTML = `
                    <div style="background: blue; color: white; padding: 3px;">
                        ${name}
                        <button style="float:right; background:red; color:white; border:none; cursor:pointer;" onclick="this.parentElement.parentElement.remove()">X</button>
                    </div>
                    <img src="${url}" alt="${name}" style="max-width:90%; max-height:80%; margin-top:10px; border:1px solid black;">
                `;
        document.body.appendChild(box);
        makeDraggable(box);
    }

    function makeDraggable(el) {
        let isDragging = false;
        let offsetX, offsetY;

        el.addEventListener('mousedown', (e) => {
            if (e.target.tagName === "BUTTON" || e.target.tagName === "A" || e.target.tagName === "AUDIO" || e.target.tagName === "IMG") return;
            isDragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
            el.style.opacity = '0.8';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                el.style.left = (e.clientX - offsetX) + 'px';
                el.style.top = (e.clientY - offsetY) + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            el.style.opacity = '1';
        });
    }
});

//notes
const notesBox = document.getElementById("notesBox");
const notesHeader = document.getElementById("notesHeader");
const closeNotes = document.getElementById("closeNotes");


function noteskeyup() {
    var count =
        document.getElementById("notestextarea").value.length;
    var output = "Characters:" + count;
    document.getElementById("notesstatus").
        innerHTML = output;
}

closeNotes.onclick = () => {
    notesBox.style.display = "none";
    notesHeader.style.display = "none";
    closeNotes.style.display = "none";
};

let offsetX, offsetY, dragging = false;

notesHeader.addEventListener("mousedown", (e) => {
    dragging = true;
    offsetX = e.clientX - notesBox.offsetLeft;
    offsetY = e.clientY - notesBox.offsetTop;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
});

function onMouseMove(e) {
    if (!dragging) return;
    notesBox.style.left = (e.clientX - offsetX) + "px";
    notesBox.style.top = (e.clientY - offsetY) + "px";
}

function onMouseUp() {
    dragging = false;
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
}

function notesopen() {
    notesBox.style.display = "block";
    notesHeader.style.display = "block";
    closeNotes.style.display = "block";
}

//spreadsheet
const spreadsheetBox = document.getElementById("spreadsheetBox");
const spreadsheetHeader = document.getElementById("spreadsheetHeader");
const closeSpreadsheet = document.getElementById("closeSpreadsheet");

closeSpreadsheet.onclick = () => {
    spreadsheetBox.style.display = "none";
    spreadsheetHeader.style.display = "none";
    closeSpreadsheet.style.display = "none";
};

let draggingSpreadsheet = false, spreadsheetOffsetX, spreadsheetOffsetY;

spreadsheetHeader.addEventListener("mousedown", e => {
    draggingSpreadsheet = true;
    spreadsheetOffsetX = e.clientX - spreadsheetBox.offsetLeft;
    spreadsheetOffsetY = e.clientY - spreadsheetBox.offsetTop;
});

document.addEventListener("mouseup", () => draggingSpreadsheet = false);

document.addEventListener("mousemove", e => {
    if (!draggingSpreadsheet) return;
    spreadsheetBox.style.left = (e.clientX - spreadsheetOffsetX) + "px";
    spreadsheetBox.style.top = (e.clientY - spreadsheetOffsetY) + "px";
});

function spreadsheetopen() {
    spreadsheetBox.style.display = "block";
    spreadsheetHeader.style.display = "block";
    closeSpreadsheet.style.display = "block";
}

//text size

const allElements = document.querySelectorAll('*');

function ten() {
    allElements.forEach(element => {
        element.style.fontSize = '10px';
    });
}

function fifteen() {
    allElements.forEach(element => {
        element.style.fontSize = '15px';
    });
}

function twenty() {
    allElements.forEach(element => {
        element.style.fontSize = '20px'
    });
}

function twentyfive() {
    allElements.forEach(element => {
        element.style.fontSize = '25px'
    });
}


//allElements.forEach(element => {
//element.style.color = 'blue';
//element.style.fontFamily = 'Arial, sans-serif';
//});

//theme

function redtheme() {
    document.getElementById('desktop').style.backgroundColor = 'red';
}

function bluetheme() {
    document.getElementById('desktop').style.backgroundColor = 'blue';
}

function greentheme() {
    document.getElementById('desktop').style.backgroundColor = 'green';
}

function purpletheme() {
    document.getElementById('desktop').style.backgroundColor = 'purple';
}

function resettheme() {
    document.getElementById('desktop').style.backgroundColor = 'white';
}


//global time

let myVar = setInterval(function () {
    myTimer();
}, 1000);

function myTimer() {
    let d = new Date();
    document.getElementById("clock").innerHTML = d.toLocaleTimeString();
}

//swanmelody

const swanmelodyBox = document.getElementById("swanmelodyBox");
const swanmelodyHeader = document.getElementById("swanmelodyHeader");
const closeSwanmelody = document.getElementById("closeSwanmelody");

closeSwanmelody.onclick = () => {
    swanmelodyBox.style.display = "none";
    swanmelodyHeader.style.display = "none";
    closeSwanmelody.style.display = "none";
};

let draggingSwanmelody = false, swanmelodyOffsetX, swanmelodyOffsetY;

swanmelodyHeader.addEventListener("mousedown", e => {
    draggingSwanmelody = true;
    swanmelodyOffsetX = e.clientX - swanmelodyBox.offsetLeft;
    swanmelodyOffsetY = e.clientY - swanmelodyBox.offsetTop;
});

document.addEventListener("mouseup", () => draggingSwanmelody = false);

document.addEventListener("mousemove", e => {
    if (!draggingSwanmelody) return;
    swanmelodyBox.style.left = (e.clientX - swanmelodyOffsetX) + "px";
    swanmelodyBox.style.top = (e.clientY - swanmelodyOffsetY) + "px";
});

function swanmelodyopen() {
    swanmelodyBox.style.display = "block";
    swanmelodyHeader.style.display = "block";
    closeSwanmelody.style.display = "block";
}

//sound system
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function C() {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(260, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, 500);
}

function CSHARP() {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(270, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, 500);
}

function D() {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(290, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, 500);
}

function DSHARP() {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(310, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, 500);
}


function E() {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(330, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, 500);
}

function F() {
    let oscillator = audioCtx.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(350, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => { oscillator.stop(); }, 500);
}
