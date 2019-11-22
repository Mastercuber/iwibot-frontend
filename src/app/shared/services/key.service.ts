import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class CryptoModule {

    private secret_key = {}; // the AES secret key object
    session_identifier = ''; // session identifier associated with the secret key
    private encoder = new TextEncoder(); // always utf-8

    constructor() { // call this function after the page has loaded
        const key_service_api = ConfigService.getApiEndpoint('KEY_SERVICE_URL');
        if (!('TextEncoder' in window)) {
          alert('Sorry, this browser does not support TextEncoder...');
        }
        // $.get("./secret.aes", cryptoMod.initCryptoKey); // use key from local sever instead of openwhisk action
        $.get(
            key_service_api,
            (msg) => this.initCryptoKey(msg.payload.crypto_key, msg.payload.sid)
        );
        // $("#encrypt").on("click", () => demoPageMod.sendCryptoMsg());
    }

    static buf2hex(buffer) { // buffer is an ArrayBuffer
        return Array.prototype.map.call(
            new Uint8Array(buffer),
                x => ('00' + x.toString(16)).slice(-2)
         ).join('');
    }

    private hex2buf(hex) { // hex is a hex string
        const view = new Uint8Array(hex.length / 2);
        for (let i = 0; i < hex.length; i += 2) {
            view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return view.buffer;
    }

    private importSecretAesKey(keyData, session_id) {
        this.session_identifier = session_id;
        return window.crypto.subtle.importKey(
            'raw', // can be "jwk" or "raw"
            keyData, // "raw" would be an ArrayBuffer
            'AES-CBC',
            false, // whether the key is extractable (i.e. can be used in exportKey)
            ['encrypt', 'decrypt'] // can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
        );
    }

    private encryptPlaintextWithAes(data, aesKey) {
        const ivec = window.crypto.getRandomValues(new Uint8Array(16));
        return window.crypto.subtle.encrypt({
            name: 'AES-CBC',
            // Don't re-use initialization vectors!
            // Always generate a new iv every time your encrypt!
            iv: ivec,
        },
            aesKey, // from generateKey or importKey above
            data // ArrayBuffer of data you want to encrypt
        )
        .then(encrypted => {
            return {
                'iv': CryptoModule.buf2hex(ivec),
                'encrypted': CryptoModule.buf2hex(new Uint8Array(encrypted)),
                'sid': this.session_identifier
            };
        });
    }

    public initCryptoKey(keyData, session_id) {
        this.importSecretAesKey(this.hex2buf(keyData), session_id)
            .then(key => this.secret_key = key);
    }

    public createEncryptedJsonMessage(plaintext) {
        const data = this.encoder.encode(plaintext);
        return this.encryptPlaintextWithAes(data, this.secret_key)
            .then(msg => Promise.resolve(JSON.stringify(msg)));
    }
}
