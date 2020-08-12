import * as dat from 'dat.gui';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { Refractor } from 'three/examples/jsm/objects/Refractor.js';
import { WaterRefractionShader } from 'three/examples/jsm/shaders/WaterRefractionShader.js';

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

    
    var clock = new THREE.Clock();
    const renderer = new THREE.WebGLRenderer({canvas});
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 200);
    const light = new THREE.AmbientLight('#ffffff');
    var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    pointLight.position.set( 50, 50, 0 );
    scene.add( pointLight );
    scene.add(light);
    camera.position.set(0, 30, 100);
    camera.lookAt(0, 0, 0);


    const geometry = new THREE.TorusGeometry( 25, 4, 16, 100 );
    const texture = new THREE.TextureLoader().load('/img/test.png');
    const material = new THREE.MeshStandardMaterial({ color: '#f2559c' });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    /*make heart*/
    var x = 0, y = 0;
    var heartShape = new THREE.Shape();
    heartShape.moveTo(x, y);
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );
    var extrudeSettings = {
        steps: 6,
        depth: 30
       
    };
    const greenGeomentry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );
    const greenMaterial = new THREE.MeshStandardMaterial( {color: 0x89eb4e} );
    const green = new THREE.Mesh( greenGeomentry, greenMaterial );
    green.rotation.z = Math.PI;
    green.position.x = 5;
    green.position.z = -20;
    
   
    scene.add( green );
    /* end headt*/


   
    /*Эффект воды */
    var refractorGeometry = new THREE.PlaneBufferGeometry( 20, 20 );
    var refractor = new Refractor( refractorGeometry, {
        color: 0x999999,
        textureWidth: 1024,
        textureHeight: 1024,
        shader: WaterRefractionShader
    } );

    refractor.position.set( 0, 30, 90 );

    scene.add( refractor );

    var dudvMap = new THREE.TextureLoader().load( 'tree/examples/textures/waterdudv.jpg', function () {

        loop();

    } );
    dudvMap.wrapS = dudvMap.wrapT = THREE.RepeatWrapping;
    refractor.material.uniforms[ "tDudv" ].value = dudvMap;
    function loop(){
        
        mesh.rotation.x += ball.rotationX;
        mesh.rotation.y += ball.rotationY;
        mesh.rotation.z += ball.rotationZ;
        mesh.position.x += ball.positionX;
        mesh.position.y += ball.positionY;
        mesh.position.z += ball.positionZ;
        
        render();
        requestAnimationFrame(loop);
    }
    
    function render(){
        refractor.material.uniforms[ "time" ].value += clock.getDelta();
        renderer.render(scene, camera);
    }
    loop();

    
    
}