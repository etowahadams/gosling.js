import React, { useState, useEffect } from 'react';
import { PixiManager } from '@pixi-manager';
import {
    addDummyTrack,
    addTextTrack,
    addCircularBrush,
    addGoslingTrack,
    addAxisTrack,
    addLinearBrush,
    addBigwig
} from './examples';

import './App.css';
import { add } from 'lodash-es';

function App() {
    const [fps, setFps] = useState(120);

    useEffect(() => {
        // Create the new plot
        const plotElement = document.getElementById('plot') as HTMLDivElement;
        plotElement.innerHTML = '';
        // Initialize the PixiManager. This will be used to get containers and overlay divs for the plots
        const pixiManager = new PixiManager(1000, 600, plotElement, setFps);
        addTextTrack(pixiManager);
        addDummyTrack(pixiManager);
        addCircularBrush(pixiManager);
        addGoslingTrack(pixiManager);
        addAxisTrack(pixiManager);
        addLinearBrush(pixiManager);
        addBigwig(pixiManager);
    }, []);

    return (
        <>
            <h1>HiGlass/Gosling tracks with new renderer</h1>

            <div className="card">
                <div className="card" id="plot"></div>
            </div>
        </>
    );
}

export default App;
