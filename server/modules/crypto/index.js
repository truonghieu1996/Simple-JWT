const cryptoJS = require('crypto-js')
const config = require('../../config')

/**
 * check whether a plain text matches the encrypted text
 *
 * @param {String} plainText the plain text
 * @param {String} encryptText the encrypt text
 * @return {boolean}
 */
function matches(plainText, encryptText) {
  return decrypt(encryptText.toString()) === plainText
}

/**
 * encrypt text
 *
 * @param {String} plainText
 * @return {*|CipherParams}
 */
function encrypt(plainText) {
  return cryptoJS.AES.encrypt(plainText, config.crypto.secret)
}

/**
 * decrypt text
 *
 * @param {String} encryptText
 * @return {*|CipherParams}
 */
function decrypt(encryptText) {
  let bytes = cryptoJS.AES.decrypt(encryptText.toString(), config.crypto.secret)
  return bytes.toString(cryptoJS.enc.Utf8)
}

module.exports = {matches, encrypt, decrypt}
