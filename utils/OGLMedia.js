import { Mesh, Program, Texture } from 'ogl';

const fragment = `
precision highp float;

uniform vec2 uImageSizes;
uniform vec2 uPlaneSizes;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 ratio = vec2(
    min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
    min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
  );

  vec2 uv = vec2(
    vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
    vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
  );

  gl_FragColor.rgb = texture2D(tMap, uv).rgb;
  gl_FragColor.a = 1.0;
}
`;


const vertex =  `
precision highp float;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uStrength;

varying vec2 vUv;

void main() {
  vUv = uv;

  vec3 pos = position;
  pos.z += sin(uv.y * 3.14159) * uStrength;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}


`;

export default class Media {
    constructor({ element, image, geometry, gl, height, scene, screen, viewport, customBounds }) {
        this.element = element;
        this.image = image;
        this.geometry = geometry;
        this.gl = gl;
        this.scene = scene;
        this.screen = screen;
        this.viewport = viewport;
        this.height = height;
        this.extra = 0;
        this.customBounds = customBounds;
      
        this.createMesh(image);
      }
      
      
    
      createMesh(image) {
        const texture = new Texture(this.gl);
        texture.image = image;
        texture.wrapS = this.gl.CLAMP_TO_EDGE;
        texture.wrapT = this.gl.CLAMP_TO_EDGE;
        
        const program = new Program(this.gl, {
          vertex,
          fragment,
          uniforms: {
            tMap: { value: texture },
            uPlaneSizes: { value: [0, 0] },
            uImageSizes: { value: [image.naturalWidth, image.naturalHeight] },
            uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
            uStrength: { value: 0 }
          },
          transparent: true
        });
      
        this.plane = new Mesh(this.gl, {
          geometry: this.geometry,
          program,
        });
      
        this.plane.setParent(this.scene);
        this.createBounds();
      }
      
  createBounds() {
    if (!this.plane) return;
  
    this.bounds = this.customBounds || this.element.getBoundingClientRect();
  
    this.updateScale();
    this.updateX();
    this.updateY();
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }
  
  
  

  updateScale() {
    if (!this.plane) return;
  
    // Match the image’s pixel size more directly in world units (viewport space)
    const scaleX = (this.image.naturalWidth / this.screen.width) * this.viewport.width;
    const scaleY = (this.image.naturalHeight / this.screen.height) * this.viewport.height;
  
    this.plane.scale.x = scaleX;
    this.plane.scale.y = scaleY;
  
    this.plane.program.uniforms.uPlaneSizes.value = [scaleX, scaleY];
  }
  

  updateX(x = 0) {
    if (!this.plane) return;
    this.plane.position.x =
      (-this.viewport.width / 2) +
      (this.plane.scale.x / 2) +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }
  
  updateY(y = 0) {
    if (!this.plane) return;
  
    this.plane.position.y =
      (this.viewport.height / 2) -
      (this.plane.scale.y / 2) -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height -
      this.extra; 
  }
  

  onResize(sizes) {
    if (sizes) {
      const { height, screen, viewport } = sizes;
  
      if (height !== undefined) this.height = height;
      if (screen) this.screen = screen;
      if (viewport) {
        this.viewport = viewport;
  

        if (this.plane && this.plane.program && this.plane.program.uniforms.uViewportSizes) {
          this.plane.program.uniforms.uViewportSizes.value = [this.viewport.width, this.viewport.height];
        }
      }
    }
  
    this.extra = 0;
    this.createBounds();
  }
  
  
  

  update(y, direction) {
    if (!this.plane) return;
  
    this.updateScale();
    this.updateX();
    this.updateY(y.current);
  

    const scrollDelta = y.current - y.last;
    const baseStrength = Math.min(Math.abs(scrollDelta) * 0.05, 0.6);
    

    this.plane.program.uniforms.uStrength.value = direction === "down" ? baseStrength : -baseStrength;
    
this.plane.program.uniforms.uStrength.value = Math.min(
  Math.abs(y.current - y.last) * 0.05,
  .4
);
  
  
    const planeOffset = this.plane.scale.y / 2;
    const viewportOffset = this.viewport.height / 2;
  
    this.isBefore = this.plane.position.y + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.y - planeOffset > viewportOffset;
  
    if (direction === 'up' && this.isBefore) {
      this.extra -= this.height;
      this.isBefore = false;
      this.isAfter = false;
    }
  
    if (direction === 'down' && this.isAfter) {
      this.extra += this.height;
      this.isBefore = false;
      this.isAfter = false;
    }
  }
  
  
}
