import * as dat from 'dat.gui';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
window.onload = function(){
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvas = document.getElementById('canvas');
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    const ball = {
        rotationX: 0,
        rotationY: 0, 
        rotationZ: 0,
        positionX: 0,
        positionY: 0,
        positionZ: 0
    }
    
    const gui = new dat.GUI();
    gui.add(ball, 'positionX').min(-5).max(5).step(0.1);
    gui.add(ball, 'positionY').min(-5).max(5).step(0.1);
    gui.add(ball, 'positionZ').min(-5).max(5).step(0.1);
    gui.add(ball, 'rotationX').min(-0.2).max(0.2).step(0.001);
    gui.add(ball, 'rotationY').min(-0.2).max(0.2).step(0.001);
    gui.add(ball, 'rotationZ').min(-0.2).max(0.2).step(0.001);

    const texture = new THREE.TextureLoader().load('/img/test.png');
    
    const renderer = new THREE.WebGLRenderer({canvas});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height);
    const light = new THREE.AmbientLight('#ffffff');
    scene.add(light);
    camera.position.set(0, 0, 100);
    const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    const material = new THREE.MeshBasicMaterial({ map: texture });
    // for(let i = 0; i < geometry.faces.length; i++){
    //     geometry.faces[i].color.setRGB(Math.random(), Math.random(), Math.random());
    // }
    const mesh = new THREE.Mesh(geometry, material);
    const composer = new EffectComposer( renderer );
    scene.add(mesh);
    renderer.render(scene, camera);
    var renderPass = new RenderPass( scene, camera );
composer.addPass( renderPass );

var glitchPass = new GlitchPass();
composer.addPass( glitchPass );
    function loop(){
        mesh.rotation.x += ball.rotationX;
        mesh.rotation.y += ball.rotationY;
        mesh.rotation.z += ball.rotationZ;
        mesh.position.x += ball.positionX;
        mesh.position.y += ball.positionY;
        mesh.position.z += ball.positionZ; 
        composer.render();
        requestAnimationFrame(loop);
    }

    loop();

    
}