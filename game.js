
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

// =====================================
// 1. SCENE
// =====================================

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x91b8c5);
scene.fog = new THREE.FogExp2(0x91b8c5, 0.008);

const camera = new THREE.PerspectiveCamera(
    65, window.innerWidth / window.innerHeight, 0.1, 600
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
document.body.appendChild(renderer.domElement);

// =====================================
// 2. LIGHTING
// =====================================

const ambient = new THREE.HemisphereLight(
    0xd5eaff, 0x263b20, 2
);
scene.add(ambient);

const sun = new THREE.DirectionalLight(0xffe6bd, 3);
sun.position.set(70, 100, 40);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -100;
sun.shadow.camera.right = 100;
sun.shadow.camera.top = 100;
sun.shadow.camera.bottom = -100;
scene.add(sun);

// =====================================
// 3. MATERIALS
// =====================================

const grassMat = new THREE.MeshStandardMaterial({
    color: 0x456d35,
    roughness: 1
});

const trunkMat = new THREE.MeshStandardMaterial({
    color: 0x49301d,
    roughness: 1
});

const leafMat = new THREE.MeshStandardMaterial({
    color: 0x174c27,
    roughness: 1
});

const rockMat = new THREE.MeshStandardMaterial({
    color: 0x666d6b,
    roughness: 1
});

// =====================================
// 4. GROUND
// =====================================

const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 400, 100, 100),
    grassMat
);

ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// =====================================
// 5. MOUNTAINS
// =====================================

for (let i = 0; i < 16; i++) {
    const mountain = new THREE.Mesh(
        new THREE.ConeGeometry(
            18 + Math.random() * 20,
            35 + Math.random() * 35,
            6
        ),
        new THREE.MeshStandardMaterial({
            color: new THREE.Color().setHSL(
                0.28, 0.25, 0.18 + Math.random() * 0.1
            ),
            roughness: 1
        })
    );

    const angle = i / 16 * Math.PI * 2;
    mountain.position.set(
        Math.cos(angle) * 145,
        15,
        Math.sin(angle) * 145
    );

    mountain.rotation.y = Math.random() * 2;
    mountain.castShadow = true;
    scene.add(mountain);
}

// =====================================
// 6. TREES
// =====================================

function createTree(x, z, scale = 1) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(
            0.35 * scale,
            0.65 * scale,
            5 * scale,
            8
        ),
        trunkMat
    );

    trunk.position.y = 2.5 * scale;
    trunk.castShadow = true;
    tree.add(trunk);

    for (let i = 0; i < 3; i++) {
        const leaves = new THREE.Mesh(
            new THREE.ConeGeometry(
                (3.2 - i * 0.5) * scale,
                5 * scale,
                8
            ),
            leafMat
        );

        leaves.position.y = (5 + i * 2.2) * scale;
        leaves.castShadow = true;
        tree.add(leaves);
    }

    tree.position.set(x, 0, z);
    scene.add(tree);
}

for (let i = 0; i < 280; i++) {
    let x = (Math.random() - 0.5) * 260;
    let z = (Math.random() - 0.5) * 260;

    // Boshlanish hududini ochiq qoldiramiz
    if (Math.abs(x) < 10 && Math.abs(z) < 10) continue;

    createTree(x, z, 0.7 + Math.random() * 0.7);
}

// =====================================
// 7. ROCKS
// =====================================

for (let i = 0; i < 70; i++) {
    const rock = new THREE.Mesh(
        new THREE.DodecahedronGeometry(
            1 + Math.random() * 2, 0
        ),
        rockMat
    );

    rock.position.set(
        (Math.random() - 0.5) * 230,
        0.8,
        (Math.random() - 0.5) * 230
    );

    rock.rotation.set(
        Math.random(),
        Math.random(),
        Math.random()
    );

    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);
}

// =====================================
// 8. PLAYER
// =====================================

const player = new THREE.Group();

const skinMat = new THREE.MeshStandardMaterial({
    color: 0xd5a17b
});

const shirtMat = new THREE.MeshStandardMaterial({
    color: 0x245b91
});

const pantsMat = new THREE.MeshStandardMaterial({
    color: 0x292d38
});

function makePart(geometry, material, x, y, z) {
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    player.add(mesh);
    return mesh;
}

// Body
makePart(
    new THREE.CylinderGeometry(0.55, 0.65, 1.3, 12),
    shirtMat, 0, 1.7, 0
);

// Head
makePart(
    new THREE.SphereGeometry(0.42, 16, 16),
    skinMat, 0, 2.75, 0
);

// Backpack
makePart(
    new THREE.BoxGeometry(0.65, 0.9, 0.35),
    new THREE.MeshStandardMaterial({color: 0x493c27}),
    0, 1.8, 0.58
);

// Legs
const leftLeg = makePart(
    new THREE.BoxGeometry(0.38, 1, 0.4),
    pantsMat, -0.3, 0.55, 0
);

const rightLeg = makePart(
    new THREE.BoxGeometry(0.38, 1, 0.4),
    pantsMat, 0.3, 0.55, 0
);

// Arms
const leftArm = makePart(
    new THREE.BoxGeometry(0.3, 1.1, 0.35),
    shirtMat, -0.72, 1.7, 0
);

const rightArm = makePart(
    new THREE.BoxGeometry(0.3, 1.1, 0.35),
    shirtMat, 0.72, 1.7, 0
);

scene.add(player);

player.position.set(0, 0, 0);

// =====================================
// 9. CRYSTALS
// =====================================

const crystals = [];
let crystalCount = 0;
let keyCount = 0;
let health = 100;

function createCrystal(x, z) {
    const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8),
        new THREE.MeshStandardMaterial({
            color: 0x00eaff,
            emissive: 0x007dff,
            emissiveIntensity: 1.5,
            metalness: 0.5,
            roughness: 0.2
        })
    );

    crystal.position.set(x, 1.3, z);
    crystal.castShadow = true;

    scene.add(crystal);
    crystals.push(crystal);
}

for (let i = 0; i < 25; i++) {
    createCrystal(
        (Math.random() - 0.5) * 170,
        (Math.random() - 0.5) * 170
    );
}

// =====================================
// 10. KEY
// =====================================

const key = new THREE.Group();

const keyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffd34d,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x805000,
    emissiveIntensity: 0.5
});

const keyRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.45, 0.12, 8, 20),
    keyMaterial
);

key.add(keyRing);

const keyStick = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 1, 0.15),
    keyMaterial
);

keyStick.position.y = -0.5;
key.add(keyStick);

key.position.set(15, 1.5, -15);
scene.add(key);

// =====================================
// 11. PORTAL
// =====================================

const portal = new THREE.Group();

const portalRing = new THREE.Mesh(
    new THREE.TorusGeometry(3, 0.35, 16, 64),
    new THREE.MeshStandardMaterial({
        color: 0x9c35ff,
        emissive: 0x7200ff,
        emissiveIntensity: 2
    })
);

portalRing.position.y = 3.5;
portal.add(portalRing);

const portalCore = new THREE.Mesh(
    new THREE.CircleGeometry(2.7, 48),
    new THREE.MeshBasicMaterial({
        color: 0x351080,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
    })
);

portalCore.position.y = 3.5;
portal.add(portalCore);

portal.position.set(45, 0, -45);
scene.add(portal);

// =====================================
// 12. ENEMIES - HAZARDS
// =====================================

const enemies = [];

function createEnemy(x, z) {
    const enemy = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.SphereGeometry(1.1, 16, 16),
        new THREE.MeshStandardMaterial({
            color: 0x77352b,
            roughness: 0.9
        })
    );

    body.position.y = 1.1;
    body.castShadow = true;
    enemy.add(body);

    const eyeMaterial = new THREE.MeshBasicMaterial({
        color: 0xff3333
    });

    for (const side of [-1, 1]) {
        const eye = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 8, 8),
            eyeMaterial
        );

        eye.position.set(side * 0.4, 1.45, -0.85);
        enemy.add(eye);
    }

    enemy.position.set(x, 0, z);
    scene.add(enemy);

    enemies.push(enemy);
}

for (let i = 0; i < 5; i++) {
    createEnemy(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
    );
}

// =====================================
// 13. INPUT
// =====================================

const keys = {};

window.addEventListener("keydown", e => {
    keys[e.code] = true;

    if (e.code === "Space") e.preventDefault();
});

window.addEventListener("keyup", e => {
    keys[e.code] = false;
});

let mobileRun = false;
let jumping = false;

function bindButton(id, code) {
    const button = document.getElementById(id);

    button.addEventListener("pointerdown", e => {
        e.preventDefault();
        keys[code] = true;
    });

    ["pointerup", "pointerleave", "pointercancel"].forEach(event => {
        button.addEventListener(event, () => {
            keys[code] = false;
        });
    });
}

bindButton("up", "KeyW");
bindButton("down", "KeyS");
bindButton("left", "KeyA");
bindButton("right", "KeyD");

document.getElementById("jump").addEventListener(
    "pointerdown", e => {
        e.preventDefault();
        jumping = true;
    }
);

document.getElementById("run").addEventListener(
    "pointerdown", e => {
        e.preventDefault();
        mobileRun = true;
    }
);

["pointerup", "pointercancel", "pointerleave"].forEach(event => {
    document.getElementById("jump").addEventListener(
        event, () => jumping = false
    );

    document.getElementById("run").addEventListener(
        event, () => mobileRun = false
    );
});

// =====================================
// 14. CAMERA
// =====================================

const cameraOffset = new THREE.Vector3(0, 6, 11);
let cameraAngle = 0;

let dragging = false;
let previousX = 0;

renderer.domElement.addEventListener("pointerdown", e => {
    if (e.pointerType === "touch") return;
    dragging = true;
    previousX = e.clientX;
});

window.addEventListener("pointerup", () => dragging = false);

window.addEventListener("pointermove", e => {
    if (!dragging || !gameStarted) return;

    const delta = e.clientX - previousX;
    cameraAngle -= delta * 0.005;
    previousX = e.clientX;
});

// =====================================
// 15. GAME VARIABLES
// =====================================

let velocityY = 0;
let onGround = true;
let gameStarted = false;
let gameEnded = false;
let damageCooldown = 0;

const clock = new THREE.Clock();

const healthText = document.getElementById("health");
const crystalText = document.getElementById("crystals");
const keyText = document.getElementById("keys");
const missionText = document.getElementById("missionText");
const message = document.getElementById("message");

// =====================================
// 16. MESSAGE
// =====================================

let messageTimer = 0;

function showMessage(text) {
    message.textContent = text;
    messageTimer = 2.5;
}

// =====================================
// 17. GAME OVER
// =====================================

function endGame(win) {
    gameEnded = true;

    document.getElementById("endTitle").textContent =
        win ? "🏆 G‘ALABA!" : "💀 O‘YIN TUGADI";

    document.getElementById("endDescription").textContent =
        win
        ? "Sen o‘rmondan muvaffaqiyatli chiqding!"
        : "Jonlaring tugadi. Yana urinib ko‘r!";

    document.getElementById("end-screen").style.display = "flex";
}

// =====================================
// 18. PLAYER MOVEMENT
// =====================================

function updatePlayer(delta) {
    const forward =
        keys["KeyW"] || keys["ArrowUp"];

    const backward =
        keys["KeyS"] || keys["ArrowDown"];

    const left =
        keys["KeyA"] || keys["ArrowLeft"];

    const right =
        keys["KeyD"] || keys["ArrowRight"];

    let x = 0;
    let z = 0;

    if (forward) z -= 1;
    if (backward) z += 1;
    if (left) x -= 1;
    if (right) x += 1;

    const moving = x !== 0 || z !== 0;

    const speed =
        (keys["ShiftLeft"] || keys["ShiftRight"] || mobileRun)
        ? 12 : 6;

    if (moving) {
        const length = Math.sqrt(x * x + z * z);

        x /= length;
        z /= length;

        const direction = cameraAngle;

        const moveX =
            x * Math.cos(direction) -
            z * Math.sin(direction);

        const moveZ =
            x * Math.sin(direction) +
            z * Math.cos(direction);

        player.position.x += moveX * speed * delta;
        player.position.z += moveZ * speed * delta;

        player.rotation.y = Math.atan2(moveX, moveZ);

        const t = clock.elapsedTime * 10;

        leftLeg.rotation.x = Math.sin(t) * 0.6;
        rightLeg.rotation.x = -Math.sin(t) * 0.6;
        leftArm.rotation.x = -Math.sin(t) * 0.45;
        rightArm.rotation.x = Math.sin(t) * 0.45;

    } else {
        leftLeg.rotation.x = 0;
        rightLeg.rotation.x = 0;
        leftArm.rotation.x = 0;
        rightArm.rotation.x = 0;
    }

    player.position.x = THREE.MathUtils.clamp(
        player.position.x, -185, 185
    );

    player.position.z = THREE.MathUtils.clamp(
        player.position.z, -185, 185
    );

    // Jump
    if ((jumping || keys["Space"]) && onGround) {
        velocityY = 10;
        onGround = false;
        jumping = false;
    }

    velocityY -= 24 * delta;
    player.position.y += velocityY * delta;

    if (player.position.y < 0) {
        player.position.y = 0;
        velocityY = 0;
        onGround = true;
    }
}

// =====================================
// 19. COLLECT ITEMS
// =====================================

function updateItems(delta) {
    const time = clock.elapsedTime;

    crystals.forEach((crystal, index) => {
        if (!crystal.visible) return;

        crystal.rotation.y += delta * 1.8;
        crystal.position.y = 1.3 + Math.sin(
            time * 2 + index
        ) * 0.25;

        if (player.position.distanceTo(crystal.position) < 2.2) {
            crystal.visible = false;
            crystalCount++;

            crystalText.textContent = crystalCount;
            showMessage("💎 Kristall topildi!");

            if (crystalCount >= 10 && keyCount >= 1) {
                missionText.textContent =
                    "Portalga borib, o‘rmondan chiq!";
            }
        }
    });

    // Key
    key.rotation.y += delta * 2;
    key.position.y = 1.5 + Math.sin(time * 2) * 0.25;

    if (key.visible &&
        player.position.distanceTo(key.position) < 2.2) {

        key.visible = false;
        keyCount++;

        keyText.textContent = keyCount;
        showMessage("🔑 Kalit topildi!");

        missionText.textContent =
            "10 ta kristall yig‘ va portalga bor!";
    }

    // Portal
    portalRing.rotation.z += delta * 0.5;

    if (player.position.distanceTo(portal.position) < 5) {
        if (crystalCount >= 10 && keyCount >= 1) {
            endGame(true);
        } else {
            showMessage("Portal yopiq! 10 kristall va 1 kalit kerak.");
        }
    }
}

// =====================================
// 20. ENEMY MOVEMENT
// =====================================

function updateEnemies(delta) {
    damageCooldown -= delta;

    enemies.forEach(enemy => {
        const distance = enemy.position.distanceTo(
            player.position
        );

        if (distance < 22 && distance > 1.8) {
            const direction = new THREE.Vector3()
                .subVectors(player.position, enemy.position)
                .normalize();

            enemy.position.addScaledVector(
                direction, 3 * delta
            );

            enemy.rotation.y = Math.atan2(
                direction.x, direction.z
            );
        }

        if (distance < 2.2 && damageCooldown <= 0) {
            health = Math.max(0, health - 10);
            healthText.textContent = health;

            damageCooldown = 1.2;
            showMessage("⚠️ Xavf! Ehtiyot bo‘l!");

            if (health <= 0) {
                endGame(false);
            }
        }
    });
}

// =====================================
// 21. CAMERA UPDATE
// =====================================

function updateCamera(delta) {
    const offset = cameraOffset.clone();

    offset.applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        cameraAngle
    );

    const target = player.position.clone();
    target.y += 2;

    const desiredPosition = target.clone().add(offset);

    camera.position.lerp(
        desiredPosition,
        1 - Math.exp(-5 * delta)
    );

    camera.lookAt(target);
}

// =====================================
// 22. START GAME
// =====================================

document.getElementById("startButton").onclick = () => {
    gameStarted = true;

    document.getElementById("start-screen").style.display = "none";
    document.getElementById("game-ui").style.display = "block";
};

document.getElementById("restartButton").onclick = () => {
    location.reload();
};

// =====================================
// 23. MAIN LOOP
// =====================================

function animate() {
    requestAnimationFrame(animate);

    const delta = Math.min(clock.getDelta(), 0.05);

    if (gameStarted && !gameEnded) {
        updatePlayer(delta);
        updateItems(delta);
        updateEnemies(delta);
        updateCamera(delta);

        if (messageTimer > 0) {
            messageTimer -= delta;

            if (messageTimer <= 0) {
                message.textContent = "";
            }
        }
    }

    renderer.render(scene, camera);
}

animate();

// =====================================
// 24. RESPONSIVE SCREEN
// =====================================

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});
