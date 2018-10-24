//@ts-check

// import * as THREE from "./three"

function MazeCube(maze, foreground) {
    var group = new THREE.Geometry();
    var cube = new THREE.BoxGeometry(1, 1, 1);

    var ox = -maze.depth / 2 - 1;
    var oy = -maze.height / 2 - 1;
    var oz = -maze.width / 2 - 1;

    for (var i = 1; i < maze.depth + 1; i++) {
        for (var j = 1; j < maze.height + 1; j++) {
            for (var k = 1; k < maze.width + 1; k++) {
                var x = maze.map[i][j][k];
                if (x !== 0) continue;
                cube.translate(i + ox, j + oy, k + oz);
                group.merge(cube);
                cube.translate(-i - ox, -j - oy, -k - oz);
            }
        }
    }

    group.mergeVertices();
    var mat = new THREE.MeshPhongMaterial({ color: foreground });
    this.mesh = new THREE.Mesh(group, mat);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.rotate = function (angle) {
        this.mesh.rotation.x += angle;
        this.mesh.rotation.y += angle;
        this.mesh.rotation.z += angle;
    }
}
