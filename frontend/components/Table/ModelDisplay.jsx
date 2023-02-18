import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-addons'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { Button } from '@mui/material';

//Memoize the component to prevent rerendering when the parent component rerenders
const useThreeJsModelViewer = React.memo(({ model, photomode, addImage }) => {
	const modelUrl = '/public/models/' + model.objectFilename;
	const canvasRef = useRef();
	const containerRef = useRef();
	const backgroundRef = useRef();
	const renderButtonRef = useRef();
	const lightingButtonRef = useRef();
	const [loadingPercentage, setLoadingPercentage] = useState(0);
	const [rendering, setRendering] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true	});
	renderer.setPixelRatio(window.devicePixelRatio);
	const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
	camera.updateProjectionMatrix();
	renderer.setSize(container.clientWidth, container.clientHeight);
	const boundingBox = new THREE.Box3();
	const boundingSphere = new THREE.Sphere();
	const center = new THREE.Vector3();
	let lightingPreset = 1;


    // Set up Three.js scene
	const scene = new THREE.Scene();
	if (photomode) {
		scene.background = new THREE.Color(0x000000);
	}
	renderer.setClearColor(0x000000, 0);

    // Load model
	let mtlLoader = new MTLLoader();
	let objLoader = new OBJLoader();

	mtlLoader.load(modelUrl + '.mtl', (materials) => {
		materials.preload()
		objLoader.setMaterials(materials)
		objLoader.load(modelUrl + '.obj', (object) => {
			boundingBox.setFromObject(object);
			boundingBox.getCenter(center);

			const radius = boundingBox.getSize(new THREE.Vector3()).length() / 2;
			boundingSphere.set(center, radius);
			scene.add(object);

			// fit object inside camera frustum
			const cameraPosition = new THREE.Vector3(0, 0, radius).add(boundingSphere.center);
			camera.position.copy(cameraPosition);
		},
		(xhr) => {
			setLoadingPercentage(xhr.loaded / xhr.total * 100);
		})
	})

	// preset 1
	const ambientLight1 = new THREE.AmbientLight(0xffffff, 1);
	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	const pointLight = new THREE.PointLight(0xffffff, 1, boundingBox.max.z);
	pointLight.position.set(0, 0, 10);

	// preset 2
	const keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1);
	keyLight.position.set(-100, 0, 100);
	scene.add(keyLight);
	const fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
	fillLight.position.set(100, 0, 100);
	scene.add(fillLight);
	const backLight = new THREE.DirectionalLight(0xffffff, 1);
	backLight.position.set(100, 0, -100).normalize();
	scene.add(backLight);
	const ambientLight2 = new THREE.AmbientLight(0xffffff, 0.5);
	scene.add(ambientLight2);

	// preset 3
	const simpleLight = new THREE.DirectionalLight(0xffffff, 1);
	simpleLight.position.set(0, 0, 1);
	const simpleLight2 = new THREE.DirectionalLight(0xffffff, 1);
	simpleLight2.position.set(0, 0, -1);
	const simpleLight3 = new THREE.DirectionalLight(0xffffff, 1);
	simpleLight3.position.set(0, 1, 0);

	const setLighting = (preset) => {
		scene.remove(ambientLight1);
		scene.remove(directionalLight);
		scene.remove(pointLight);
		scene.remove(keyLight);
		scene.remove(fillLight);
		scene.remove(backLight);
		scene.remove(ambientLight2);
		scene.remove(simpleLight);
		scene.remove(simpleLight2);
		scene.remove(simpleLight3);
		if (preset === 0) {
			// set lighting preset 1
			scene.add(ambientLight1);
			scene.add(directionalLight);
			scene.add(pointLight);
		} else if (preset === 1) {
			// set lighting preset 2
			scene.add(keyLight);
			scene.add(fillLight);
			scene.add(backLight);
			scene.add(ambientLight2);
		} else if (preset === 2) {
			// set lighting preset 3
			scene.add(simpleLight);
			scene.add(simpleLight2);
			scene.add(simpleLight3);
			scene.add(ambientLight2);
		}
	}
	setLighting(lightingPreset);
	
	// listen for button click and render the scene
	renderButtonRef?.current?.addEventListener('click', () => {
		const imgData = renderer.domElement.toDataURL('image/png')
		setRendering(true);
		addImage(model._id, imgData)
		.then(() => setRendering(false))
	});

	lightingButtonRef?.current?.addEventListener('click', () => {
		lightingPreset = (lightingPreset + 1) % 3;
		setLighting(lightingPreset);
	});

	backgroundRef?.current?.addEventListener('click', () => {
		photomode = !photomode;
		if (photomode) {
			scene.background = new THREE.Color(0x000000);
		} else {
			scene.background = new THREE.Color(0xffffff);
		}
	});

	// zoom in and out using mouse wheel
	canvas.addEventListener('wheel', (event) => {
		event.preventDefault();
		if (event.target === canvas) {
			if (event.deltaY < 0) camera.position.lerp(boundingSphere.center, 0.1);
			else camera.position.lerp(boundingSphere.center, -0.1);
		}
	}, { passive: false });

	// on mouse hover start the animation again
	canvas.addEventListener('mouseenter', () => {
		renderer.setAnimationLoop(render);
	});

	// setup orbit controls
	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = true;
	controls.enablePan = true;
	if (!photomode){
		controls.autoRotate = true;
		controls.autoRotateSpeed = 0.5;
	}
	controls.target = boundingSphere.center;

	// Set up resize listener
	const onWindowResize = () => {
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(container.clientWidth, container.clientHeight);
	};
	window.addEventListener('resize', onWindowResize);

	// Render loop
	const render = () => {
		const canvasRect = canvasRef.current?.getBoundingClientRect();
		if (!canvasRect) return;
		const inViewport = canvasRect.top < window.innerHeight && canvasRect.bottom > 0;
		if (!inViewport) {
			renderer.setAnimationLoop(null);
			return;
		}
		controls.update();
		renderer.render(scene, camera);
	};
	renderer.setAnimationLoop(render);


	return () => {
		window.removeEventListener('resize', onWindowResize);
	};
    
  }, [modelUrl]);

  return (
	<>
		<div style={{ width: '100%', height: '100%', borderRadius: 10 }} ref={containerRef}>
			<canvas style={{ width: 200, height: 200 }} ref={canvasRef} />
			{loadingPercentage < 100 && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white', background: 'rgba(145, 145, 145, 0.8)', borderRadius: 10 }}>
				<div>{loadingPercentage.toFixed(0)}%</div>
			</div>}
		</div>
		{photomode && 
			<div style={{ position: 'absolute', bottom: 40, right: 100, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: 10 }}>
				<Button ref={backgroundRef} variant="contained" color="primary" style={{ margin: 10 }}>Toggle Background</Button>
				<Button ref={lightingButtonRef} variant="contained" color="primary" style={{ margin: 10 }}>Toggle Lighting</Button>
				<Button ref={renderButtonRef} variant="contained" color="warning" style={{ margin: 10 }} disabled={rendering}>Render</Button>
			</div>
		}
	</>
  );
});

export default useThreeJsModelViewer;