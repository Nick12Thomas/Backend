const NAME_PATTERN = /^[A-Za-z\s]+$/
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/
function convertToAscii(inputString) {
    // remove non ascii characters
    const asciiString = inputString.replace(/[^\x00-\x7F]+/g, "");
    return asciiString;
}
module.exports={
    NAME_PATTERN,
    EMAIL_PATTERN,
    convertToAscii
}