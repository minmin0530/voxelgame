

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
    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set(100, 100, 100);
    scene.add( light );

    camera.position.set(-100, 4, 6);
    camera.lookAt(-100, 4, 0);
    const floor = [];
    const wall = [];
    const player = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0xff0000 } ) );
    player.position.set(-100, 1, -10);
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
            jumpSpeed = 1;
            player.position.y += jumpSpeed;
            break;
        }
    }


    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    
        renderer.setSize(window.innerWidth, window.innerHeight);    
    }

    function animate() {
        requestAnimationFrame( animate );

        if ( player.position.y > 1 ) {
            jumpSpeed -= 0.05;
            player.position.y += jumpSpeed;
        }
        if ( player.position.y < 1 ) {
            player.position.y = 1;
        }

        if ( isLeftKey ) {
            camera.position.x -= 0.1;
            camera.lookAt.x -= 0.1;
            player.position.x -= 0.1;
            player.rotation.x += 0.04;
            player.rotation.y += 0.04;
        }

        if ( isRightKey ) {
            camera.position.x += 0.1;
            camera.lookAt.x += 0.1;
            player.position.x += 0.1;
            player.rotation.x += 0.04;
            player.rotation.y += 0.04;
        }

        renderer.render( scene, camera );
    };

    animate();
}