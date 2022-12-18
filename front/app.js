const express = require("express")
const app = express();
const multer  = require('multer')

var file_system = require('fs');
var archiver = require('archiver');

// const upload = multer({ dest: './public/data/uploads/' })

var storage = multer.diskStorage(
    {
        destination: './public/data/uploads/',
        filename: function ( req, file, cb ) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
          if(file.fieldname=="uploaded_file"){
            cb( null, "template.png");
          }else{
            cb( null, "names.txt");
          }
        }
    }
);
var upload = multer( { storage: storage } );

app.get('/',(req,res)=>{
  res.sendFile("./index.html",{root:__dirname})
})
app.get('/style.css',(req,res)=>{
  res.sendFile("./style.css",{root:__dirname})
})
const cpUpload = upload.fields([{ name: 'uploaded_file', maxCount: 1 }, { name: 'uploaded_file2', maxCount: 1 }])
app.post('/stats', cpUpload, function (req, res) {
  console.log(__dirname+"/public/data/uploads/main.py")
  const PythonShell = require('python-shell').PythonShell;
  var options = {
  
  mode: 'text',
  scriptPath: __dirname+"/public/data/uploads/",
    script:__dirname+"/public/data/uploads/"
};
  PythonShell.run('main.py', options, function (err, results) {
  if (err) 
    throw err;
  //finish generate
    var output = file_system.createWriteStream('target.zip');
var archive = archiver('zip');

output.on('close', function () {
    console.log(archive.pointer() + ' total bytes');
    console.log('archiver has been finalized and the output file descriptor has closed.');
  archive.finalize();
});

archive.on('error', function(err){
    throw err;
});


// append files from a sub-directory, putting its contents at the root of archive
archive.directory(__dirname+"/public/data/uploads/out", false);

    archive.pipe(output);
// append files from a sub-directory and naming it `new-subdir` within the archive
archive.directory('subdir/', 'new-subdir');
    
});
  
})
app.get('/datas',(req,res)=>{
  res.sendFile(__dirname+"/target.zip")
})
app.listen(3000,()=>{
  console.log("listening.....")
})