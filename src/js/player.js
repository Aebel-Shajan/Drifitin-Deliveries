import * as THREE from "three";
import * as CANNON from "cannon-es";

export let player = {
    mesh: new THREE.Mesh(),
    body: new CANNON.Body(),
    physicsMaterial: new CANNON.Material(),
    redirectAmount: 0.1,
    velocity: new THREE.Vector3(0, 0, 0),
    power: 1,
    drag: 0.01,
    thetaSpeed: 0,
    thetaPower: 10,
    thetaDrag: 0.1,
    theta: 0,
    forward: new THREE.Vector3(1, 0, 0),

    init: function () {
        this.mesh = new THREE.Mesh(
            new THREE.BoxGeometry,
            new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        this.body = new CANNON.Body({
            shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
            mass: 1,
            position: new CANNON.Vec3(0, 1, 2),
            material: new CANNON.Material({
                friction: 0
            })
        });
        this.mesh.position.copy(new THREE.Vector3(0, 1, 0));
        this.body.angularDamping = 0.9;
        this.body.linearDamping = 0.1;
    },
    update: function () {
        this.mesh.position.copy(this.body.position);
        this.mesh.quaternion.copy(this.body.quaternion);
    },
    getRelativeVector: function (x, y, z) {
        const vec = new THREE.Vector3(x, y, z);
        vec.applyQuaternion(this.body.quaternion);
        return vec
    },
    getForward: function () {
        const forward = this.getRelativeVector(0, 0, 1);
        return forward;
    },
    controlPlayer: function (c, dt) {
        this.update();
        const torque =
            this.getRelativeVector(0, 1, 0)
                .multiplyScalar(2 * (c.KeyA - c.KeyD));;
        this.body.angularVelocity.lerp(torque, 0.4, this.body.angularVelocity);


        // player motion
        const newVel = new THREE.Vector3();
        newVel.copy(this.body.velocity);
        newVel.add(player.forward.clone().multiplyScalar(player.power * (c.KeyW - c.KeyS)))
        .multiplyScalar(1 - player.redirectAmount)
        .add(
            player.forward.clone()
            .multiplyScalar(player.redirectAmount * player.body.velocity.length())
        )
        .multiplyScalar(1 - player.drag);
        this.forward = this.getForward();
        this.body.velocity.copy(newVel);
        


        // player looking
        // player.forward.setFromSphericalCoords(1, Math.PI / 2, player.theta);
        // player.forward.normalize();
        // player.mesh.lookAt(player.mesh.position.clone().add(player.forward.clone()))
    }
}
