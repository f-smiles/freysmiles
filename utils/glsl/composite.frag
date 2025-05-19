uniform sampler2D tFluid;
uniform vec3  uBackgroundColor;
uniform float uDistort;
uniform float uIntensity;
uniform float uBlend;
uniform float uTime;

void mainImage(const in vec4 inputColor,
               const in vec2 uv,
               out vec4      outputColor)
{
    vec3  flow   = texture2D(tFluid, uv).rgb;
    float lum    = length(flow);

    vec2  duv    = uv - flow.rg * uDistort * 0.001;
    vec4  scene  = texture2D(inputBuffer, duv);

    //  pink base
    vec3  hotPink = vec3(1.00, 0.12, 0.66);
    float gain    = lum * uIntensity * 0.0012;   

    // chrome shimmer, but reduce influence
    float highlight = pow(lum, 1.2) * 1.2;
    float wave = sin((uv.x + uv.y) * 120.0 + uTime * 2.0) * 0.04 + 0.96;

    vec3 tint = vec3(0.95, 0.9, 1.0) + 0.025 * vec3(
        sin(uTime + uv.x * 15.0),
        sin(uTime + uv.y * 15.0),
        cos(uTime + (uv.x + uv.y) * 7.0)
    );

    vec3 chrome = clamp(tint * highlight * wave, 0.0, 1.0);

    //  (the lower the value the more pink)
    vec3 chromePink = mix(hotPink, chrome, 0.1) * gain;


    chromePink = chromePink * 1.1;

    vec4 wet = mix(scene, vec4(chromePink, 1.0), clamp(uBlend * 0.01, 0.0, 1.0));
    vec4 bg  = vec4(uBackgroundColor, 1.0);

    if (scene.a < 0.1)
        outputColor = mix(bg, vec4(chromePink, 1.0), gain);
    else
        outputColor = mix(wet, bg, 1.0 - scene.a);
}
