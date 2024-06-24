import { describe, it, expect } from 'vitest';
import { getLinkedEncodings } from './linkedEncoding';

describe('Link tracks', () => {
    it('one track, one view', () => {
        const spec = {
            tracks: [{ id: 'track-1', x: { field: 'a', type: 'genomic' }, y: { field: 'b', type: 'quantitative' } }]
        };
        const result = getLinkedEncodings(spec);
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": undefined,
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "track-1",
              ],
            },
          ]
        `);
    });

    it('two tracks, one view', () => {
        const spec = {
            tracks: [
                { id: 'track-1', x: { field: 'a', type: 'genomic' }, y: { field: 'b', type: 'quantitative' } },
                { id: 'track-2', x: { field: 'a', type: 'genomic' }, y: { field: 'b', type: 'quantitative' } }
            ]
        };
        const result = getLinkedEncodings(spec);
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": undefined,
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "track-1",
                "track-2",
              ],
            },
          ]
        `);
    });
    it('two view with one track each', () => {
        const spec = {
            views: [
                {
                    tracks: [
                        { id: 'track-1', x: { field: 'a', type: 'genomic' }, y: { field: 'b', type: 'quantitative' } }
                    ]
                },
                {
                    tracks: [
                        { id: 'track-2', x: { field: 'a', type: 'genomic' }, y: { field: 'b', type: 'quantitative' } }
                    ]
                }
            ]
        };
        const result = getLinkedEncodings(spec);
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": undefined,
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "track-1",
              ],
            },
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": undefined,
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "track-2",
              ],
            },
          ]
        `);
    });
    it('linkingId', () => {
        const linkingTest = {
            title: 'Basic Marks: line',
            subtitle: 'Tutorial Examples',
            views: [
                {
                    tracks: [
                        {
                            layout: 'linear',
                            id: 'track-1',
                            mark: 'line',
                            x: { field: 'position', type: 'genomic', axis: 'bottom', linkingId: 'test' },
                            y: { field: 'peak', type: 'quantitative', axis: 'right' }
                        }
                    ]
                },
                {
                    linkingId: 'test',
                    tracks: [
                        {
                            layout: 'linear',
                            id: 'track-2',
                            mark: 'line',
                            x: { field: 'position', type: 'genomic', axis: 'bottom' },
                            y: { field: 'peak', type: 'quantitative', axis: 'right' }
                        }
                    ]
                },
                {
                    tracks: [
                        {
                            layout: 'linear',
                            id: 'track-3',
                            mark: 'line',
                            x: { field: 'position', type: 'genomic', axis: 'bottom' },
                            y: { field: 'peak', type: 'quantitative', axis: 'right' }
                        },
                        {
                            layout: 'linear',
                            id: 'overlay-1',
                            mark: 'line',
                            x: { field: 'position', type: 'genomic', axis: 'bottom', linkingId: 'test' },
                            y: { field: 'peak', type: 'quantitative', axis: 'right' }
                        }
                    ]
                }
            ]
        };
        // Test case 1
        const result1 = getLinkedEncodings(linkingTest);
        expect(result1).toMatchInlineSnapshot(`
          [
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": "test",
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "track-2",
                "track-1",
                "overlay-1",
              ],
            },
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": undefined,
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "track-3",
              ],
            },
          ]
        `);
    });
});

describe('Link brushes', () => {
    it('single unlinked brush ', () => {
        const spec = {
            tracks: [
                {
                    mark: 'brush',
                    id: 'brush-1',
                    x: { field: 'a', type: 'genomic' },
                    y: { field: 'b', type: 'quantitative' }
                }
            ]
        };
        const result = getLinkedEncodings(spec);
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": undefined,
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "brush-1",
              ],
            },
          ]
        `);
    });
    it('single linked brush ', () => {
        const spec = {
            views: [
                {
                    tracks: [
                        {
                            id: 'track-1',
                            x: { field: 'a', type: 'genomic' },
                            y: {
                                field: 'b',
                                type: 'quantitative'
                            },
                            _overlay: [
                                {
                                    mark: 'brush',
                                    id: 'brush-1',
                                    x: { field: 'a', type: 'genomic', linkingId: 'link1' },
                                    y: { field: 'b', type: 'quantitative' }
                                }
                            ]
                        }
                    ]
                },
                {
                    linkingId: 'link1',
                    tracks: [
                        { id: 'track-2', x: { field: 'a', type: 'genomic' }, y: { field: 'b', type: 'quantitative' } }
                    ]
                }
            ]
        };
        const result = getLinkedEncodings(spec);
        expect(result).toMatchInlineSnapshot(`
          [
            {
              "brushIds": [],
              "encoding": "x",
              "linkingId": undefined,
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "brush-1",
                "track-1",
              ],
            },
            {
              "brushIds": [
                "brush-1",
              ],
              "encoding": "x",
              "linkingId": "link1",
              "signal": [
                0,
                3088269832,
              ],
              "trackIds": [
                "track-2",
              ],
            },
          ]
        `);
    });
});
