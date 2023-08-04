const fs= require("node:fs");

function ReadFile(file){
let bb= fs.readFileSync(file);

return bb.toString();

}
module.exports= ReadFile;
