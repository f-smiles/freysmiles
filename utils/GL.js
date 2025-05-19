import { Renderer, Camera, Transform, Plane } from 'ogl'
import Media from './Media.js';

export default class GL {
  constructor () {
    this.carouselRef = document.querySelector(".carousel-container"); 
    this.images = [...document.querySelectorAll('.media')]
    
    this.createRenderer()
    this.createCamera()
    this.createScene()

    this.onResize()

    this.createGeometry()
    this.createMedias()

    this.update()

    this.addEventListeners()
  }
  createRenderer () {
    this.renderer = new Renderer({
      canvas: document.querySelector('#gl'),
      alpha: true
    })

    this.gl = this.renderer.gl
  }
  createCamera () {
    this.camera = new Camera(this.gl)
    this.camera.fov = 45
    this.camera.position.z = 20
  }
  createScene () {
    this.scene = new Transform()
  }
  createGeometry () {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100
    })
  }
  createMedias() {
    this.medias = this.images.map((item) => {
        console.log("Create:", item.dataset.src); 
      return new Media({
        gl: this.gl,
        geometry: this.planeGeometry,
        scene: this.scene,
        renderer: this.renderer,
        screen: this.screen,
        viewport: this.viewport,
        $el: item,
        img: { src: item.dataset.src }, 
      });
    });
  }


  onResize () {
    this.screen = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    this.renderer.setSize(this.screen.width, this.screen.height)

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height
    })

    const fov = this.camera.fov * (Math.PI / 180)
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z
    const width = height * this.camera.aspect

    this.viewport = {
      height,
      width
    }
    if (this.medias) {
      this.medias.forEach(media => media.onResize({
        screen: this.screen,
        viewport: this.viewport
      }))
      this.onScroll({scroll: window.scrollY})
    }
  }
  onScroll({ scroll }) {
    if (!this.carouselRef) return;
  
    const maxScroll = this.carouselRef.scrollWidth - this.carouselRef.clientWidth;
    const normalizedScroll = scroll / maxScroll; 
  
    if (this.medias) {
      this.medias.forEach(media => {
        let newBlur = Math.max(0, 3 - (normalizedScroll * 3)); 
  

        media.program.uniforms.uTime.value = newBlur;
  
      });
    }
  
    this.renderer.render({ scene: this.scene, camera: this.camera }); // ✅ Ensure redraw
  }
  
  
  
  
  update() {
    if (this.medias) {
      this.medias.forEach(media => media.update())
    }

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
    window.requestAnimationFrame(this.update.bind(this))
  }
  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))
  }
}

//   const handleScroll = () => {
//     if (!carouselRef.current) return;
  
//     const scrollLeft = carouselRef.current.scrollLeft;
//     const itemWidth = carouselRef.current.scrollWidth / carouselItems.length;
//     const newIndex = Math.round(scrollLeft / itemWidth);
  
//     setCurrentIndex(newIndex);
    

//     if (window.GLInstance) {
//       window.GLInstance.onScroll({ scroll: scrollLeft });
//     }
//   };
//     useEffect(() => {
//     if (!window.GLInstance) {
//       window.GLInstance = new GL();
//     }
//     return () => {
//       window.GLInstance = null;
//     };
//   }, []);
//   <div ref={carouselRef} 
//   onScroll={handleScroll} 
//  className="carousel-container flex overflow-x-auto snap-mandatory snap-x scroll-smooth scrollbar-hide relative"
//   style={{ scrollSnapType: "x mandatory" }}
// >

//   <canvas id="gl" className="absolute inset-0 w-full h-full pointer-events-none z-10"></canvas>


//   {carouselItems.map((item, index) => (
//     <motion.div
//   key={index}
//   className="media flex-none flex flex-col items-center justify-center cursor-grab active:cursor-grabbing my-6 mx-6"
//   data-src={item.src} 
//   whileTap={{ scale: 0.98 }}
// >
//   <div className="relative w-[30vw] h-[70vh] flex items-center justify-center p-4">
//     <div className="absolute inset-0 flex items-center justify-center font-neue-montreal text-[#17191A] text-[15px] p-4">
//       {item.description}
//     </div>
//   </div>

//   <p className="font-neue-montreal text-center text-sm">{item.name}</p>
// </motion.div>

//   ))}
// </div>