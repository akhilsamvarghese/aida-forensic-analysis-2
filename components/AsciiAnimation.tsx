import React, { useEffect, useRef, useState } from 'react';
import { frames } from '../assets/ASCIImotion-animation/animation';

const AsciiAnimation: React.FC = () => {
    const [frameIndex, setFrameIndex] = useState(0);
    const requestRef = useRef<number>();
    const lastTimeRef = useRef<number>(0);
    const fps = 24;
    const interval = 1000 / fps;

    const animate = (time: number) => {
        if (lastTimeRef.current === 0) {
            lastTimeRef.current = time;
        }

        const delta = time - lastTimeRef.current;

        if (delta > interval) {
            setFrameIndex((prev) => (prev + 1) % frames.length);
            lastTimeRef.current = time - (delta % interval);
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden pointer-events-none select-none">
            <pre
                className="font-mono font-bold text-[7.5px] leading-[7.5px] whitespace-pre text-main"
                style={{ fontFamily: '"Courier New", monospace' }}
            >
                {frames[frameIndex]}
            </pre>
        </div>
    );
};

export default AsciiAnimation;
