import CryptoEs from 'crypto-es';

const EncryptDecryptService = {

    ivrs: CryptoEs.enc.Utf8.parse(Math.random().toString(36).substring(8)),

    e(value: string, secretKey: string): string {
        const encrypted = CryptoEs.AES.encrypt(
            CryptoEs.enc.Utf8.parse(JSON.stringify(value)),
            secretKey,
            {
                iv: this.ivrs,
                mode: CryptoEs.mode.CBC,
                padding: CryptoEs.pad.Pkcs7
            }
        );
        return encrypted.toString();
    },

    dj(value: string, secretKey: string): string[] {
        const decrypted = CryptoEs.AES.decrypt(
            value,
            secretKey,
            {
                iv: this.ivrs,
                mode: CryptoEs.mode.CBC,
                padding: CryptoEs.pad.Pkcs7
            }
        );
        return JSON.parse(decrypted.toString(CryptoEs.enc.Utf8));
    },

    ds(value: string, secretKey: string): string {
        const decrypted = CryptoEs.AES.decrypt(
            value,
            secretKey,
            {
                iv: this.ivrs,
                mode: CryptoEs.mode.CBC,
                padding: CryptoEs.pad.Pkcs7
            }
        );
        return decrypted.toString(CryptoEs.enc.Utf8);
    }

}


export default EncryptDecryptService;