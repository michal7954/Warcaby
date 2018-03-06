/*
    klasa Game
*/

function Game() {

    var camera;
    var scene;
    var raycaster = new THREE.Raycaster();
    var mouseVector = new THREE.Vector2()

    var szach = [
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
    ]

    var pionki = [
        [0, 2, 0, 2, 0, 2, 0, 2],
        [2, 0, 2, 0, 2, 0, 2, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
    ]

    var init = function () {

        var renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(0x808080);
        renderer.setSize(window.innerWidth, window.innerHeight);
        $("#root").append(renderer.domElement);

        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            10000
        );

        //---------- SZACHOWNICA

        var box = new THREE.BoxGeometry(100, 25, 100);

        var material0 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('gfx/black.jpg'),
            transparent: true,
            opacity: 1,
        })

        var material1 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('/gfx/white.jpg'),
            transparent: true,
            opacity: 1,
        })

        for (i = 0; i < szach.length; i++) {
            for (j = 0; j < szach[i].length; j++) {
                if (szach[i][j] == 0) {
                    var cube = new THREE.Mesh(box, material0);
                    cube.userData = { color: "black", x: i, y: j }
                }
                else if (szach[i][j] == 1) {
                    var cube = new THREE.Mesh(box, material1);
                    cube.userData = { color: "white", x: i, y: j }
                }
                scene.add(cube);
                cube.position.set(i * 100 - 350, 12.5, j * 100 - 350)
            }
        }

        //----------AXEX

        var axes = new THREE.AxesHelper(10000)
        //scene.add(axes)

        function render() {
            requestAnimationFrame(render);
            renderer.render(scene, camera);
        }
        render();
    };
    init();

    this.setPoz = function (val) {
        poz = val;
        switch (poz) {
            case "front":
                camera.position.set(780, 400, 0)
                camera.lookAt(scene.position)
                break;
            case "back":
                camera.position.set(-780, 400, 0)
                camera.lookAt(scene.position)
                break;
            case "top":
                camera.position.set(0, 1000, 0)
                camera.lookAt(scene.position)
                break;
            case "side":
                camera.position.set(0, 300, 1000)
                camera.lookAt(scene.position)
                break;
        }
    }

    var picked_material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0xffff00,
        transparent: true,
        opacity: 1,
    })
    var old_material;
    var old_picked;
    var picked;
    var orginal_material;

    this.pick = function (event) {
        mouseVector.x = (event.clientX / $(window).width()) * 2 - 1;
        mouseVector.y = -(event.clientY / $(window).height()) * 2 + 1;
        raycaster.setFromCamera(mouseVector, camera);
        var intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {

            //console.log(net.get_stan())
            //console.log(net.test)

            var element = intersects[0].object;
            //picked.userData = { a: 1, b: 2, c: 3 };
            //console.log(picked.geometry.type);
            //console.log(picked)
            //console.log(element.userData)

            //console.log(pionki[element.userData.x][element.userData.y])

            if (element.geometry.type == "CylinderGeometry") {
                //console.log(element)
                if (element == picked) {
                    console.log("ten sam")
                    element.material = origin_material;
                    picked = "";
                }

                else if (element.userData.player == net.get_stan()) {
                    picked = element;

                    if (old_picked) {
                        old_picked.material = origin_material;
                    }

                    origin_material = picked.material;
                    old_picked = picked;

                    picked.material = picked_material;
                }
            }

            if (picked) {

                //--------- WARUNKI NA PRZESUNIĘCIE
                var geometry = 0, pole = 0, czyste = 0, somsiad = 0;

                //console.log(picked.userData.player)
                //console.log(net.get_stan())

                if (element.geometry.type == "BoxGeometry") geometry = 1;
                if (element.userData.color == "black") pole = 1;
                if (pionki[element.userData.x][element.userData.y] == 0) czyste = 1;

                //console.log(element.userData.x, picked.userData.x)

                if (net.get_stan() == "player1") {
                    if (element.userData.x - picked.userData.x == -1 && Math.abs(picked.userData.y - element.userData.y) < 2) somsiad = 1;
                }
                else {
                    if (element.userData.x - picked.userData.x == 1 && Math.abs(picked.userData.y - element.userData.y) < 2) somsiad = 1;
                }



                if (geometry && pole && czyste && somsiad) {
                    //console.log(element.userData)
                    //console.log(picked)



                    pionki[picked.userData.x][picked.userData.y] = 0

                    if (net.get_stan() == "player1") {
                        pionki[element.userData.x][element.userData.y] = 1
                    }
                    else if (net.get_stan() == "player2") {
                        pionki[element.userData.x][element.userData.y] = 2
                    }

                    picked.userData.x = element.userData.x;
                    picked.userData.y = element.userData.y;


                    picked.position.x = element.position.x;
                    picked.position.z = element.position.z;
                    picked.position.y = 35;

                    picked.material = origin_material;
                    picked = "";
                }
            }
        }
    }

    this.dajPionki = function () {
        var cylinder = new THREE.CylinderGeometry(40, 40, 25, 32);

        var material2 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('/gfx/red.jpg'),
            transparent: true,
            opacity: 1,
        })

        var material3 = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: new THREE.TextureLoader().load('/gfx/green.jpg'),
            transparent: true,
            opacity: 1,
        })

        for (i = 0; i < szach.length; i++) {
            for (j = 0; j < szach[i].length; j++) {
                if (pionki[i][j] == 0) {
                }
                else if (pionki[i][j] == 1) {
                    var pion = new THREE.Mesh(cylinder, material2);
                    pion.userData = { player: "player1", x: i, y: j }
                    scene.add(pion);
                    pion.position.set(i * 100 - 350, 35, j * 100 - 350)
                }
                else if (pionki[i][j] == 2) {
                    var pion = new THREE.Mesh(cylinder, material3);
                    pion.userData = { player: "player2", x: i, y: j }
                    scene.add(pion);
                    pion.position.set(i * 100 - 350, 35, j * 100 - 350)
                }
            }
        }
    }
}