const notesBox = document.getElementById("notesBox");
const notesHeader = document.getElementById("notesHeader");
const closeNotes = document.getElementById("closeNotes");

closeNotes.onclick = () => notesBox.remove();

let offsetX, offsetY, dragging = false;
notesHeader.onmousedown = e => {
    dragging = true;
    offsetX = e.clientX - notesBox.offsetLeft;
    offsetY = e.clientY - notesBox.offsetTop;
};
document.onmouseup = () => dragging = false;
document.onmousemove = e => {
    if (!dragging) return;
    notesBox.style.left = (e.clientX - offsetX) + "px";
    notesBox.style.top = (e.clientY - offsetY) + "px";
};

function keyup() {
    var count =
        document.getElementById("texter").value.length;
    var output = "letter count: " + count;
    document.getElementById("status").
        innerHTML = output;
}
const rcbox = document.getElementById("rd-box");
function rcbox() {
    document.getElementById('rc-box').style.display = "block";
}
