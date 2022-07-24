window.onload = function() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const backgroundMaterials = [
        new THREE.MeshBasicMaterial( { color: 0xbbbbbb } ),
        new THREE.MeshBasicMaterial( { color: 0xaaaaaa } ),
        new THREE.MeshBasicMaterial( { color: 0x999999 } ),
        new THREE.MeshBasicMaterial( { color: 0x888888 } ),
        new THREE.MeshBasicMaterial( { color: 0x777777 } ),
        new THREE.MeshBasicMaterial( { color: 0x666666 } ),
        new THREE.MeshBasicMaterial( { color: 0x555555 } ),
        new THREE.MeshBasicMaterial( { color: 0x444444 } ),
    ];
    const hardleMaterials = [
        new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),
        new THREE.MeshBasicMaterial( { color: 0x00dd00 } ),
        new THREE.MeshBasicMaterial( { color: 0x00bb00 } ),
        new THREE.MeshBasicMaterial( { color: 0x009900 } ),
    ];
    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set(100, 100, 100);
    scene.add( light );

    camera.position.set(-100, 4, 6);
    camera.lookAt(-100, 4, 0);
    const floor = [];
    const wall = [];

    const enemy1 = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x0000ff } ) );
    const hardle  = [];
    for (let i = 0; i < 25; ++i) {
        hardle.push( new THREE.Mesh( geometry, hardleMaterials[ Math.floor(Math.random() * 4) ] ) );
    }
    const player   = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
    enemy1.position.set(-60, 1, -10);

    let xx = 0;
    let yy = 0;
    for (const h of hardle) {
        h.position.set(-80 - xx * 1.2, 1 + yy * 1.2, -10);
        xx += 1;
        if (xx >= 5) {
            yy += 1;
            xx = 0;
        }
        scene.add( h );
    }

    player.position.set(-100, 1, -10);
    scene.add( enemy1 );
    scene.add( player );

    for (let z = -10; z < 0; ++z) {
    for (let x = -100; x < 100; ++x) {
        const cube = new THREE.Mesh( geometry, backgroundMaterials[ Math.floor(Math.random() * 8) ] );
        cube.position.set(x * 1.2, 0, z * 1.2);
        scene.add( cube );
        floor.push( cube )
    }
    }

    for (let y = 0; y < 15; ++y) {
    for (let x = -100; x < 100; ++x) {
        const cube = new THREE.Mesh( geometry, backgroundMaterials[ Math.floor(Math.random() * 8) ] );
        cube.position.set(x * 1.2, y * 1.2, -10 * 1.2);
        scene.add( cube );
        wall.push( cube )
    }
    }
    

    let jumpSpeed = 0;



    let playerBottomHitPosition = 1;

    let isGroundHit = true;
    let isBottomHit = false;
    let isLeftHit = false;
    let isRightHit = false;
    let isLeftKey = false;
    let isRightKey = false;
    document.addEventListener('keydown', event => onDocumentKeyDown(event), false);
    document.addEventListener('keyup', event => onDocumentKeyUp(event), false);
    window.addEventListener('resize', event => onWindowResize(event), false);

    function onDocumentKeyUp(event) {
        switch (event.keyCode) {
    
        case 16: break;
        case 38: break;
        case 40: break;

        case 37: isLeftKey = false; break; //left
        case 39: isRightKey = false; break; //right
        }
    }
    function onDocumentKeyDown(event) {
      
        switch (event.keyCode) {
    
        case 16: break; 
        case 38:
            break;
        case 40:
            break;
        case 37: isLeftKey = true; break; //left
        case 39: isRightKey = true; break; //right

        case 90: //z
            if (isGroundHit) {
                jumpSpeed = 1;
                player.position.y += jumpSpeed;
                isGroundHit = false;
            }
            break;
        }
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize(window.innerWidth, window.innerHeight);    
    }

    function hitcheckRight() {
        for (const h of hardle) {
            if (h.position.x - 0.5 >= player.position.x && player.position.x + 0.5 >= h.position.x - 0.5 &&
                h.position.y + 0.5 >= player.position.y - 0.5 && player.position.y >= h.position.y - 0.5) {
                isRightHit = true;
                break;
            }
        }
    }

    function hitcheckLeft() {
        for (const h of hardle) {
            if (h.position.x + 0.5 >= player.position.x - 0.5 && player.position.x >= h.position.x + 0.5 &&
                h.position.y + 0.5 >= player.position.y - 0.5 && player.position.y >= h.position.y - 0.5) {
                isLeftHit = true;
                break
            }
        }
    }

    function hitcheckBottom() {
        for (const h of hardle) {
            if (h.position.x + 0.5 >= player.position.x - 0.5 && player.position.x + 0.5 >= h.position.x - 0.5 &&
                h.position.y + 0.5 >= player.position.y - 0.5 && player.position.y >= h.position.y - 0.5) {
                isBottomHit = true;

                playerBottomHitPosition = h.position.y + 1.01;
                player.position.y = playerBottomHitPosition;
                jumpSpeed = 0;
                isGroundHit = true;
                break;
            }
        }

    }
    function animate() {
        requestAnimationFrame( animate );

        isBottomHit = false;
        isLeftHit = false;
        isRightHit = false;
        if ( player.position.y > 1) {
            jumpSpeed -= 0.05;
            player.position.y += jumpSpeed;
        }
        if (jumpSpeed < 0) {
            hitcheckBottom();
        }

        if ( player.position.y < 1 ) {
            player.position.y = 1;
            jumpSpeed = 0;
            isGroundHit = true;
        }

        if ( isLeftKey ) {
            hitcheckLeft();
            if (isLeftHit == false) {
                camera.position.x -= 0.1;
                camera.lookAt.x -= 0.1;
                player.position.x -= 0.1;
            }
            player.rotation.x += 0.04;
            player.rotation.y += 0.04;
        }

        if ( isRightKey ) {
            hitcheckRight();
            if (isRightHit == false) {
                camera.position.x += 0.1;
                camera.lookAt.x += 0.1;
                player.position.x += 0.1;
            }
            player.rotation.x += 0.04;
            player.rotation.y += 0.04;
        }

        renderer.render( scene, camera );
    };

    animate();
}