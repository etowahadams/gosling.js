import { Track, IsChannelDeep, FieldType, ChannelTypes } from '../../lib/gemini.schema';
import * as d3 from 'd3';
import { group } from 'd3-array';

const QChannels = ['color', 'y', 'size']; // channels that can be mapped to a quantitative field type
interface QChannelExtent {
    [k: string]: Extent;
}

interface Extent {
    min: number | undefined;
    max: number | undefined;
}

// TODO: support vertical tracks
export function findQValueExtent(track: Track, data: { [k: string]: string | number }[]) {
    const extent: QChannelExtent = {
        color: { min: 0, max: 0 },
        y: { min: 0, max: 0 },
        size: { min: 0, max: 0 }
    };

    // TODO: put this in a separate function
    let xField: string | undefined;
    // let yField: string | undefined;
    let colorField: string | undefined;
    let colorFieldType: FieldType | undefined;
    let rowField: string | undefined;
    if (IsChannelDeep(track.color)) {
        colorField = track.color.field;
    }
    if (IsChannelDeep(track.color)) {
        colorFieldType = track.color.type;
    }
    if (IsChannelDeep(track.x)) {
        xField = track.x.field;
    }
    // if (IsChannelDeep(track.y)) {
    //     yField = track.y.field;
    // }
    if (IsChannelDeep(track.row)) {
        rowField = track.row.field;
    }

    const stackedMark = track.mark === 'bar' || track.mark === 'area';
    colorField && colorField !== xField && colorFieldType === 'nominal' && !rowField;
    ///

    if (stackedMark) {
        const pivotedData = group(data, d => d[xField as string]);
        const xKeys = [...pivotedData.keys()];

        QChannels.forEach(channelType => {
            const channel = track[channelType as keyof typeof ChannelTypes];
            if (IsChannelDeep(channel) && channel.type === 'quantitative') {
                extent[channelType].min = 0; // TODO: we can support none-zero baseline
                extent[channelType].max = d3.max(
                    xKeys.map(d => d3.sum((pivotedData.get(d) as any).map((_d: any) => _d[channel.field]))) as number[]
                );
            }
        });
    } else {
        QChannels.forEach(channelType => {
            const channel = track[channelType as keyof typeof ChannelTypes];
            if (IsChannelDeep(channel) && channel.type === 'quantitative') {
                extent[channelType].min = 0; // TODO: we can support none-zero base line
                extent[channelType].max = d3.max(data.map(d => d[channel.field] as number));
            }
        });
    }
    return extent;
}
