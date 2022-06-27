const colors = require("colors")
const package = require("../package.json")
module.exports = (content = "") => {
    console.log(`[${package.name} Error]`.red + ": " + content);
}