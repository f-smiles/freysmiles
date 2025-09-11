uniform vec2 u_resolution;
uniform sampler2D u_texture;
uniform float u_aspect;

varying vec2 v_uv;

void main() {
	vec2 uv = v_uv;
	float screenAspect = u_resolution.x / u_resolution.y;
	float ratio = u_aspect / screenAspect;

	vec2 texCoord = vec2(mix(0.5 - 0.5 / ratio, 0.5 + 0.5 / ratio, uv.x), uv.y);

	gl_FragColor = texture2D(u_texture, texCoord);
}