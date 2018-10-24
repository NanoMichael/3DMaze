//@ts-check

// import * as THREE from "./three"

function Sea(radius, height, foreground) {
    var geom = new THREE.CylinderGeometry(radius, radius, height, 100, 10);
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

    geom.mergeVertices();

    var l = geom.vertices.length;

    this.waves = [];

    for (var i = 0; i < l; i++) {
        var v = geom.vertices[i];
        this.waves.push({
            x: v.x,
            y: v.y,
            z: v.z,
            ang: Math.random() * Math.PI * 2,
            amp: Math.random() * 15,
            speed: 0.016 + Math.random() * 0.032
        });
    }

    var mat = new THREE.MeshPhongMaterial({
        color: foreground,
        transparent: true,
        opacity: 0.8,
        shading: THREE.FlatShading
    });

    this.mesh = new THREE.Mesh(geom, mat);
    this.mesh.receiveShadow = true;
    this.mesh.position.y = -radius;

    this.moveWaves = function () {
        var verts = this.mesh.geometry.vertices;
        var l = verts.length;

        for (var i = 0; i < l; i++) {
            var v = verts[i];
            var vprops = this.waves[i];
            v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
            v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
            vprops.ang += vprops.speed;
        }

        this.mesh.geometry.verticesNeedUpdate = true;
        this.mesh.rotation.z += 0.00005;
    }
}
