/* Clearance crypto: AES-GCM-256 with a key from PBKDF2-SHA256 (650,000 iterations, random 16-byte salt, 12-byte IV).
   clearance.json holds only ciphertext; the password never leaves the browser. */
(function(){
'use strict';
const ITER=650000;
const b64=u=>{let s='';u=new Uint8Array(u);for(let i=0;i<u.length;i+=0x8000)s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000));return btoa(s)};
const unb64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
async function key(pw,salt,iter){
  const base=await crypto.subtle.importKey('raw',new TextEncoder().encode(pw),'PBKDF2',false,['deriveKey']);
  return crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:iter},base,{name:'AES-GCM',length:256},false,['encrypt','decrypt']);
}
async function encrypt(token,pw){
  const salt=crypto.getRandomValues(new Uint8Array(16)),iv=crypto.getRandomValues(new Uint8Array(12));
  const ct=await crypto.subtle.encrypt({name:'AES-GCM',iv},await key(pw,salt,ITER),new TextEncoder().encode(token));
  return {v:1,alg:'AES-GCM-256',kdf:'PBKDF2-SHA256',iter:ITER,salt:b64(salt),iv:b64(iv),ct:b64(ct),updated:new Date().toISOString()};
}
async function decrypt(obj,pw){ // throws on wrong password
  const pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:unb64(obj.iv)},await key(pw,unb64(obj.salt),obj.iter||ITER),unb64(obj.ct));
  return new TextDecoder().decode(pt);
}
window.OREM_CLEARANCE={encrypt,decrypt,ITER};
})();
