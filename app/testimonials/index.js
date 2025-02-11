'use client';
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

const ThreeDCarousel = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    const scene = new THREE.Scene();
  
    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
  
    const carouselRadius = 1.7;
    const desiredZoomLevel = 1.3;
    const initialZ = carouselRadius * desiredZoomLevel;
    camera.position.set(0, -5, initialZ);
  
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);
  
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.minPolarAngle = Math.PI / 2;
    controls.maxPolarAngle = Math.PI / 2;

    const carouselGroup = new THREE.Group();
    carouselGroup.position.y = 0.5;
    scene.add(carouselGroup);
  
    const degToRad = (degrees) => degrees * (Math.PI / 180);
    carouselGroup.rotation.x = degToRad(35);
  
    const numItems = 8;
    const planes = [];
  
    const updateCurve = (geometry, curveRadius) => {
      const scale = 0.15; // Reduce curve
      let zOffset = 0;
    
      for (let j = 0; j < geometry.attributes.position.count; j++) {
        const position = geometry.attributes.position;
        const x = position.getX(j);
    
        const z = scale * (curveRadius > 0
          ? Math.sqrt(Math.max(0, curveRadius ** 2 - x ** 2)) - curveRadius // Convex
          : -(Math.sqrt(Math.max(0, curveRadius ** 2 - x ** 2)) - curveRadius)); // Concave
    
        position.setZ(j, z);
        zOffset += z;
      }
    
      zOffset /= geometry.attributes.position.count;
    
      for (let j = 0; j < geometry.attributes.position.count; j++) {
        const position = geometry.attributes.position;
        const z = position.getZ(j);
        position.setZ(j, z - zOffset);
      }
    
      geometry.attributes.position.needsUpdate = true;
    };
    
    
    for (let i = 0; i < numItems; i++) {
      const geometry = new THREE.PlaneGeometry(1, 1.5, 32, 32);
      const texture = new THREE.TextureLoader().load(`../images/freysmilepatient.jpg`);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.DoubleSide,
      });
  
      const curveRadius = 1.5; // initial convex
      updateCurve(geometry, curveRadius);
  
      const plane = new THREE.Mesh(geometry, material);
      const angle = (i / numItems) * Math.PI * 2;
  
      plane.position.x = Math.cos(angle) * carouselRadius;
      plane.position.z = Math.sin(angle) * carouselRadius;
      plane.position.y = 0;
      plane.lookAt(new THREE.Vector3(0, 0, 0));
  
      plane.userData = {
        originalPosition: plane.position.clone(),
        curveRadius,
      };
  
      planes.push(plane);
      carouselGroup.add(plane);
    }
  

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
  
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planes);
    
      planes.forEach((plane) => {
        if (intersects.find((intersect) => intersect.object === plane)) {

          if (!plane.userData.hovering) {
            plane.userData.hovering = true;
    

            gsap.to(plane.userData, {
              curveRadius: .5, 
              duration: 0.5,
              ease: "power2.out",
              onUpdate: () => {
  
                updateCurve(plane.geometry, plane.userData.curveRadius);
              },
            });
          }
        } else if (plane.userData.hovering) {

          plane.userData.hovering = false;
    
          gsap.to(plane.userData, {
            curveRadius: -1.5, 
            duration: 0.5,
            ease: "power2.inOut",
            onUpdate: () => {

              updateCurve(plane.geometry, plane.userData.curveRadius);
            },
          });
        }
      });
    };
    
    
    window.addEventListener("mousemove", onMouseMove);
  
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);
  
    let scrollProgress = 0;
    const onScroll = (event) => {
      scrollProgress += event.deltaY * 0.002;
      carouselGroup.rotation.y = scrollProgress;
    };
  
    const preventDefault = (event) => {
      event.preventDefault();
    };
  
    window.addEventListener("wheel", onScroll);
    renderer.domElement.addEventListener("wheel", preventDefault, { passive: false });
  
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("wheel", onScroll);
      renderer.domElement.removeEventListener("wheel", preventDefault);
      mountRef.current.removeChild(renderer.domElement);
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
    };
  }, []);
  
  
  

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh", background: "white" }} />;
};

export default ThreeDCarousel;


{/* <div>
      <header className="flex flex-row w-full py-8 justify-center items-center fixed top-0 left-0 bg-slate-950 z-10">
        <div className="flex items-center justify-center max-w-6xl w-full">
          <a href="/" className="text-3xl text-slate-50" id="testimonials">
            Testimonials
          </a>
        </div>
      </header>

      <div id="smooth-wrapper" className="w-full">
        <main id="smooth-content">

          <section className="h-[100vh] w-full grid place-items-center bg-slate-950"></section>

    
          <section
            id="section-2"
            className="h-[100vh] w-full grid place-items-center bg-slate-900"
            aria-labelledby="section-2-heading"
          >
            <div
              id="img-container"
              className="share-grid gap-4 w-full h-full justify-center images-grid images-initial-grid"
            >
              <a
                id="image-1"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
              >
                <img
                  src="https://a.storyblok.com/f/187090/800x801/ac1f2976aa/package-starter.jpg/m/"
                  alt="Image 1"
                  className="w-full h-full object-cover"
                />
              </a>

              <a
                id="image-2"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
              >
                <img
                  src="https://a.storyblok.com/f/187090/500x501/32480d7ad2/process-analysis.jpg/m/"
                  alt="Image 2"
                  className="w-full h-full object-cover"
                />
              </a>

              <a
                id="image-3"
                href="https://www.google.com"
                className="grid-image block w-full aspect-square max-w-[400px]"
              >
                <img
                  src="https://a.storyblok.com/f/187090/501x501/44fb6f9a2f/process-development.jpg/m/"
                  alt="Image 3"
                  className="w-full h-full object-cover"
                />
              </a>
            </div>

            <h1
              id="section-2-heading"
              className="text-5xl font-sans font-bold text-slate-50 max-w-[32rem] text-center share-grid"
            >
              How do we know we are who we say we are?
            </h1>
          </section>

       
          <section className="h-screen w-full grid place-items-center bg-yellow-100">
            <h1 className="text-5xl font-sans font-bold">Eh? World</h1>
          </section>
        </main>
      </div>
    </div> */}