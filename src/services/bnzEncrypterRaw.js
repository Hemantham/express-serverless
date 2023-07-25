import { webcrypto } from "crypto";
const crypto = webcrypto;

export function encryptLoginCredentials(accessID, password, pubKey) {
  var formattedAccessID = accessID.replace(/[- ]/g, "");
  var jsonStringToEncrypt = JSON.stringify({
    type: "PASSWORD",
    principal: formattedAccessID,
    credentials: password,
  });

  var cryptoType = getCrypto(); //Gets the Supported Crypto Type
  console.log(`type: ${cryptoType}`);
  var randomArrayOne = cryptoType.getRandomValues(new Uint8Array(16));
  var randomArrayTwo = cryptoType.getRandomValues(new Uint8Array(16));
  var buffer1 = randomArrayOne.buffer;
  var buffer2 = randomArrayTwo.buffer;

  var strLength = jsonStringToEncrypt.length;
  var encoding = "utf8";
  var length2 = 0 | GetPayload(jsonStringToEncrypt).length;

  console.log(`length2: ${length2}`);
  var val = null;
  if (2147483647 > length2) {
    var buffer3 = new Uint8Array(length2);
    var encodedArray = WriteBuffer(jsonStringToEncrypt, encoding, buffer3);
    var encodedBuffer = encodedArray.buffer;

    var val = applySymmetricEncryption(buffer1, buffer2, encodedBuffer).then(
      function (sumenc) {
        var iv = GetStrFromBuffer(randomArrayTwo);
        var key = GetStrFromBuffer(randomArrayOne);
        var payload = GetStrFromBuffer(new Uint8Array(sumenc));

        var publicKey = pubKey;

        var publicKeyBase64Buffer = Base64Buffer(publicKey).buffer;
        var keyBase64Buffer = Base64Buffer(key);
        var ivBase64Buffer = Base64Buffer(iv);
        var base64BufferNew = new Uint8Array(
          keyBase64Buffer.length + ivBase64Buffer.length
        );

        var bufferKey = WriteBase64(base64BufferNew, key, 0, 16);
        var bufferVi = WriteBase64(base64BufferNew, iv, 16, 16);

        var encryptval = applyAsymmetricEncryption(
          publicKeyBase64Buffer,
          base64BufferNew
        ).then(function (encrypted) {
          var content = GetStrFromBuffer(new Uint8Array(encrypted));
          var payloadLength =
            1 +
            4 +
            Base64Buffer(content).length +
            4 +
            Base64Buffer(payload).length;
          var arrBuffer = new Uint8Array(payloadLength);
          writeUint8(arrBuffer, 2);
          writeInt32BE(arrBuffer, Base64Buffer(content).length, 1);
          var base64Str = content.toString("base64");
          WriteBase64(arrBuffer, base64Str, 5, payloadLength - 5);
          var contentlen = 5 + Base64Buffer(content).length;
          writeInt32BE(arrBuffer, Base64Buffer(payload).length, contentlen);
          WriteBase64(
            arrBuffer,
            payload,
            contentlen + 4,
            payloadLength - (contentlen + 4)
          );
          var finalcontent = GetStrFromBuffer(arrBuffer);
          console.log(`finalcontent: ${finalcontent}`);
          return finalcontent;
        });

        console.log(`encryptval: ${encryptval}`);
        return encryptval;
      }
    );
    console.log(`val: ${val}`);
    return val;
  }
  console.log(`val: ${val}`);
  return val;
}

function writeUint8(buffer, e, t, n) {
  return (
    (e = +e),
    (t |= 0),
    n || true,
    true || (e = Math.floor(e)),
    (buffer[t] = 255 & e),
    t + 1
  );
}

function writeInt32BE(buffer, e, t, n) {
  return (
    (e = +e),
    (t |= 0),
    n || true,
    e < 0 && (e = 4294967295 + e + 1),
    true
      ? ((buffer[t] = e >>> 24),
        (buffer[t + 1] = e >>> 16),
        (buffer[t + 2] = e >>> 8),
        (buffer[t + 3] = 255 & e))
      : L(buffer, e, t, !1),
    t + 4
  );
}

function L(e, t, n, r) {
  t < 0 && (t = 4294967295 + t + 1);
  for (var o = 0, i = Math.min(e.length - n, 4); o < i; ++o)
    e[n + o] = (t >>> (8 * (r ? o : 3 - o))) & 255;
}

function applyAsymmetricEncryption(publicKeyBuffer, payloadBuffer) {
  return Getsubtle()
    .importKey(
      "spki",
      publicKeyBuffer,
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      !1,
      ["encrypt"]
    )
    .then(function (publicKeyBuffer) {
      return Getsubtle().encrypt(
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        publicKeyBuffer,
        payloadBuffer
      );
    });
}

function Base64Buffer(buffer) {
  var base64Encoded = atob(buffer);
  for (
    var t = new Uint8Array(base64Encoded.length), n = 0;
    n < base64Encoded.length;
    n++
  ) {
    t[n] = base64Encoded.charCodeAt(n);
  }

  return t;
}

function WriteBase64(base64Buffer, data, startIndex, lengthOfData) {
  var ee = /[^+\/0-9A-Za-z-_]/g;
  data = data.trim ? data.trim() : data.replace(/^\s+|\s+$/g, "");

  if (((data = data.replace(ee, "")), data.length < 2)) return "";

  for (; data.length % 4 !== 0; ) data += "=";

  var dataByteArray = ToByteArray(data);
  var n = startIndex;
  var r = lengthOfData;

  for (
    var o = 0;
    o < r && !(o + n >= base64Buffer.length || o >= dataByteArray.length);
    ++o
  )
    base64Buffer[o + n] = dataByteArray[o];
  return base64Buffer;
}

function ToByteArray(e) {
  for (
    var l = [],
      f = [],
      d = "undefined" !== typeof Uint8Array ? Uint8Array : Array,
      p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      h = 0,
      v = p.length;
    h < v;
    ++h
  ) {
    (l[h] = p[h]), (f[p.charCodeAt(h)] = h);
  }
  f["-".charCodeAt(0)] = 62;
  f["_".charCodeAt(0)] = 63;

  for (
    var t,
      n = ValidateLengthOf4(e),
      o = n[0],
      a = n[1],
      u = new d(factorIn(o, a)),
      c = 0,
      s = a > 0 ? o - 4 : o,
      l = 0;
    l < s;
    l += 4
  )
    (t =
      (f[e.charCodeAt(l)] << 18) |
      (f[e.charCodeAt(l + 1)] << 12) |
      (f[e.charCodeAt(l + 2)] << 6) |
      f[e.charCodeAt(l + 3)]),
      (u[c++] = (t >> 16) & 255),
      (u[c++] = (t >> 8) & 255),
      (u[c++] = 255 & t);
  return (
    2 === a &&
      ((t = (f[e.charCodeAt(l)] << 2) | (f[e.charCodeAt(l + 1)] >> 4)),
      (u[c++] = 255 & t)),
    1 === a &&
      ((t =
        (f[e.charCodeAt(l)] << 10) |
        (f[e.charCodeAt(l + 1)] << 4) |
        (f[e.charCodeAt(l + 2)] >> 2)),
      (u[c++] = (t >> 8) & 255),
      (u[c++] = 255 & t)),
    u
  );
}

function factorIn(t, n) {
  return (3 * (t + n)) / 4 - n;
}

function ValidateLengthOf4(dataStr) {
  var t = dataStr.length;
  if (t % 4 > 0)
    throw new Error("Invalid string. Length must be a multiple of 4");
  var n = dataStr.indexOf("=");
  return -1 === n && (n = t), [n, n === t ? 0 : 4 - (n % 4)];
}

function GetStrFromBuffer(buffer) {
  for (
    var l = [],
      f = [],
      d = "undefined" !== typeof Uint8Array ? Uint8Array : Array,
      p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      h = 0,
      v = p.length;
    h < v;
    ++h
  ) {
    (l[h] = p[h]), (f[p.charCodeAt(h)] = h);
  }

  var strBuffer = new Uint8Array(buffer.length);

  for (var r = 0; r < buffer.length; r += 1) {
    strBuffer[r] = 255 & buffer[r];
  }

  var e = strBuffer;

  for (
    var t, n = e.length, r = n % 3, o = [], i = 0, a = n - r;
    i < a;
    i += 16383
  ) {
    o.push(concatHelper1(e, i, i + 16383 > a ? a : i + 16383));
  }
  return (
    1 === r
      ? ((t = e[n - 1]), o.push(l[t >> 2] + l[(t << 4) & 63] + "=="))
      : 2 === r &&
        ((t = (e[n - 2] << 8) + e[n - 1]),
        o.push(l[t >> 10] + l[(t >> 4) & 63] + l[(t << 2) & 63] + "=")),
    o.join("")
  );
}

function concatHelper1(e, t, n) {
  for (var r, o = [], i = t; i < n; i += 3) {
    (r =
      ((e[i] << 16) & 16711680) + ((e[i + 1] << 8) & 65280) + (255 & e[i + 2])),
      o.push(concatSub2(r));
  }
  return o.join("");
}

function concatSub2(e) {
  for (
    var l = [],
      f = [],
      d = "undefined" !== typeof Uint8Array ? Uint8Array : Array,
      p = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      h = 0,
      v = p.length;
    h < v;
    ++h
  ) {
    (l[h] = p[h]), (f[p.charCodeAt(h)] = h);
  }

  return l[(e >> 18) & 63] + l[(e >> 12) & 63] + l[(e >> 6) & 63] + l[63 & e];
}

function getCrypto() {
  return crypto;
}

function GetPayload(credentials, t) {
  t = t || 1 / 0;

  for (var n, r = credentials.length, o = null, i = [], a = 0; a < r; ++a) {
    if ((n = credentials.charCodeAt(a)) > 55295 && n < 57344) {
      if (!o) {
        if (n > 56319) {
          (t -= 3) > -1 && i.push(239, 191, 189);
          continue;
        }
        if (a + 1 === r) {
          (t -= 3) > -1 && i.push(239, 191, 189);
          continue;
        }
        o = n;
        continue;
      }
      if (n < 56320) {
        (t -= 3) > -1 && i.push(239, 191, 189), (o = n);
        continue;
      }
      n = 65536 + (((o - 55296) << 10) | (n - 56320));
    } else o && (t -= 3) > -1 && i.push(239, 191, 189);
    if (((o = null), n < 128)) {
      if ((t -= 1) < 0) break;
      i.push(n);
    } else if (n < 2048) {
      if ((t -= 2) < 0) break;
      i.push((n >> 6) | 192, (63 & n) | 128);
    } else if (n < 65536) {
      if ((t -= 3) < 0) break;
      i.push((n >> 12) | 224, ((n >> 6) & 63) | 128, (63 & n) | 128);
    } else {
      if (!(n < 1114112)) throw new Error("Invalid code point");
      if ((t -= 4) < 0) break;
      i.push(
        (n >> 18) | 240,
        ((n >> 12) & 63) | 128,
        ((n >> 6) & 63) | 128,
        (63 & n) | 128
      );
    }
  }
  return i;
}

function WriteBuffer(e, t, buffer3) {
  var r = t;
  var n = buffer3.length;
  t = 0;
  var newBuffer = GetPayload(e, buffer3.length - t);

  for (
    var o = 0;
    o < n && !(o + t >= buffer3.length || o >= newBuffer.length);
    ++o
  ) {
    buffer3[o + t] = newBuffer[o];
  }

  return buffer3;
}

function applySymmetricEncryption(bufffer1, buffer2, utf8Buffer) {
  return Getsubtle()
    .importKey("raw", bufffer1, { name: "AES-CBC" }, !1, ["encrypt"])
    .then(function (key) {
      return Getsubtle().encrypt(
        { name: "AES-CBC", iv: buffer2 },
        key,
        utf8Buffer
      );
    });
}

function Getsubtle() {
  var supportType = getCrypto();
  return supportType.subtle;
}

//export default encryptLoginCredentials;
// var elementname =  arguments[3];

// return encryptLoginCredentials(arguments[0], arguments[1],arguments[2]).then(function (value) {
//     var input = document.createElement("input");
//     input.setAttribute("type", "hidden");
//     input.setAttribute("id",elementname);
//     input.setAttribute("value", value);
//     document.getElementById("_content").appendChild(input);
//     return value;
// })
