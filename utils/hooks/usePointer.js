import { useThree } from '@react-three/fiber';
import { useCallback, useRef, useEffect } from 'react';
import { Vector2 } from 'three';

export const usePointer = ({ force }) => {
    const splatStack = useRef([]).current;
    const lastMouse = useRef({ x: 0, y: 0 });
    const hasMoved = useRef(false);

    useEffect(() => {
        const handlePointerMove = (event) => {
            const { innerWidth, innerHeight } = window;

            const deltaX = event.clientX - lastMouse.current.x;
            const deltaY = event.clientY - lastMouse.current.y;

            if (!hasMoved.current) {
                hasMoved.current = true;
                lastMouse.current = { x: event.clientX, y: event.clientY };
                return;
            }

            lastMouse.current = { x: event.clientX, y: event.clientY };

            splatStack.push({
                mouseX: event.clientX / innerWidth,
                mouseY: 1.0 - event.clientY / innerHeight,
                velocityX: deltaX * force,
                velocityY: -deltaY * force,
            });
        };

        window.addEventListener('pointermove', handlePointerMove);

        return () => window.removeEventListener('pointermove', handlePointerMove);
    }, [force]);

    return { splatStack };
};