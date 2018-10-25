//@ts-check

// import * as THREE from "./three"

var Colors = {
    red: 0xf25346,
    white: 0xd8d0d1,
    brown: 0x59332e,
    pink: 0xF5986E,
    brownDark: 0x23190f,
    blue: 0x68c3c0
};

window.addEventListener('load', init, false);

function init() {
    createScene();
    createLights();
    createSea();
    createCube();
    loop();
}

var scene, camera, HEIGHT, WIDTH, renderer, container;

function createScene() {
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;

    scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);

    var aspectRatio = WIDTH / HEIGHT;
    var fov = 60;
    var near = 1;
    var far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    camera.position.set(0, 100, 200);

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(WIDTH, HEIGHT);
    renderer.shadowMap.enabled = true;

    container = document.getElementById('world');
    var renderArea = renderer.domElement;
    handleMouseRotation(renderArea);
    container.appendChild(renderArea);

    window.addEventListener('resize', function () {
        HEIGHT = window.innerHeight;
        WIDTH = window.innerWidth;
        renderer.setSize(WIDTH, HEIGHT);
        camera.aspect = WIDTH / HEIGHT;
        camera.updateProjectionMatrix();
    }, false);
}

var hemisphereLight, shadowLight, ambientLight;

function createLights() {
    hemisphereLight = new THREE.HemisphereLight(0x000000, 0xaaaaaa, 0.9);
    shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

    shadowLight.position.set(130, 350, 100);
    shadowLight.castShadow = true;

    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 500;
    shadowLight.shadow.camera.bottom = -500;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 10000;

    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    ambientLight = new THREE.AmbientLight(0xdc8874, 0.5);

    scene.add(hemisphereLight);
    scene.add(shadowLight);
    scene.add(ambientLight);
}

var cube;

function createCube() {
    cube = new MazeCube(new Maze(21, 21, 21), Colors.red);
    cube.mesh.position.y = 120;
    cube.mesh.scale.set(4.8, 4.8, 4.8);
    scene.add(cube.mesh);
}

var sea;

function createSea() {
    sea = new Sea(1000, 200, Colors.blue);
    scene.add(sea.mesh);
}


function loop() {
    if (!isDragging) cube.rotate(0.003);
    sea.moveWaves();
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}


var isDragging = false;
var previousMousePosition = {
    x: 0,
    y: 0
};

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function handleMouseRotation(dom) {
    dom.addEventListener('mousedown', function (e) {
        isDragging = true;
    });
    dom.addEventListener('mouseup', function (e) {
        isDragging = false;
    });
    dom.addEventListener('mousemove', handleMouseMove);
}

function handleMouseMove(e) {
    var deltaMove = {
        x: e.offsetX - previousMousePosition.x,
        y: e.offsetY - previousMousePosition.y
    };

    previousMousePosition = {
        x: e.offsetX,
        y: e.offsetY
    };

    if (!isDragging) return;

    var euler = new THREE.Euler(toRadians(deltaMove.y * 0.5), toRadians(deltaMove.x * 0.5), 0, 'XYZ');
    var deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(euler);
    var originalQuaternion = cube.mesh.quaternion;
    originalQuaternion.multiplyQuaternions(deltaRotationQuaternion, originalQuaternion);
}
