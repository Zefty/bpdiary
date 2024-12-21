"use client";
import {useState, useEffect} from 'react';

const getOrientation = () => screen.orientation.type;

export const useScreenOrientation = () => {
    const [orientation, setOrientation] = useState<OrientationType>("landscape-primary");

    useEffect(() => {
        if (screen === undefined) return;

        const handleOrientationChange = () => setOrientation(getOrientation());

        screen.orientation.addEventListener('change', handleOrientationChange);

        return () => screen.orientation.removeEventListener('change', handleOrientationChange);
    }, []);

    return orientation;
};