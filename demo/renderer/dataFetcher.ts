import { DataFetcher } from '@higlass/datafetcher';
import { fakePubSub } from '@higlass/utils';
import {
    BigWigDataFetcher,
    CsvDataFetcher,
    GffDataFetcher,
    JsonDataFetcher,
    BamDataFetcher,
    BedDataFetcher,
    VcfDataFetcher
} from '@data-fetchers';
import type { ProcessedTrack } from 'demo/track-def/types';

export function getDataFetcher(spec: ProcessedTrack) {
    if (!('data' in spec)) {
        console.warn('No data in the track spec', spec);
    }
    if (spec.data.type == 'multivec' || spec.data.type == 'beddb' || spec.data.type == 'matrix') {
        const url = spec.data.url;
        const server = url.split('/').slice(0, -2).join('/');
        const tilesetUid = url.split('=').slice(-1)[0];
        return new DataFetcher({ server, tilesetUid }, fakePubSub);
    }
    if (spec.data.type == 'bigwig') {
        return new BigWigDataFetcher({ ...spec.data, assembly: spec.assembly });
    }
    if (spec.data.type == 'csv') {
        const fields = getFields(spec);
        return new CsvDataFetcher({ ...spec.data, ...fields, assembly: spec.assembly });
    }
    if (spec.data.type == 'json') {
        const fields = getFields(spec);
        return new JsonDataFetcher({ ...spec.data, ...fields, assembly: spec.assembly });
    }
    if (spec.data.type == 'gff') {
        return new GffDataFetcher({ ...spec.data, assembly: spec.assembly });
    }
    if (spec.data.type == 'bam') {
        return new BamDataFetcher({ ...spec.data, assembly: spec.assembly });
    }
    if (spec.data.type == 'bed') {
        return new BedDataFetcher({ ...spec.data, assembly: spec.assembly });
    }
    if (spec.data.type == 'vcf') {
        return new VcfDataFetcher({ ...spec.data, assembly: spec.assembly });
    }
}

/**
 * Some datafetchers need to know which encoding corresponds to which field
 */
function getFields(spec: Track) {
    const fields: { x?: string; xe?: string; y?: string; ye?: string } = {};
    if ('x' in spec && spec.x && 'field' in spec.x) {
        fields.x = spec.x.field;
    }
    if ('xe' in spec && spec.xe && 'field' in spec.xe) {
        fields.xe = spec.xe.field;
    }
    if ('y' in spec && spec.y && 'field' in spec.y) {
        fields.y = spec.y.field;
    }
    if ('ye' in spec && spec.ye && 'field' in spec.ye) {
        fields.ye = spec.ye.field;
    }
    return fields;
}
