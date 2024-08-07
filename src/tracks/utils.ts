import { type Signal } from '@preact/signals-core';
import { type ScaleLinear } from 'd3-scale';

// Default d3 zoom feels slow so we use this instead
// https://d3js.org/d3-zoom#zoom_wheelDelta
export function zoomWheelBehavior(event: WheelEvent) {
    const defaultMultiplier = 5;
    return (
        -event.deltaY *
        (event.deltaMode === 1 ? 0.05 : event.deltaMode ? 1 : 0.002) *
        (event.ctrlKey ? 10 : defaultMultiplier)
    );
}

/**
 * This is the interface that plots must implement for Interactors to work
 */
export interface Plot {
    addInteractor(interactor: (plot: Plot) => void): Plot;
    domOverlay: HTMLElement;
    orientation?: 'horizontal' | 'vertical';
    width: number;
    height: number;
    xDomain: Signal<[number, number]>;
    yDomain?: Signal<[number, number]>;
    zoomed(xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>): void;
}

/**
 * This this is the plot interface for the PanZoomHeatmap interactor
 */
export interface HeatmapPlot {
    addInteractor(interactor: (plot: Plot) => void): Plot;
    domOverlay: HTMLElement;
    xDomain: Signal<[number, number]>;
    yDomain: Signal<[number, number]>;
    maxDomain: number;
    zoomed(
        xScale: ScaleLinear<number, number>,
        yScale: ScaleLinear<number, number>,
        k: number,
        tx: number,
        ty: number
    ): void;
}
