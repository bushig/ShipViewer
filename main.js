//CONSTANTS
var FOCUS_COLOR = 'orange';
var SELECT_COLOR = 'yellow';
var CAMERA_POS = [5, 5, 0];
//init global variables
var scene, controls, camera, renderer, light;
var cube;
//initialization
function init() {
    scene = new THREE.Scene();
    //camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
    //    window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 5000 );
    //renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setClearColor(0xbbbbbb);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //add to HTML
    document.querySelector("#webgl-wrapper").appendChild(renderer.domElement);

    //controls
    controls = new THREE.TrackballControls( camera );
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.0;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [ 65, 83, 68 ];
    controls.addEventListener( 'change', render );

    // lights
    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 500, 400, 500 );
    scene.add( light );

    //var geometry = new THREE.BoxGeometry(100, 100, 100);
    var material = new THREE.MeshPhongMaterial( { color:0xffffff, shading: THREE.FlatShading } );
    //cube = new THREE.Mesh(geometry, material);
    //cube.matrixAutoUpdate = false;
    //scene.add(cube);

    //load

    var loader = new THREE.JSONLoader();
    loader.load('./3d/test.json', function(geometry) {
        cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        render();
    });

    camera.position.z = 500;

    window.addEventListener( 'resize', onWindowResize, false );
}

function render() {
    renderer.render(scene, camera);
}
// responsible for user input
function animate() {
    requestAnimationFrame( animate );
    controls.update();
}
//UTILITIES
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();

    render();
}
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
//render();
animate();