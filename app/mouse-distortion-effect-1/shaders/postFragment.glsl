uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_aspect;
uniform float u_time;
uniform float u_progress;
uniform float u_velo;
uniform int u_type;
uniform sampler2D tDiffuse;

varying vec2 v_uv;

float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
  uv -= disc_center;
  uv *= u_resolution;
  float dist = sqrt(dot(uv, uv));
  return smoothstep(disc_radius + border_size, disc_radius - border_size, dist);
}

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float remap(float value, float inMin, float inMax, float outMin, float outMax) {
  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
}

float hash12(vec2 p) {
  float h = dot(p, vec2(127.1, 311.7));
  return fract(sin(h) * 43758.5453123);
}

	// #define HASHSCALE3 vec3(.1031, .1030, .0973)
vec2 hash2d(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
  p3 += dot(p3, p3.yzx + 19.19);
  return fract((p3.xx + p3.yz) * p3.zy);
}

  // distort effect without chromatic aberration
  // void main() {
  //   vec2 uv = v_uv;
  //   float c = circle(uv, u_mouse, 0.0, 0.2);
  //   vec2 offset = vec2(c * u_velo); // ✅ fixed

  //   float r = texture2D(tDiffuse, uv + offset * 0.5).r;
  //   float g = texture2D(tDiffuse, uv + offset * 0.525).g;
  //   float b = texture2D(tDiffuse, uv + offset * 0.55).b;

  //   gl_FragColor = vec4(r, g, b, 1.0);
  // }

void main() {
  vec2 uv = v_uv;
  vec4 color = vec4(1., 0., 0., 1.);

  float c = circle(uv, u_mouse, 0.0, 0.2);
  float r = texture2D(tDiffuse, uv.xy += c * (u_velo * .5)).x;
  float g = texture2D(tDiffuse, uv.xy += c * (u_velo * .525)).y;
  float b = texture2D(tDiffuse, uv.xy += c * (u_velo * .55)).z;
  color = vec4(r, g, b, 1.);

  gl_FragColor = color;
}