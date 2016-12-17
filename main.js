"use strict";
//init global variables
var CAMERA_RADIUS = 100;
var scene, controls, camera, renderer, raycaster, manager;
var INTERSECTED;
var currLevel, FOCUS;
var material, light;
var MODELS_AVAILABLE = false; //true if models inited
var mouse = new THREE.Vector2();
var DATA;
//initialization
function init() {
    scene = new THREE.Scene();
    manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {

        console.log( item, "Загружено ",loaded, "из ",total );

    };
    manager.onLoad = function()
    {
        console.log("fully loaded");
        MODELS_AVAILABLE = true;
    };
    //camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2,
    //    window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
    //renderer
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xbbbbbb);
    renderer.setSize(window.innerWidth, window.innerHeight);
    //add to HTML
    document.querySelector("#webgl-wrapper").appendChild(renderer.domElement);

    //controls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.position0.set(0, 0, CAMERA_RADIUS); // default camera position for reset
    controls.rotateSpeed = 0.4;
    controls.enablePan = false;
    controls.mouseButtons = {ORBIT: THREE.MOUSE.RIGHT, ZOOM: THREE.MOUSE.MIDDLE};
    //controls.enableDamping = true;
    //controls.dampingFactor = 0.25;
    //controls.addEventListener('change', render);

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

    raycaster = new THREE.Raycaster();

    //
    // loader.load('./3d/test.json', function(geometry) {
    //     cube = new THREE.Mesh(geometry, material);
    //     scene.add(cube);
    //     render();
    // });
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    document.addEventListener('click', selectPart);
    window.addEventListener('resize', onWindowResize, false);
}

function render() {
    renderer.render(scene, camera);
}
// responsible for user input
function animate() {
    requestAnimationFrame(animate);
    checkIntersections();
    render();
    //controls.update();
}
//UTILITIES
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}
function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = -( event.clientY / window.innerHeight ) * 2 + 1;
}
function loadModels() {
    //read json and load 3d models
    //TODO: Maybe make it async and remove double for loop
    let parts = SHIP_DATA.shipParts;
    let loader = new THREE.JSONLoader(manager);
    for (let level = 0; level < parts.length; level++) {
        let levelParts = parts[level];
        for (let i = 0; i < levelParts.length; i++) {
            let part = levelParts[i];

            loader.load('./3d/' + part.model, function (geometry, materials) {
                //TODO: Fix to use all materials, not just first
                var material = new THREE.MultiMaterial(materials);
                var model = new THREE.Mesh(geometry, material);
                model.matrixAutoUpdate = false;
                //user data
                model.userData.level = level;
                model.userData.color = model.currentHex;
                model.userData.name = part.name;
                model.userData.description = part.description;
                //target coors
                model.userData.tx = part.tx;
                model.userData.ty = part.ty;
                model.userData.tz = part.tz;

                scene.add(model);
                //console.log(level, i);
                SHIP_DATA.shipParts[level][i].id = model.id;
            });

        }

    }
}
//Sets ship info, levels, camera position etc
function resetData() {
    //TODO: rename to resetAll or smth and refactor to utilize control's reset
    resetLevel();
    resetFOCUS();
    controls.reset();
    setVisibilityLevel(SHIP_DATA.shipParts.length);
}
//resets info about level
function resetLevel() {
    var name = SHIP_DATA.shipName;
    var description = SHIP_DATA.shipDescription;
    document.getElementById('info-name').innerText = name;
    document.getElementById('info-description').innerText = description;
    document.getElementById('level').innerText = "Выберите уровень";

    currLevel = null;
}
//resets camera position from target and current focus, highlight and visibility
function resetFOCUS() {
    //camera
    // camera.position.set(0, 0, CAMERA_RADIUS);
    // camera.lookAt(scene.position);

    //highlight
    if(FOCUS){
        FOCUS.userData.color = 0x000000;
        highlightPart(FOCUS, 0x000000);
    }

    FOCUS = null;
}

function checkIntersections() {
    //TODO: Refactor
    //camera.updateMatrixWorld();
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        if (INTERSECTED !== intersects[0].object) {
            //if was intersected, set intersected color back to normal
            if (INTERSECTED) {
                highlightPartLevel(INTERSECTED, null);
                //INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);
            }
            INTERSECTED = intersects[0].object;

            // highlight single part only if there is currently selected level
            if (currLevel !== null) {
                if(INTERSECTED.userData.level === currLevel){
                    if(FOCUS === INTERSECTED){
                        highlightPart(INTERSECTED, 0x00ff00);
                    } else{
                        highlightPart(INTERSECTED, 0xff0000);
                    }
                }
            } else {
                highlightPartLevel(INTERSECTED, 0xff0000);
            }
        }
    } else {
        if (INTERSECTED) {
            //console.log(INTERSECTED);
            //INTERSECTED.material.emissive.setHex(INTERSECTED.userData.color);
            highlightPartLevel(INTERSECTED, null);
        }
        INTERSECTED = null;
    }
}
function setCameraTop() {
    //set to topdown view
    camera.position.set(0.00, CAMERA_RADIUS, 0.00);
    controls.update();
}

function setCameraSide() {
    //while camera not 90 degrees, move it etc
    camera.position.set(0.00, 0.0, CAMERA_RADIUS);
    controls.update();
}

//DESCRIPTIONS
function setPartDescription() {
    document.getElementById("info-name").innerText = INTERSECTED.userData.name;
    document.getElementById("info-description").innerText = INTERSECTED.userData.description;
}

function setLevelInfo(level) {
    document.getElementById('level').innerText = "Уровень: " + (level+1);
}

function setLevelDescription() {
    //if there is no FOCUS, get hovered detail level description
}


//MODEL HIGHLIGHTS
function highlightPartLevel(part, color) {
    //to select color
    let level = part.userData.level;
    let levelParts = SHIP_DATA.shipParts[level];
    for (var i = 0; i < levelParts.length; i++) {
        let part = levelParts[i];
        let object = scene.getObjectById(part.id);
        if (color === null){
            highlightPart(object, object.userData.color);
        } else{
            highlightPart(object, color);
        }
    }

}
function highlightPart(part, color) {
    //TODO:Refactor higlight to another function
    //part.currentHex = INTERSECTED.material.emissive.getHex();
    //if selected current level and part is on it


        let materials = part.material.materials;
        for (let i = 0; i < materials.length; i++) {
            let mat = materials[i];
            mat.emissive.setHex(color);
        }
        //part.material.emissive.setHex(color);
}

//MAIN CONTROLS
function searchPart() {
    //set currently selected parts to empty list
    //get current search text, loop through models and if they ok add them to selectHighlighted
}
function setTarget(object) {
    //get object info from data and set camera target to it.
    //target position
    var tx = object.userData.tx;
    var ty = object.userData.ty;
    var tz = object.userData.tz;
    // object position
    var x = object.position.x;
    var y = object.position.y;
    var z = object.position.z;

    if (tx && ty && tz){
        controls.target.set(tx, ty, tz);
    } else{
        controls.target.set(x, y, z);
    }
    controls.update()
}
function setVisibilityLevel(desiredLevel) {
    //set visibile only that is below and including desiredLevel variable
    if(MODELS_AVAILABLE){
        var parts = SHIP_DATA.shipParts;
        for(var i = 0; i < parts.length; i++){
            let level = parts[i];
            for (var j =0; j<level.length; j++){
                let id = parts[i][j].id;
                if( i<= desiredLevel){
                    scene.getObjectById(id).visible = true;
                } else{
                    scene.getObjectById(id).visible = false;
                }
            }
        }
    }
    else{console.log("Models are not yet available");}
}
function selectPart(part) {
    //set FOCUS to detail, set its description
    if (INTERSECTED) {
        if (currLevel !== null) {
            if(currLevel === INTERSECTED.userData.level){
                if(FOCUS){
                    //highlightPart(FOCUS, 0x000000);
                    FOCUS.userData.color = 0x000000;
                    highlightPart(FOCUS, FOCUS.userData.color);
                }
                FOCUS = INTERSECTED;
                FOCUS.userData.color = 0x004400;
                highlightPart(FOCUS, 0x00ff00);
                setPartDescription();
                setTarget(FOCUS);
            }
        } else {
            currLevel = INTERSECTED.userData.level;
            setVisibilityLevel(currLevel);
            setLevelInfo(currLevel);
            highlightPartLevel(INTERSECTED, 0x000000);
            highlightPart(INTERSECTED, 0xff0000);
        }
    }else {
        if(currLevel !== null){
            resetLevel();
            resetFOCUS();
            setVisibilityLevel(SHIP_DATA.shipParts.length);
        }
    }
}
//STARTING LOOP
init();
resetData();
animate();