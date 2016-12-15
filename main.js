"use strict";
//CONSTANTS
var FOCUS_COLOR = 'orange';
var SELECT_COLOR = 'yellow';
var CAMERA_POS = [5, 5, 0];
//init global variables
var scene, controls, camera, renderer, light;
var material;
var DATA;
//initialization
function init() {
    scene = new THREE.Scene();
    //camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
    //    window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xbbbbbb);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //add to HTML
    document.querySelector("#webgl-wrapper").appendChild(renderer.domElement);

    //controls
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 1.0;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];
    controls.addEventListener('change', render);

    // lights
    scene.add(new THREE.AmbientLight(0xcccccc, 0.5));
    light = new THREE.DirectionalLight(0xbbbbbb, 0.7);
    light.position.set(30, 10, 20);
    scene.add(light);

    light = new THREE.DirectionalLight(0xbbbbbb, 0.7);
    light.position.set(-30, -10, -20);
    scene.add(light);

    material = new THREE.MeshPhongMaterial({color: 0x9eafab, shading: THREE.FlatShading});

    loadModels();

    //
    // loader.load('./3d/test.json', function(geometry) {
    //     cube = new THREE.Mesh(geometry, material);
    //     scene.add(cube);
    //     render();
    // });

    camera.position.z = 500;

    window.addEventListener('resize', onWindowResize, false);
}

function render() {
    renderer.render(scene, camera);
}
// responsible for user input
function animate() {
    requestAnimationFrame(animate);
    controls.update();
}
//UTILITIES
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    controls.handleResize();

    render();
}
function loadModels() {
    //read json and load 3d models
    //TODO: Maybe make it async and remove double for loop
    var parts = SHIP_DATA.shipParts;
    var loader = new THREE.JSONLoader();
    for (var level = 0; level < parts.length; level++) {
        var levelParts = parts[level];
        for (var i = 0; i < levelParts.length; i++) {
            var part = levelParts[i];

            loader.load('./3d/' + part.model, function (geometry) {
                var model = new THREE.Mesh(geometry, material);
                scene.add(model);
                render();
            });

        }

    }

}
//Sets ship info, levels, camera position etc
function resetData() {
    var name = SHIP_DATA.shipName;
    var description = SHIP_DATA.shipDescription;

    document.getElementById('info-name').innerText = name;
    document.getElementById('info-description').innerText = description;
    document.getElementById('level').innerText = "Выберите уровень";

    camera.position.z = 100;
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
resetData();
animate();