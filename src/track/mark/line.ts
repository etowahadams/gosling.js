import { GeminiTrackModel } from '../../lib/gemini-track-model';
import { IsChannelDeep, getValueUsingChannel, Channel } from '../../lib/gemini.schema';
// import { RESOLUTION } from '.';

export function drawLine(HGC: any, trackInfo: any, tile: any, gm: GeminiTrackModel) {
    /* track spec */
    const spec = gm.spec();

    /* helper */
    const { colorToHex } = HGC.utils;

    /* data */
    const data = tile.tabularData as { [k: string]: number | string }[];

    /* track size */
    const trackHeight = trackInfo.dimensions[1];
    const tileSize = trackInfo.tilesetInfo.tile_size;
    const { tileX, tileWidth } = trackInfo.getTilePosAndDimensions(
        tile.tileData.zoomLevel,
        tile.tileData.tilePos,
        tileSize
    );

    /* genomic scale */
    const xScale = trackInfo._xScale;

    /* row separation */
    const rowCategories =
        IsChannelDeep(spec.row) && spec.row.field
            ? Array.from(new Set(data.map(d => getValueUsingChannel(d, spec.row as Channel) as string)))
            : ['___SINGLE_ROW___']; // if `row` is undefined, use only one row internally

    const rowHeight = trackHeight / rowCategories.length;

    /* color separation */
    const colorCategories =
        IsChannelDeep(spec.color) && spec.color.field
            ? Array.from(new Set(data.map(d => getValueUsingChannel(d, spec.color as Channel) as string)))
            : ['___SINGLE_COLOR___']; // if `color` is undefined, use only one row internally

    /* information for rescaling tiles */
    tile.rowScale = gm.getChannelScale('row');
    tile.spriteInfos = []; // sprites for individual rows or columns

    /* render */
    rowCategories.forEach(rowCategory => {
        // we are separately drawing each row so that y scale can be more effectively shared across tiles without rerendering from the bottom
        const rowGraphics = tile.graphics; // new HGC.libraries.PIXI.Graphics();
        const rowPosition = gm.encodedValue('row', rowCategory);

        // line marks are drawn for each color
        colorCategories.forEach(colorCategory => {
            const color = gm.encodedValue('color', colorCategory);
            rowGraphics.lineStyle(
                gm.encodedValue('size'),
                colorToHex(color),
                gm.encodedValue('opacity'), // alpha
                1 // alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outter)
            );

            data.filter(
                d =>
                    (!getValueUsingChannel(d, spec.row as Channel) ||
                        (getValueUsingChannel(d, spec.row as Channel) as string) === rowCategory) &&
                    (!getValueUsingChannel(d, spec.color as Channel) ||
                        (getValueUsingChannel(d, spec.color as Channel) as string) === colorCategory)
            )
                .sort(
                    (d1, d2) =>
                        // draw from the left to right
                        (getValueUsingChannel(d1, spec.x as Channel) as number) -
                        (getValueUsingChannel(d2, spec.x as Channel) as number)
                )
                .forEach((d, i) => {
                    const xValue = getValueUsingChannel(d, spec.x as Channel) as number;
                    const yValue = getValueUsingChannel(d, spec.y as Channel) as string | number;

                    const x = xScale(tileX + xValue * (tileWidth / tileSize));
                    const y = gm.encodedValue('y', yValue);

                    if (i === 0) {
                        rowGraphics.moveTo(x, rowPosition + rowHeight - y);
                    } else {
                        rowGraphics.lineTo(x, rowPosition + rowHeight - y);
                    }

                    // svg
                    trackInfo.addSVGInfo(tile, x, rowPosition + rowHeight - y, color);
                });
        });

        // add graphics of this row
        // const texture = HGC.services.pixiRenderer.generateTexture(
        //     rowGraphics,
        //     HGC.libraries.PIXI.SCALE_MODES.NEAREST,
        //     RESOLUTION
        // );
        // const sprite = new HGC.libraries.PIXI.Sprite(texture);

        // sprite.width = xScale(tileX + tileWidth) - xScale(tileX);
        // sprite.x = xScale(tileX);
        // sprite.y = rowPosition;
        // sprite.height = rowHeight;

        // tile.spriteInfos.push({ sprite: sprite, scaleKey: rowCategory });
        // tile.graphics.addChild(sprite);
    });
}
