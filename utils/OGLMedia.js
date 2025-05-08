import { Mesh, Program, Texture } from 'ogl';

const fragment = `
precision highp float;

uniform sampler2D tMap;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(tMap, vUv);
}

`;


const vertex =  `
#define PI 3.1415926535897932384626433832795

precision highp float;
precision highp int;

attribute vec3 position;
attribute vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uStrength;
uniform vec2 uViewportSizes;

varying vec2 vUv;

void main() {
  vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

  newPosition.z += sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0) * -uStrength;

  vUv = uv;

  gl_Position = projectionMatrix * newPosition;
}


`;



export default class Media {
  constructor({ element, geometry, gl, height, scene, screen, viewport }) {
    this.element = element;
    this.image = this.element.querySelector('img');

    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.height = height;
    this.extra = 0;

    this.createMesh();
    this.onResize();
  }

  createMesh() {
    const image = new Image();
    image.crossOrigin = 'anonymous'; 
    image.src = this.image.src;
  
    const texture = new Texture(this.gl);
  
    image.onload = () => {
      texture.image = image;
  
      texture.wrapS = this.gl.CLAMP_TO_EDGE;
      texture.wrapT = this.gl.CLAMP_TO_EDGE;
  
      texture.generateMipmaps = true;
      texture.minFilter = this.gl.LINEAR_MIPMAP_LINEAR; 
      texture.magFilter = this.gl.LINEAR;
  
      const ext = this.gl.getExtension('EXT_texture_filter_anisotropic');
      if (ext) {
        texture.anisotropy = this.gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
      }
  
      texture.needsUpdate = true;
  
      this.program.uniforms.uImageSizes.value = [
        image.naturalWidth,
        image.naturalHeight,
      ];
      this.updateScale()
    };
  
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: {
          value: [this.viewport.width, this.viewport.height]
        },
        uStrength: { value: 0 }
      },
      transparent: true
    });
  
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });
  
    this.plane.setParent(this.scene);
  }
  

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();

    this.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }
  updateScale() {
    if (!this.plane) return;
  
    const imageAspect = this.image.naturalWidth / this.image.naturalHeight;
    const planeHeight = this.viewport.height * 2.5; 
    const planeWidth = planeHeight * imageAspect; 
  
    this.plane.scale.x = planeWidth;
    this.plane.scale.y = planeHeight;
  
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }
  
  

  updateX(x = 0) {
    this.plane.position.x =
      -this.viewport.width / 2 +
      this.plane.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }

  updateY(y = 0) {
    this.plane.position.y =
      this.viewport.height / 2 -
      this.plane.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height -
      this.extra;
  }

  update(y, direction) {
    // this.updateScale();
    this.updateX();
    this.updateY(y.current);

    const scrollDelta = y.current - y.last;
    this.program.uniforms.uStrength.value = Math.min(
      Math.abs(scrollDelta) * 0.05,
      0.4
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

  onResize(sizes) {
    if (sizes) {
      const { height, screen, viewport } = sizes;
      if (height) this.height = height;
      if (screen) this.screen = screen;
      if (viewport) {
        this.viewport = viewport;
        this.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }

    this.extra = 0;
    this.createBounds();
  }
}
