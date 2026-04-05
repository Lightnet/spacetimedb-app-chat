// import { t } from "spacetimedb/server";
// import { validateMessage } from "../helper";
import spacetimedb from "../module";
// import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
import { bytesToHex, bytesToUtf8, hexToBytes } from "@noble/ciphers/utils.js";
import { scryptAsync } from "@noble/hashes/scrypt.js";
import { randomBytes } from '@noble/hashes/utils.js';
import { utf8ToBytes } from '@noble/hashes/utils.js'; // or use TextEncoder/Decoder

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

//-----------------------------------------------
// 
//-----------------------------------------------
export const group_test = spacetimedb.reducer(
  {  },
  (ctx, {  }) => {
    console.log("test");
  }
);
//-----------------------------------------------
// 
//-----------------------------------------------
export const test_c = spacetimedb.reducer(
  {  },
  async (ctx, {  }) => {
    console.log("END")
  })


export const test_id = spacetimedb.reducer(
  {  },
  async (ctx, {  }) => {
    //
    let id:String = ctx.newUuidV7().toString();
    console.log("id: ", id);
  }
)
//crypto.getRandomValues npm install @noble/ciphers @noble/hashes // nope, need to config
export const test_random = spacetimedb.reducer(
  {  },
  (ctx, {  }) => {
    console.log("test >>");
    // globalThis.crypto.getRandomValues = ctx.random();
    // crypto.getRandomValues = ctx.random();
    // let id:String = ctx.newUuidV7().toString();
    try {
      
      // let id = randomBytes(24);
      let id = getRandomBytes(ctx, 24)
    console.log("id: ", id);  
    } catch (error) {
      console.log("error: ", error);
    }
    
  }
)



// Parameters (tune these based on your security/performance needs)
// Higher values = more secure but slower
const SCRYPT_PARAMS = {
  N: 2 ** 20,     // CPU/memory cost (2^20 is ~1GB RAM, good for 2025+)
  r: 8,           // block size
  p: 1,           // parallelism
  dkLen: 32       // output key length in bytes
};

// Hash a password (for registration / password change)
async function hashPassword(ctx:any,password:any) {
  // const salt = randomBytes(16);                    // 16-byte random salt
  const salt = getRandomBytes(ctx, 16)                    // 16-byte random salt
  const key = await scryptAsync(password, salt, SCRYPT_PARAMS);

  // Store salt + hash together (common format: salt:hash in hex)
  const stored = bytesToHex(salt) + ':' + bytesToHex(key);
  return stored;
}

// Verify a password (for login)
async function verifyPassword(password:any, storedHash:any) {
  const [saltHex, hashHex] = storedHash.split(':');
  const salt = hexToBytes(saltHex);
  const expectedHash = hexToBytes(hashHex);

  const derivedKey = await scryptAsync(password, salt, SCRYPT_PARAMS);

  // Constant-time comparison (important for security)
  return bytesToHex(derivedKey) === bytesToHex(expectedHash);
}

export const test_salt = spacetimedb.reducer(
  {  },
  async (ctx, {  }) => {
    console.log("test salt");

    try {
      const password = 'correct-horse-battery-staple';
      
      // Hash during registration
      const hashed = await hashPassword(ctx,password);
      console.log('Stored hash:', hashed);
       // Verify during login
      const isCorrect = await verifyPassword(password, hashed);
      console.log('Password correct?', isCorrect);

      const wrongPass = await verifyPassword('wrong-password', hashed);
      console.log('Wrong password accepted?', wrongPass);


      
    } catch (error) {
      console.log("error: ", error);
    }
    
  }
)
