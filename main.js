//CONSTANTS
var FOCUS_COLOR = 'orange';
var SELECT_COLOR = 'yellow';
var CAMERA_POS = [5, 5, 0];
//init global variables
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
    window.innerHeight / 2, window.innerHeight / -2, 1, 1000);

var renderer = new THREE.WebGLRenderer();

//add to html
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
var cube;
//initialization
function init() {
    var geometry = new THREE.BoxGeometry( 100, 100, 100 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    cube = new THREE.Mesh( geometry, material );
    scene.add(cube);

    camera.position.z = 100;
}

function render() {
    requestAnimationFrame( render );
    cube.rotation.x += 0.1;
    cube.rotation.y += 0.1;
    renderer.render( scene, camera );
}

//UTILITIES
function loadModels() {
    //read json and load 3d models
}
function setCameraTop() {
    //set to topdown view
}

function setCameraSide() {
    //while camera not 90 degrees, move it etc
}

function resetCamera() {
    //drop camera focus, set default ship description
}

//DESCRIPTIONS
function setShipDescription() {
    
}

function setPartDescription() {
    
}

function setLevelDescription() {
    //if there is no focus, get hovered detail level description
}


//MODEL HIGHLIGHTS
function setLevelColor(part) {
    //to select color
}
function setPartColor(part) {
    //to focus color
}

//MAIN CONTROLS
function searchPart() {
    //set currently selected parts to empty list
    //get current search text, loop through models and if they ok add them to selectHighlighted
}
function focusPart(part) {
    //set focus to detail, set its description
}
//STARTING LOOP
init();
render();