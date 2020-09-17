import { GeminiTrackModel } from '../../core/gemini-track-model';
import { IsChannelDeep } from '../../core/gemini.schema';

export function drawGrid(HGC: any, trackInfo: any, tile: any, tm: GeminiTrackModel) {
    /* track spec */
    const spec = tm.spec();
    if (!IsChannelDeep(spec.y) || !spec.y.grid) {
        // we do not need to draw grid
        return;
    }

    /* helper */
    const { colorToHex } = HGC.utils;

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
    const rowCategories: string[] = (tm.getChannelDomainArray('row') as string[]) ?? ['___SINGLE_ROW___'];
    const rowHeight = trackHeight / rowCategories.length;

    /* y categories */
    const yCategories: string[] = (tm.getChannelDomainArray('y') as string[]) ?? ['___SINGLE_Y___'];

    /* baseline */
    const baseline = IsChannelDeep(spec.y) ? spec.y.baseline : undefined;

    /* information for rescaling tiles */
    tile.rowScale = tm.getChannelScale('row');
    tile.spriteInfos = []; // sprites for individual rows or columns

    /* render */
    const x = xScale(tileX);
    const x1 = xScale(tileX + tileWidth);

    rowCategories.forEach(rowCategory => {
        // we are separately drawing each row so that y scale can be more effectively shared across tiles without rerendering from the bottom
        const rowGraphics = tile.graphics; // new HGC.libraries.PIXI.Graphics();
        const rowPosition = tm.encodedValue('row', rowCategory);

        yCategories.forEach(yCategory => {
            const y = tm.encodedValue('y', yCategory);

            rowGraphics.lineStyle(
                1,
                colorToHex(baseline === yCategory ? 'black' : 'lightgray'),
                1, // alpha
                1 // alignment of the line to draw, (0 = inner, 0.5 = middle, 1 = outter)
            );

            rowGraphics.moveTo(x, rowPosition + rowHeight - y);
            rowGraphics.lineTo(x1, rowPosition + rowHeight - y);
        });
    });
}