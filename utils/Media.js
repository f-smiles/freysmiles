import { Mesh, Program, Texture } from 'ogl';

export default class Media {
  constructor ({ gl, geometry, scene, renderer, screen, viewport, $el, img }) {
    this.gl = gl;
    this.geometry = geometry;
    this.scene = scene;
    this.renderer = renderer;
    this.screen = screen;
    this.viewport = viewport;
    this.img = img;
    this.$el = $el;
    this.scroll = 0;

    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader () {
    const texture = new Texture(this.gl, {
      generateMipmaps: false
    });

    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment: this.fragmentShader,
      vertex: this.vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 100 * Math.random() },
      },
      transparent: true
    });

    const image = new Image();
    image.src = this.$el.dataset.src; 
    image.onload = () => {
      texture.image = image;
      this.program.uniforms.uImageSize.value = [image.naturalWidth, image.naturalHeight];
    };
  }

  createMesh () {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });

    this.plane.setParent(this.scene);
  }

  onScroll({ scroll }) {
    const maxScroll = this.carouselRef.scrollWidth - this.carouselRef.clientWidth;
    const normalizedScroll = scroll / maxScroll; 
  
    if (this.medias) {
      this.medias.forEach(media => {
        media.program.uniforms.uTime.value = Math.max(0, 2 - normalizedScroll * 2); 
      });
    }
  }
  
  update() {

    this.program.uniforms.uTime.value = Math.max(0, this.program.uniforms.uTime.value - 0.005);
  }
  

  setScale (x, y) {
    x = x || this.$el.offsetWidth;
    y = y || this.$el.offsetHeight;
    this.plane.scale.x = this.viewport.width * x / this.screen.width;
    this.plane.scale.y = this.viewport.height * y / this.screen.height;
    this.plane.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
  }

  setX(x = 0) {
    this.x = x;
    this.plane.position.x = -(this.viewport.width / 2) + (this.plane.scale.x / 2) + (this.x / this.screen.width) * this.viewport.width;
  }

  setY(y = 0) {
    this.y = y;
    this.plane.position.y = (this.viewport.height / 2) - (this.plane.scale.y / 2) - ((this.y - this.scroll) / this.screen.height) * this.viewport.height;
  }

  onResize ({ screen, viewport } = {}) {
    if (screen) {
      this.screen = screen;
    }
    if (viewport) {
      this.viewport = viewport;
      this.plane.program.uniforms.uViewportSize.value = [this.viewport.width, this.viewport.height];
    }
    this.setScale();
    this.setX(this.$el.offsetLeft);
    this.setY(this.$el.offsetTop);
  }


  vertexShader = `
    precision highp float;
    attribute vec3 position;
    attribute vec2 uv;
    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;


  fragmentShader = `
    precision highp float;
    uniform vec2 uImageSize;
    uniform vec2 uPlaneSize;
    uniform vec2 uViewportSize;
    uniform float uTime;
    uniform sampler2D tMap;
    varying vec2 vUv;

    float tvNoise(vec2 p, float ta, float tb) {
      return fract(sin(p.x * ta + p.y * tb) * 5678.);
    }

    vec3 draw(sampler2D image, vec2 uv) {
      return texture2D(image, vec2(uv.x, uv.y)).rgb;   
    }

    float rand(vec2 co) {
      return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec3 blur(vec2 uv, sampler2D image, float blurAmount) {
      vec3 blurredImage = vec3(0.);
      float d = smoothstep(0.8, 0.0, (gl_FragCoord.y / uViewportSize.y) / uViewportSize.y);
      #define repeats 40.
      for (float i = 0.; i < repeats; i++) { 
        vec2 q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i, uv.x + uv.y)) + blurAmount); 
        vec2 uv2 = uv + (q * blurAmount * d);
        blurredImage += draw(image, uv2) / 2.;
        q = vec2(cos(degrees((i / repeats) * 360.)), sin(degrees((i / repeats) * 360.))) * (rand(vec2(i + 2., uv.x + uv.y + 24.)) + blurAmount); 
        uv2 = uv + (q * blurAmount * d);
        blurredImage += draw(image, uv2) / 2.;
      }
      return blurredImage / repeats;
    }

    void main() {
      vec2 ratio = vec2(
        min((uPlaneSize.x / uPlaneSize.y) / (uImageSize.x / uImageSize.y), 1.0),
        min((uPlaneSize.y / uPlaneSize.x) / (uImageSize.y / uImageSize.x), 1.0)
      );

      vec2 uv = vec2(
        vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
        vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
      );

      float t = uTime + 123.0;
      float ta = t * 0.654321;
      float tb = t * (ta * 0.123456);
      vec4 noise = vec4(1. - tvNoise(uv, ta, tb));

float blurFactor = smoothstep(1.5, 0.1, uTime);
vec4 blurredImage = vec4(blur(uv, tMap, blurFactor), 1.0);


if (blurFactor > 1.0) {
    blurredImage = vec4(1.0, 0.0, 0.0, 1.0); 
}

gl_FragColor = blurredImage;



    }
  `;
}
