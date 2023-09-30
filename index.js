// import fs module present in node npm
const fs= require("node:fs");

// ReadFile function reads a file and return the string
function ReadFile(file){
let file_to_read= fs.readFileSync(file);

return file_to_read.toString();

}
function ReadStream(file){
// Create a Readable Stream
var data= '';
var readerStream = fs.createReadStream(file);
readerStream.setEncoding('UTF8');
// Handle stream events --> data, end, and error
readerStream.on('data', function(chunk) {  data += chunk; });
readerStream.on('end',function(){ return data; });
readerStream.on('error', function(err){  console.log(err.stack); });
return data;

}







module.exports= { ReadFile, ReadStream };
// exported it
