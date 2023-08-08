// import fs module present in node npm
const fs= require("node:fs");

// ReadFile function reads a file and return the string
function ReadFile(file){
let file_to_read= fs.readFileSync(file);

return file_to_read.toString();

}
module.exports= ReadFile;
// exported it
