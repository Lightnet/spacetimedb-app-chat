// import { t } from "spacetimedb/server";
// import { validateMessage } from "../helper";
import spacetimedb from "../module";
// import * as ECDSA from "@nfen/webcrypto-ts/lib/ec/ecdsa";
// import { 
//   MD5, 
//   // SHA256, 
//   // SHA512, 
//   AES, // fail
//   DES, // fail
//   // TripleDES,
//   PBKDF2, // pass
//   Base64, // pass
//   Hex, // pass
//   Utf8, // pass
//   HmacMD5, // pass
//   SHA1Algo, // pass
//   TripleDES, //fail decrypt
//   Rabbit, // fail
//   RC4, // fail
//   Blowfish,
//   CBC,
//   Pkcs7,

// } from 'crypto-es';

// Helper: Generate random bytes using SpaceTimeDB's deterministic RNG
function getRandomBytes(ctx: any, length: number): Uint8Array {
  const bytes = new Uint8Array(length);

  // ctx.random() returns a random number (likely float 0-1 or integer depending on version)
  // We use it to fill bytes safely
  for (let i = 0; i < length; i++) {
    // One common pattern: use ctx.random() * 256 and floor
    bytes[i] = Math.floor(ctx.random() * 256);
  }

  return bytes;
}


import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { bytesToUtf8 } from "@noble/ciphers/utils.js";
import { randomBytes } from '@noble/hashes/utils.js';
import { utf8ToBytes } from '@noble/hashes/utils.js'; // or use TextEncoder/Decoder

// // Shared secret key (32 bytes) — derive this properly in real apps (e.g. via X25519 + HKDF)
// const sharedKey = randomBytes(32);   // ← Replace with real key derivation in production!

// export function encryptChatMessage(message: string): Uint8Array {
//   const nonce = randomBytes(24);                    // Safe random nonce for XChaCha20
//   const cipher = xchacha20poly1305(sharedKey, nonce);

//   const plaintext = utf8ToBytes(message);           // or new TextEncoder().encode(message)
//   const ciphertext = cipher.encrypt(plaintext);

//   // Prepend nonce to ciphertext (common & safe pattern)
//   const combined = new Uint8Array(nonce.length + ciphertext.length);
//   combined.set(nonce, 0);
//   combined.set(ciphertext, nonce.length);

//   return combined;   // Send this over the wire (or base64 encode it)
// }

// // === DECODE (Decrypt received message) ===
// export function decryptChatMessage(combined: Uint8Array): string {
//   if (combined.length < 24) {
//     throw new Error("Invalid encrypted message");
//   }

//   const nonce = combined.slice(0, 24);
//   const ciphertext = combined.slice(24);

//   const cipher = xchacha20poly1305(sharedKey, nonce);
//   const decrypted = cipher.decrypt(ciphertext);

//   return bytesToUtf8(decrypted);   // or new TextDecoder().decode(decrypted)
// }
//-----------------------------------------------
// 
//-----------------------------------------------
export const group_test = spacetimedb.reducer(
  {  },
  (ctx, {  }) => {
    console.log("test");
    // globalThis.crypto.getRandomValues = ctx.random();
    // const sharedKey = randomBytes(32);
    // console.log(sharedKey)
    // console.info(`ctx.sender: ${ctx.sender}  Group Chat Id: ${id}`);
    // const config = ctx.db.groupChatConfig.identity.find(ctx.sender);
    // if(config){
    //   config.groupChatId = id;
    //   ctx.db.groupChatConfig.identity.update(config);
    // }else{
    //   ctx.db.groupChatConfig.insert({
    //     status: undefined,
    //     identity: ctx.sender,
    //     createdAt: ctx.timestamp,
    //     groupChatId: id
    //   })
    // }

    // ctx.random()
    ctx.newUuidV4()
    ctx.newUuidV7()
    ctx.timestamp
  }
);
//-----------------------------------------------
// 
//-----------------------------------------------
export const test_c = spacetimedb.reducer(
  {  },
  async (ctx, {  }) => {
    // const keyPair = await ECDSA.generateKeyPair();
    // console.log(keyPair);
    // console.log("test keys");
    // const hash1 = MD5('Hello World').toString();
    // console.log("hash1: ",hash1);
    // fail
    // const encrypted = await AES.encrypt('Secret Message', 'secret key').toString();
    // console.log("encrypted:", encrypted)
    // const decrypted = AES.decrypt(encrypted, 'secret key').toString();
    // console.log("decrypted:", decrypted)
    // fail
    // const encrypted = DES.encrypt('Message', 'password').toString();
    // const decrypted = DES.decrypt(encrypted, 'password').toString(UTF8);

    // pass
    // const key = PBKDF2('password', 'salt');//works
    // console.log("key", key);

    // Base64 encoding
    // const base64 = Base64.stringify(Utf8.parse('Hello World'));
    // console.log("base64: ", base64)

    // const decoded = Utf8.stringify(Base64.parse(base64));
    // console.log("decoded: ", decoded)

    // Hex encoding
    // const hex = Hex.stringify(Utf8.parse('Hello World'));
    // console.log("hex: ", hex )

    // const hmac = HmacMD5('message', 'secret key').toString();
    // console.log("hmac: ",hmac)

    // const hasher = SHA1Algo.create();
    // hasher.update('message part 1');
    // hasher.update('message part 2');
    // const progressiveHash = hasher.finalize().toString();
    // console.log("progressiveHash: ", progressiveHash)

    // const encrypted = TripleDES.encrypt('Message', 'password').toString();
    // console.log(encrypted)

    // const key = PBKDF2('password', 'salt', { keySize: 192/32 });
    // console.log("key:", key)
    // const encrypted = TripleDES.encrypt('Message', key).toString();
    // console.log("encrypted:", encrypted);

    // const decrypted = TripleDES.decrypt(encrypted, 'password').toString(Utf8);
    // console.log("decrypted:", decrypted);

    // const encrypted = Rabbit.encrypt('Message', 'password').toString();
    // console.log("encrypted:", encrypted)
    // const decrypted = Rabbit.decrypt(encrypted, 'password').toString(Utf8);
    // console.log("decrypted:", decrypted)

    // const encrypted = RC4.encrypt('Message', 'password').toString();
    // console.log("encrypted:", encrypted)
    // const decrypted = RC4.decrypt(encrypted, 'password').toString(Utf8);
    // console.log("decrypted:", decrypted)

    // const encrypted = Blowfish.encrypt('Message', 'password').toString();
    // console.log("encrypted:", encrypted)
    // const decrypted = Blowfish.decrypt(encrypted, 'password').toString(Utf8);
    // console.log("decrypted:", decrypted)

    // const encrypted = AES.encrypt('message', 'password', {
    //   mode: CBC,
    //   padding: Pkcs7
    // }).toString();

    // console.log("encrypted: ", encrypted);




//     const msg = "Hello, this is a secret chat message! 🔥";

// const encrypted = encryptChatMessage(msg);
// console.log("Encrypted (bytes):", encrypted);

// // Simulate sending over network (e.g. as base64)
// const base64Encrypted = btoa(String.fromCharCode(...encrypted));

// // On receiver side:
// const received = new Uint8Array(atob(base64Encrypted).split('').map(c => c.charCodeAt(0)));
// const decrypted = decryptChatMessage(received);

// console.log("Decrypted:", decrypted); // → "Hello, this is a secret chat message! 🔥"
    console.log("asd")

    // globalThis.crypto.getRandomValues = ctx.random;
    // console.log(globalThis.crypto)
    // globalThis.crypto = {}
    // globalThis.crypto.getRandomValues = null;
    // globalThis.crypto.getRandomValues = ctx.random;
    // const sharedKey = randomBytes(32);
    const sharedKey = new Uint8Array(32);
    const nonce = getRandomBytes(ctx, 24);
    // console.log("sharedKey",sharedKey)
    // console.log("Math: ",Math.floor(1.2))
    console.log("nonce: ",nonce)

    const cipher = xchacha20poly1305(sharedKey, nonce);
    console.log(cipher)
    let message = "hello wsadorld";
    const plaintext = utf8ToBytes(message);
    const ciphertext = cipher.encrypt(plaintext);

     // Combined format: nonce (24 bytes) + ciphertext
    const combined = new Uint8Array(24 + ciphertext.length);
    combined.set(nonce, 0);
    combined.set(ciphertext, 24);

    // Example: store or broadcast the encrypted bytes
    // ctx.db.chatMessage.insert({ encrypted: combined, ... });
    console.info("Encrypted message ready to send/store");
    // combined;   // or insert into DB
    console.log(combined);

    const nonce1 = combined.slice(0, 24);
    const ciphertext1 = combined.slice(24);

    const cipher1 = xchacha20poly1305(sharedKey, nonce1);
    const decrypted = cipher1.decrypt(ciphertext1);
    console.log(bytesToUtf8(decrypted));


    console.log("END")
  })
//crypto.getRandomValues npm install @noble/ciphers @noble/hashes // nope

export const test_id = spacetimedb.reducer(
  {  },
  async (ctx, {  }) => {
    //
    let id:String = ctx.newUuidV7().toString();
    console.log("id: ", id);
  }
)