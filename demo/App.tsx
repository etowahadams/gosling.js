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
import { compile } from '../src/compiler/compile';
import { getTheme } from '../src/core/utils/theme';

import './App.css';
import type { HiGlassSpec } from '@gosling-lang/higlass-schema';
import { createTrackDefs, renderTrackDefs, showTrackInfoPositions } from './renderer/main';
import type { TrackInfo } from 'src/compiler/bounding-box';
import type { GoslingSpec } from 'gosling.js';
import { getLinkedEncodings } from './renderer/linkedEncoding';

function App() {
    const [fps, setFps] = useState(120);

    useEffect(() => {
        // Create the new plot
        const plotElement = document.getElementById('plot') as HTMLDivElement;
        plotElement.innerHTML = '';
        // Initialize the PixiManager. This will be used to get containers and overlay divs for the plots
        const pixiManager = new PixiManager(1000, 600, plotElement, setFps);
        // addTextTrack(pixiManager);
        // addDummyTrack(pixiManager);
        // addCircularBrush(pixiManager);
        // addGoslingTrack(pixiManager);
        // addAxisTrack(pixiManager);
        // addLinearBrush(pixiManager);
        // addBigwig(pixiManager);

        const callback = (
            hg: HiGlassSpec,
            size,
            gs: GoslingSpec,
            tracksAndViews,
            idTable,
            trackInfos: TrackInfo[],
            theme: Require<ThemeDeep>
        ) => {
            console.warn(trackInfos);
            console.warn(tracksAndViews);
            console.warn(gs);
            // showTrackInfoPositions(trackInfos, pixiManager);
            const linkedEncodings = getLinkedEncodings(gs);
            console.warn('linkedEncodings', linkedEncodings);
            const trackDefs = createTrackDefs(trackInfos, theme);
            console.warn('trackDefs', trackDefs);
            renderTrackDefs(trackDefs, linkedEncodings, pixiManager);
        };

        // Compile the spec
        compile(visualLinking, callback, [], getTheme('light'), { containerSize: { width: 300, height: 300 } });
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

const spec = {
    title: 'Basic Marks: line',
    subtitle: 'Tutorial Examples',
    layout: 'linear',
    tracks: [
        {
            layout: 'circular',
            width: 500,
            height: 180,
            data: {
                url: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
                type: 'multivec',
                row: 'sample',
                column: 'position',
                value: 'peak',
                categories: ['sample 1']
            },
            mark: 'line',
            x: { field: 'position', type: 'genomic', axis: 'top' },
            y: { field: 'peak', type: 'quantitative', axis: 'right' },
            size: { value: 2 }
        },
        {
            layout: 'circular',
            width: 500,
            height: 180,
            data: {
                url: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
                type: 'multivec',
                row: 'sample',
                column: 'position',
                value: 'peak',
                categories: ['sample 1']
            },
            mark: 'bar',
            x: { field: 'position', type: 'genomic', axis: 'top' },
            y: { field: 'peak', type: 'quantitative', axis: 'right' },
            size: { value: 2 }
        }
    ]
};

const corces = {
    title: 'Single-cell Epigenomic Analysis',
    subtitle: 'Corces et al. 2020',
    layout: 'linear',
    arrangement: 'vertical',
    views: [
        {
            layout: 'linear',
            xDomain: { chromosome: 'chr3' },
            centerRadius: 0.8,
            tracks: [
                {
                    alignment: 'overlay',
                    title: 'chr3',
                    data: {
                        url: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/cytogenetic_band.csv',
                        type: 'csv',
                        chromosomeField: 'Chr.',
                        genomicFields: ['ISCN_start', 'ISCN_stop', 'Basepair_start', 'Basepair_stop']
                    },
                    tracks: [
                        {
                            mark: 'rect',
                            dataTransform: [
                                {
                                    type: 'filter',
                                    field: 'Stain',
                                    oneOf: ['acen-1', 'acen-2'],
                                    not: true
                                }
                            ],
                            color: {
                                field: 'Density',
                                type: 'nominal',
                                domain: ['', '25', '50', '75', '100'],
                                range: ['white', '#D9D9D9', '#979797', '#636363', 'black']
                            },
                            size: { value: 20 }
                        },
                        {
                            mark: 'rect',
                            dataTransform: [{ type: 'filter', field: 'Stain', oneOf: ['gvar'] }],
                            color: { value: '#A0A0F2' },
                            size: { value: 20 }
                        },
                        {
                            mark: 'triangleRight',
                            dataTransform: [{ type: 'filter', field: 'Stain', oneOf: ['acen-1'] }],
                            color: { value: '#B40101' },
                            size: { value: 20 }
                        },
                        {
                            mark: 'triangleLeft',
                            dataTransform: [{ type: 'filter', field: 'Stain', oneOf: ['acen-2'] }],
                            color: { value: '#B40101' },
                            size: { value: 20 }
                        },
                        {
                            mark: 'brush',
                            x: { linkingId: 'detail' },
                            color: { value: 'red' },
                            opacity: { value: 0.3 },
                            strokeWidth: { value: 1 },
                            stroke: { value: 'red' }
                        }
                    ],
                    x: { field: 'Basepair_start', type: 'genomic', axis: 'none' },
                    xe: { field: 'Basepair_stop', type: 'genomic' },
                    stroke: { value: 'black' },
                    strokeWidth: { value: 1 },
                    style: { outlineWidth: 0 },
                    width: 400,
                    height: 25
                }
            ]
        },
        {
            xDomain: { chromosome: 'chr3', interval: [52168000, 52890000] },
            linkingId: 'detail',
            x: { field: 'position', type: 'genomic' },
            y: { field: 'peak', type: 'quantitative', axis: 'right' },
            style: { outline: '#20102F' },
            width: 400,
            height: 40,
            tracks: [
                {
                    data: {
                        url: 'https://s3.amazonaws.com/gosling-lang.org/data/ExcitatoryNeurons-insertions_bin100_RIPnorm.bw',
                        type: 'bigwig',
                        column: 'position',
                        value: 'peak'
                    },
                    title: 'Excitatory neurons',
                    mark: 'bar',
                    color: { value: '#F29B67' }
                },
                {
                    data: {
                        url: 'https://s3.amazonaws.com/gosling-lang.org/data/InhibitoryNeurons-insertions_bin100_RIPnorm.bw',
                        type: 'bigwig',
                        column: 'position',
                        value: 'peak'
                    },
                    title: 'Inhibitory neurons',
                    mark: 'bar',
                    color: { value: '#3DC491' }
                },
                {
                    data: {
                        url: 'https://s3.amazonaws.com/gosling-lang.org/data/DopaNeurons_Cluster10_AllFrags_projSUNI2_insertions_bin100_RIPnorm.bw',
                        type: 'bigwig',
                        column: 'position',
                        value: 'peak'
                    },
                    title: 'Dopaminergic neurons',
                    mark: 'bar',
                    color: { value: '#565C8B' }
                },
                {
                    data: {
                        url: 'https://s3.amazonaws.com/gosling-lang.org/data/Microglia-insertions_bin100_RIPnorm.bw',
                        type: 'bigwig',
                        column: 'position',
                        value: 'peak'
                    },
                    title: 'Microglia',
                    mark: 'bar',
                    color: { value: '#77C0FA' }
                },
                {
                    data: {
                        url: 'https://s3.amazonaws.com/gosling-lang.org/data/Oligodendrocytes-insertions_bin100_RIPnorm.bw',
                        type: 'bigwig',
                        column: 'position',
                        value: 'peak'
                    },
                    title: 'Oligodendrocytes',
                    mark: 'bar',
                    color: { value: '#9B46E5' }
                },
                {
                    data: {
                        url: 'https://s3.amazonaws.com/gosling-lang.org/data/Astrocytes-insertions_bin100_RIPnorm.bw',
                        type: 'bigwig',
                        column: 'position',
                        value: 'peak'
                    },
                    title: 'Astrocytes',
                    mark: 'bar',
                    color: { value: '#D73636' }
                },
                {
                    data: {
                        url: 'https://s3.amazonaws.com/gosling-lang.org/data/OPCs-insertions_bin100_RIPnorm.bw',
                        type: 'bigwig',
                        column: 'position',
                        value: 'peak'
                    },
                    title: 'OPCs',
                    mark: 'bar',
                    color: { value: '#E38ADC' }
                },
                {
                    alignment: 'overlay',
                    title: 'Genes',
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=gene-annotation',
                        type: 'beddb',
                        genomicFields: [
                            { index: 1, name: 'start' },
                            { index: 2, name: 'end' }
                        ],
                        valueFields: [
                            { index: 5, name: 'strand', type: 'nominal' },
                            { index: 3, name: 'name', type: 'nominal' }
                        ],
                        exonIntervalFields: [
                            { index: 12, name: 'start' },
                            { index: 13, name: 'end' }
                        ]
                    },
                    style: { outline: '#20102F' },
                    tracks: [
                        {
                            dataTransform: [
                                { type: 'filter', field: 'type', oneOf: ['gene'] },
                                { type: 'filter', field: 'strand', oneOf: ['+'] }
                            ],
                            mark: 'text',
                            text: { field: 'name', type: 'nominal' },
                            x: { field: 'start', type: 'genomic' },
                            size: { value: 8 },
                            xe: { field: 'end', type: 'genomic' },
                            style: { textFontSize: 8, dy: -12 }
                        },
                        {
                            dataTransform: [
                                { type: 'filter', field: 'type', oneOf: ['gene'] },
                                { type: 'filter', field: 'strand', oneOf: ['-'] }
                            ],
                            mark: 'text',
                            text: { field: 'name', type: 'nominal' },
                            x: { field: 'start', type: 'genomic' },
                            xe: { field: 'end', type: 'genomic' },
                            size: { value: 8 },
                            style: { textFontSize: 8, dy: 10 }
                        },
                        {
                            dataTransform: [
                                { type: 'filter', field: 'type', oneOf: ['gene'] },
                                { type: 'filter', field: 'strand', oneOf: ['+'] }
                            ],
                            mark: 'rect',
                            x: { field: 'end', type: 'genomic' },
                            size: { value: 7 }
                        },
                        {
                            dataTransform: [
                                { type: 'filter', field: 'type', oneOf: ['gene'] },
                                { type: 'filter', field: 'strand', oneOf: ['-'] }
                            ],
                            mark: 'rect',
                            x: { field: 'start', type: 'genomic' },
                            size: { value: 7 }
                        },
                        {
                            dataTransform: [{ type: 'filter', field: 'type', oneOf: ['exon'] }],
                            mark: 'rect',
                            x: { field: 'start', type: 'genomic' },
                            xe: { field: 'end', type: 'genomic' },
                            size: { value: 14 }
                        },
                        {
                            dataTransform: [{ type: 'filter', field: 'type', oneOf: ['gene'] }],
                            mark: 'rule',
                            x: { field: 'start', type: 'genomic' },
                            xe: { field: 'end', type: 'genomic' },
                            strokeWidth: { value: 3 }
                        }
                    ],
                    row: { field: 'strand', type: 'nominal', domain: ['+', '-'] },
                    color: {
                        field: 'strand',
                        type: 'nominal',
                        domain: ['+', '-'],
                        range: ['#012DB8', '#BE1E2C']
                    },
                    visibility: [
                        {
                            operation: 'less-than',
                            measure: 'width',
                            threshold: '|xe-x|',
                            transitionPadding: 10,
                            target: 'mark'
                        }
                    ],
                    width: 400,
                    height: 80
                },
                {
                    title: 'PLAC-seq (H3K4me3) Nott et al.',
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=oligodendrocyte-plac-seq-bedpe',
                        type: 'beddb',
                        genomicFields: [
                            { name: 'start', index: 1 },
                            { name: 'end', index: 2 }
                        ]
                    },
                    mark: 'withinLink',
                    x: { field: 'start', type: 'genomic' },
                    xe: { field: 'end', type: 'genomic' },
                    y: { flip: true },
                    strokeWidth: { value: 1 },
                    color: { value: 'none' },
                    stroke: { value: '#F97E2A' },
                    opacity: { value: 0.1 },
                    overlayOnPreviousTrack: false,
                    width: 400,
                    height: 60
                },
                {
                    title: '',
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=microglia-plac-seq-bedpe',
                        type: 'beddb',
                        genomicFields: [
                            { name: 'start', index: 1 },
                            { name: 'end', index: 2 }
                        ]
                    },
                    mark: 'withinLink',
                    x: { field: 'start', type: 'genomic' },
                    xe: { field: 'end', type: 'genomic' },
                    y: { flip: true },
                    strokeWidth: { value: 1 },
                    color: { value: 'none' },
                    stroke: { value: '#50ADF9' },
                    opacity: { value: 0.1 },
                    overlayOnPreviousTrack: true,
                    width: 400,
                    height: 60
                },
                {
                    title: '',
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=neuron-plac-seq-bedpe',
                        type: 'beddb',
                        genomicFields: [
                            { name: 'start', index: 1 },
                            { name: 'end', index: 2 }
                        ]
                    },
                    mark: 'withinLink',
                    x: { field: 'start', type: 'genomic' },
                    xe: { field: 'end', type: 'genomic' },
                    y: { flip: true },
                    strokeWidth: { value: 1 },
                    color: { value: 'none' },
                    stroke: { value: '#7B0EDC' },
                    opacity: { value: 0.1 },
                    overlayOnPreviousTrack: true,
                    width: 400,
                    height: 60
                }
            ]
        }
    ]
};

const linkingTest = {
    title: 'Basic Marks: line',
    subtitle: 'Tutorial Examples',
    views: [
        {
            tracks: [
                {
                    layout: 'linear',
                    width: 800,
                    height: 100,
                    data: {
                        url: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1']
                    },
                    mark: 'line',
                    x: { field: 'position', type: 'genomic', axis: 'bottom', linkingId: 'test' },
                    y: { field: 'peak', type: 'quantitative', axis: 'right' },
                    size: { value: 2 }
                }
            ]
        },
        {
            linkingId: 'test',
            tracks: [
                {
                    layout: 'linear',
                    width: 800,
                    height: 100,
                    data: {
                        url: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1']
                    },
                    mark: 'line',
                    x: { field: 'position', type: 'genomic', axis: 'bottom' },
                    y: { field: 'peak', type: 'quantitative', axis: 'right' },
                    size: { value: 2 }
                }
            ]
        },
        {
            tracks: [
                {
                    layout: 'linear',
                    width: 800,
                    height: 100,
                    data: {
                        url: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1']
                    },
                    mark: 'line',
                    x: { field: 'position', type: 'genomic', axis: 'bottom' },
                    y: { field: 'peak', type: 'quantitative', axis: 'right' },
                    size: { value: 2 }
                },
                {
                    layout: 'linear',
                    width: 800,
                    height: 100,
                    data: {
                        url: 'https://resgen.io/api/v1/tileset_info/?d=UvVPeLHuRDiYA3qwFlm7xQ',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1']
                    },
                    mark: 'line',
                    x: { field: 'position', type: 'genomic', axis: 'bottom', linkingId: 'test' },
                    y: { field: 'peak', type: 'quantitative', axis: 'right' },
                    size: { value: 2 }
                }
            ]
        }
    ]
};

const doubleBrush = {
    arrangement: 'vertical',
    views: [
        {
            static: true,
            layout: 'circular',
            alignment: 'stack',
            tracks: [
                {
                    id: 'overview track',
                    alignment: 'overlay',
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1', 'sample 2', 'sample 3', 'sample 4'],
                        binSize: 4
                    },
                    x: { field: 'start', type: 'genomic' },
                    xe: { field: 'end', type: 'genomic' },
                    y: { field: 'peak', type: 'quantitative' },
                    row: { field: 'sample', type: 'nominal' },
                    color: { field: 'sample', type: 'nominal' },
                    stroke: { value: 'black' },
                    strokeWidth: { value: 0.3 },
                    tracks: [
                        { mark: 'bar' },
                        {
                            mark: 'brush',
                            x: { linkingId: 'detail-1' },
                            color: { value: 'blue' }
                        },
                        {
                            mark: 'brush',
                            x: { linkingId: 'detail-2' },
                            color: { value: 'red' }
                        }
                    ],
                    style: { outlineWidth: 0 },
                    width: 500,
                    height: 100
                },
                {
                    data: {
                        type: 'csv',
                        url: 'https://raw.githubusercontent.com/sehilyi/gemini-datasets/master/data/rearrangements.bulk.1639.simple.filtered.pub',
                        headerNames: [
                            'chr1',
                            'p1s',
                            'p1e',
                            'chr2',
                            'p2s',
                            'p2e',
                            'type',
                            'id',
                            'f1',
                            'f2',
                            'f3',
                            'f4',
                            'f5',
                            'f6'
                        ],
                        separator: '\t',
                        genomicFieldsToConvert: [
                            { chromosomeField: 'chr1', genomicFields: ['p1s', 'p1e'] },
                            { chromosomeField: 'chr2', genomicFields: ['p2s', 'p2e'] }
                        ]
                    },
                    dataTransform: [
                        {
                            type: 'filter',
                            field: 'chr1',
                            oneOf: ['1', '16', '14', '9', '6', '5', '3']
                        },
                        {
                            type: 'filter',
                            field: 'chr2',
                            oneOf: ['1', '16', '14', '9', '6', '5', '3']
                        }
                    ],
                    mark: 'withinLink',
                    x: { field: 'p1s', type: 'genomic' },
                    xe: { field: 'p1e', type: 'genomic' },
                    x1: { field: 'p2s', type: 'genomic' },
                    x1e: { field: 'p2e', type: 'genomic' },
                    stroke: {
                        field: 'type',
                        type: 'nominal',
                        domain: ['deletion', 'inversion', 'translocation', 'tandem-duplication']
                    },
                    strokeWidth: { value: 0.8 },
                    opacity: { value: 0.15 },
                    width: 500,
                    height: 100
                }
            ]
        },
        {
            spacing: 10,
            arrangement: 'horizontal',
            views: [
                {
                    tracks: [
                        {
                            id: 'detail-1',
                            data: {
                                url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec',
                                type: 'multivec',
                                row: 'sample',
                                column: 'position',
                                value: 'peak',
                                categories: ['sample 1', 'sample 2', 'sample 3', 'sample 4'],
                                binSize: 4
                            },
                            mark: 'bar',
                            x: {
                                field: 'start',
                                type: 'genomic',
                                linkingId: 'detail-1',
                                domain: { chromosome: 'chr5' }
                            },
                            xe: { field: 'end', type: 'genomic' },
                            y: { field: 'peak', type: 'quantitative' },
                            row: { field: 'sample', type: 'nominal' },
                            color: { field: 'sample', type: 'nominal' },
                            stroke: { value: 'black' },
                            strokeWidth: { value: 0.3 },
                            style: { background: 'blue' },
                            width: 245,
                            height: 150
                        }
                    ]
                },
                {
                    tracks: [
                        {
                            id: 'detail-2',
                            data: {
                                url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec',
                                type: 'multivec',
                                row: 'sample',
                                column: 'position',
                                value: 'peak',
                                categories: ['sample 1', 'sample 2', 'sample 3', 'sample 4'],
                                binSize: 4
                            },
                            mark: 'bar',
                            x: {
                                field: 'start',
                                type: 'genomic',
                                domain: { chromosome: 'chr16' },
                                linkingId: 'detail-2'
                            },
                            xe: { field: 'end', type: 'genomic' },
                            y: { field: 'peak', type: 'quantitative' },
                            row: { field: 'sample', type: 'nominal' },
                            color: { field: 'sample', type: 'nominal', legend: true },
                            stroke: { value: 'black' },
                            strokeWidth: { value: 0.3 },
                            style: { background: 'red' },
                            width: 245,
                            height: 150
                        }
                    ]
                }
            ],
            style: { backgroundOpacity: 0.1 }
        }
    ]
};

const visualLinking = {
    title: 'Visual Linking',
    subtitle: 'Change the position and range of brushes to update the detail view on the bottom',
    arrangement: 'vertical',
    centerRadius: 0.4,
    views: [
        {
            spacing: 40,
            arrangement: 'horizontal',
            views: [
                {
                    spacing: 5,
                    static: true,
                    layout: 'circular',
                    xDomain: { chromosome: 'chr1' },
                    alignment: 'overlay',
                    tracks: [{ mark: 'bar' }, { mark: 'brush', x: { linkingId: 'detail' } }],
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1', 'sample 2', 'sample 3', 'sample 4']
                    },
                    x: { field: 'start', type: 'genomic' },
                    xe: { field: 'end', type: 'genomic' },
                    y: { field: 'peak', type: 'quantitative' },
                    row: { field: 'sample', type: 'nominal' },
                    color: { field: 'sample', type: 'nominal' },
                    width: 250,
                    height: 130
                },
                {
                    layout: 'linear',
                    xDomain: { chromosome: 'chr1' },
                    alignment: 'overlay',
                    tracks: [{ mark: 'bar' }, { mark: 'brush', x: { linkingId: 'detail' } }],
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1', 'sample 2', 'sample 3', 'sample 4']
                    },
                    x: { field: 'start', type: 'genomic' },
                    xe: { field: 'end', type: 'genomic' },
                    y: { field: 'peak', type: 'quantitative' },
                    row: { field: 'sample', type: 'nominal' },
                    color: { field: 'sample', type: 'nominal' },
                    width: 400,
                    height: 200
                }
            ]
        },
        {
            layout: 'linear',
            xDomain: { chromosome: 'chr1', interval: [160000000, 200000000] },
            linkingId: 'detail',
            tracks: [
                {
                    data: {
                        url: 'https://server.gosling-lang.org/api/v1/tileset_info/?d=cistrome-multivec',
                        type: 'multivec',
                        row: 'sample',
                        column: 'position',
                        value: 'peak',
                        categories: ['sample 1', 'sample 2', 'sample 3', 'sample 4']
                    },
                    mark: 'bar',
                    x: { field: 'position', type: 'genomic', axis: 'top' },
                    y: { field: 'peak', type: 'quantitative' },
                    row: { field: 'sample', type: 'nominal' },
                    color: { field: 'sample', type: 'nominal' },
                    width: 690,
                    height: 200
                }
            ]
        }
    ]
};
