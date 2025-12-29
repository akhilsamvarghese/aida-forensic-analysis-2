import { offsets } from './config';
import { toAscii, getOffsets, toIntLE } from './helpers';

const headerLength = 0x11B;

class DatItem {
    isParsed: boolean;
    data: Uint8Array;
    product: string;
    filePath: string;

    constructor() {
        this.isParsed = false;
        this.data = new Uint8Array();
        this.product = "";
        this.filePath = "";
    }

    parse(datain: Uint8Array, offset: number = 0): number { // returns the number of bytes parsed, -1 if error
        if (this.isParsed) return -1;
        // check the first byte is 0xA4, our magic number
        // Correcting potential bug: check at offset, not 0, unless checking file header
        if (datain[offset] !== 0xA4) return -1;

        // extract 
        this.product = toAscii(datain.slice(...getOffsets(offsets.DAT.product, offset)), true);
        this.filePath = toAscii(datain.slice(...getOffsets(offsets.DAT.filePath, offset)), true);

        const dataLength = toIntLE(datain.slice(...getOffsets(offsets.DAT.dataLength, offset)));

        this.data = datain.slice(offset + headerLength, offset + headerLength + dataLength);

        this.isParsed = true;

        return dataLength + headerLength;
    }
}

export default DatItem;
