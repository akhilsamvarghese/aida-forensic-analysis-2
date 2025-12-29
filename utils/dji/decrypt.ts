import AES from 'aes-js';
import { keys } from './config';
import { AesCmac } from 'aes-cmac';

const decrypt = async (data: Uint8Array, productCode: string, randomBytes: Uint8Array): Promise<Uint8Array> => {
    // find the key for the product code
    const found = keys[productCode];
    // if there is no key for the product code, throw an error
    if (!found) throw new Error("No key found for product code: " + productCode);

    // calculate the CMAC
    const aesCmac = new AesCmac(new Uint8Array(found.key));
    const msg = new Uint8Array([1, 76, 79, 71, 0, ...Array.from(randomBytes), 128]); // \1LOG\0 + randomBytes + \128

    const cmac = await aesCmac.calculate(msg);

    // create a new AES object with the key
    const aes = new AES.ModeOfOperation.cbc(cmac, found.iv);

    // decrypt the data
    const decrypted = aes.decrypt(data);

    // return the decrypted data
    return decrypted;
}

export default decrypt;
