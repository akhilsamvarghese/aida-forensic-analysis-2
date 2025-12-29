// converts hex string to Uint8Array
export const fromHexString = (hexString: string): Uint8Array =>
    Uint8Array.from(hexString.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []);

// converts array to hex string
export const toHexString = (bytes: Uint8Array | number[]): string =>
    Array.from(bytes).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');

// converts array to ascii string
export const toAscii = (bytes: Uint8Array | number[], cleanString: boolean = false): string => {
    const ascii = new TextDecoder().decode(new Uint8Array(bytes));
    return cleanString ? ascii.replace(/\0/g, '').trim() : ascii;
}

// returns the start and end offsets for a given offset + an offset, used to slice arrays i.e x.slice(...getOffsets(offsets.header, 0x00))
export const getOffsets = (offsets: number[], offset: number = 0x00): [number, number] => [
    offset + offsets[0],
    offset + offsets[0] + offsets[1]
];

export const toIntLE = (data: Uint8Array | number[]): number =>
    Array.from(data).reduce((acc, byte, i) => acc + (byte << (i * 8)), 0);
