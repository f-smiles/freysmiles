import * as THREE from 'three';
import { useFBO } from '@react-three/drei';
import { useEffect, useMemo, useRef } from 'react';
import { OPTS } from '../constant';



const useDoubleFBO = (width, height, options) => {
    const read = useFBO(width, height, options);
    const write = useFBO(width, height, options);

    const fboRef = useRef({}); 

    if (!fboRef.current.read) {
        fboRef.current = {
            read,
            write,
            swap: () => {
                const temp = fboRef.current.read;
                fboRef.current.read = fboRef.current.write;
                fboRef.current.write = temp;
            },
            dispose: () => {
                read.dispose();
                write.dispose();
            },
        };
    }

    return fboRef.current;
};


export const useFBOs = () => {
    const density = useDoubleFBO(OPTS.dyeRes, OPTS.dyeRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGBAFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    });

    const velocity = useDoubleFBO(OPTS.simRes, OPTS.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RGFormat,
        minFilter: THREE.LinearFilter,
        depth: false,
    });

    const pressure = useDoubleFBO(OPTS.simRes, OPTS.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const divergence = useFBO(OPTS.simRes, OPTS.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const curl = useFBO(OPTS.simRes, OPTS.simRes, {
        type: THREE.HalfFloatType,
        format: THREE.RedFormat,
        minFilter: THREE.NearestFilter,
        depth: false,
    });

    const FBOs = useMemo(() => ({
        density,
        velocity,
        pressure,
        divergence,
        curl,
    }), [curl, density, divergence, pressure, velocity]);

    useEffect(() => {
        return () => {
            for (const FBO of Object.values(FBOs)) {
                FBO.dispose();
            }
        };
    }, [FBOs]);

    return FBOs;
};
