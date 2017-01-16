function makeid(len) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < len; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function encrypt(string, b64) {
  if(b64 == "") {
    this.b64 = makeid(string.length);
  } else {
    this.b64 = b64;
  }

  this.s = '';

  for (var i = 0; i < string.length; i++) {
    this.s+= String.fromCharCode(string.charCodeAt(i)+this.b64.charCodeAt(i));
  }
  return [this.s, this.b64]
}

function decrypt(string, b64) {
  this.s = '';

  for (var i = 0; i < string.length; i++) {
    this.s+= String.fromCharCode(string.charCodeAt(i)-b64.charCodeAt(i));
  }

  return this.s;
}

module.exports = {makeid, encrypt, decrypt}
