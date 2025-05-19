import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useCallback, useMemo, useRef, useEffect } from 'react';
import { Camera, Scene, Vector2, Uniform, Color, Vector3 } from 'three';
import { Effect } from 'postprocessing';
import { ShaderPass } from 'three/examples/jsm/Addons.js';
import compositeFrag from './glsl/composite.frag';
import { useFBOs } from './hooks/useFBOs';
import { useMaterials } from './hooks/useMaterials';
import { OPTS } from './constant';
import { usePointer } from './hooks/usePointer';
import { BlendFunction } from 'postprocessing';

const normalizeScreenHz = (value, dt) => {
    return Math.pow(value, dt * OPTS.refreshRate);
};


 
class FluidEffect extends Effect {
    
    constructor(props = {}) {
        const uniforms = {
            uTime: new Uniform(0),
            tFluid: new Uniform(props.tFluid),
            uDistort: new Uniform(props.distortion),
            uRainbow: new Uniform(props.rainbow),
            uIntensity: new Uniform(props.intensity),
            uBlend: new Uniform(props.blend),
            uShowBackground: new Uniform(props.showBackground),
            uColor: new Uniform(hexToRgb(props.fluidColor)),
            uBackgroundColor: new Uniform(hexToRgb(props.backgroundColor)),
        };

        super('FluidEffect', compositeFrag, {
            blendFunction: props.blendFunction,
            uniforms: new Map(Object.entries(uniforms)),
        });

        this.state = { ...props };
    }

    updateUniform(key, value) {
        const uniform = this.uniforms.get(key);
        if (uniform) {
            uniform.value = value;
        }
    }

    update() {
        this.updateUniform('uIntensity', this.state.intensity);
        this.updateUniform('uDistort', this.state.distortion);
        this.updateUniform('uRainbow', this.state.rainbow);
        this.updateUniform('uBlend', this.state.blend);
        this.updateUniform('uShowBackground', this.state.showBackground);
        this.updateUniform('uColor', hexToRgb(this.state.fluidColor));
        this.updateUniform('uBackgroundColor', hexToRgb(this.state.backgroundColor));
    }
}

const hexToRgb = (hex) => {
    const color = new Color(hex);
    return new Vector3(color.r, color.g, color.b);
};
export const Fluid = ({
    blend = OPTS.blend,
    force = OPTS.force,
    radius = OPTS.radius,
    curl = OPTS.curl,
    swirl = OPTS.swirl,
    intensity = OPTS.intensity,
    distortion = OPTS.distortion,
    fluidColor = OPTS.fluidColor,
    backgroundColor = OPTS.backgroundColor,
    showBackground = OPTS.showBackground,
    rainbow = OPTS.rainbow,
    pressure = OPTS.pressure,
    densityDissipation = OPTS.densityDissipation,
    velocityDissipation = OPTS.velocityDissipation,
    blendFunction = BlendFunction.NORMAL,
}) => {
    const size = useThree((three) => three.size);
    const gl = useThree((three) => three.gl);

    const bufferScene = useMemo(() => new Scene(), []);
    const bufferCamera = useMemo(() => new Camera(), []);

    const meshRef = useRef(null);
    const postRef = useRef(null);
    const pointerRef = useRef(new Vector2());
    const colorRef = useRef(new Vector3());

    const FBOs = useFBOs();
    const materials = useMaterials();
    const { onPointerMove, splatStack } = usePointer({ force });
    const fluidEffect = useMemo(() => {
        const effect = new FluidEffect({
           blendFunction,
           intensity,
           rainbow,
           distortion,
           backgroundColor,
           blend,
           fluidColor,
           showBackground,
           tFluid: FBOs.density.read.texture
        });
        return effect;
     }, []);
    const setShaderMaterial = useCallback((name) => {
        if (!meshRef.current) return;
        meshRef.current.material = materials[name];
        meshRef.current.material.needsUpdate = true;
    }, [materials]);

    const setRenderTarget = useCallback((name) => {
        const target = FBOs[name];
        if ('write' in target) {
            gl.setRenderTarget(target.write);
            gl.clear();
            gl.render(bufferScene, bufferCamera);
            target.swap();
        } else {
            gl.setRenderTarget(target);
            gl.clear();
            gl.render(bufferScene, bufferCamera);
        }
    }, [bufferCamera, bufferScene, FBOs, gl]);

    const setUniforms = useCallback((material, uniform, value) => {
        const mat = materials[material];
        if (mat && mat.uniforms[uniform]) {
            mat.uniforms[uniform].value = value;
        }
    }, [materials]);

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        for (let i = splatStack.length - 1; i >= 0; i--) {
            const { mouseX, mouseY, velocityX, velocityY } = splatStack[i];
            pointerRef.current.set(mouseX, mouseY);
            colorRef.current.set(velocityX, velocityY, 10.0);

            setShaderMaterial('splat');
            setUniforms('splat', 'uTarget', FBOs.velocity.read.texture);
            setUniforms('splat', 'uPointer', pointerRef.current);
            setUniforms('splat', 'uColor', colorRef.current);
            setUniforms('splat', 'uRadius', radius / 100.0);
            setRenderTarget('velocity');
            setUniforms('splat', 'uTarget', FBOs.density.read.texture);
            setRenderTarget('density');

            splatStack.pop();
        }

        setShaderMaterial('curl');
        setUniforms('curl', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('curl');

        setShaderMaterial('vorticity');
        setUniforms('vorticity', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('vorticity', 'uCurl', FBOs.curl.texture);
        setUniforms('vorticity', 'uCurlValue', curl);
        setRenderTarget('velocity');

        setShaderMaterial('divergence');
        setUniforms('divergence', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('divergence');

        setShaderMaterial('clear');
        setUniforms('clear', 'uTexture', FBOs.pressure.read.texture);
        setUniforms('clear', 'uClearValue', normalizeScreenHz(pressure, delta));
        setRenderTarget('pressure');

        setShaderMaterial('pressure');
        setUniforms('pressure', 'uDivergence', FBOs.divergence.texture);

        for (let i = 0; i < swirl; i++) {
            setUniforms('pressure', 'uPressure', FBOs.pressure.read.texture);
            setRenderTarget('pressure');
        }

        setShaderMaterial('gradientSubstract');
        setUniforms('gradientSubstract', 'uPressure', FBOs.pressure.read.texture);
        setUniforms('gradientSubstract', 'uVelocity', FBOs.velocity.read.texture);
        setRenderTarget('velocity');

        setShaderMaterial('advection');
        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.velocity.read.texture);
        setUniforms('advection', 'uDissipation', normalizeScreenHz(velocityDissipation, delta));
        setRenderTarget('velocity');

        setUniforms('advection', 'uVelocity', FBOs.velocity.read.texture);
        setUniforms('advection', 'uSource', FBOs.density.read.texture);
        setUniforms('advection', 'uDissipation', normalizeScreenHz(densityDissipation, delta));
        setRenderTarget('density');
        fluidEffect.uniforms.get('uTime').value += delta;

        fluidEffect.update();
    });

    return (
        <>
            {createPortal(
                <mesh
                    ref={meshRef}
                    onPointerMove={onPointerMove}
                    scale={[size.width, size.height, 1]}>
                    <planeGeometry args={[2, 2, 10, 10]} />
                </mesh>,
                bufferScene
            )}

<primitive ref={postRef} object={fluidEffect} dispose={null} />


        </>
    );
};
