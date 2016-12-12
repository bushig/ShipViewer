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

function loadModels() {
    
}




init();
render();