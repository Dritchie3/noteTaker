const fs = require('fs');
const path = require('path');
const express = require('express');
const PORT = process.env.PORT || 3000;
const app= express();
const router = express.Router();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))//MIME-type exception singals you might not have this
app.use((req,res,next)=>{
    next()
})

app.get("/notes", (req,res)=>{
    res.sendFile(path.join(__dirname, "./public/notes.html"))
})
// --------------------
app.route("/api/notes")
    .get((req,res)=>{
        console.log('api/notes.get')
        //get the data
        fs.readFile(path.join(__dirname, './db/db.json'), "utf-8",(err, data) =>{
            // console.log('3', data);
            if(err)throw(err)
            res.json(JSON.parse(data))
        });
    })
    //send the data
    .post((req,res)=>{        
        //fs.readfile       
        fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8',(err, data) => { 
            if(err)throw(err)            
            //var=json.parse
            let noteData = JSON.parse(data); 
            //var.push(req.body)
            noteData.push(req.body)
            //let= JSON.strinigify(var)
            let stringNoteData = JSON.stringify(noteData)
            // fs.writefile 
            fs.writeFile(path.join(__dirname, './db/db.json'), stringNoteData, 'utf-8',(err, data) =>{
            // console.log('write file started');
            if(err)throw(err);
            res.set(200).json(req.body);
        });
        });        
    });
//     ------------------
// GET /api/notes db.json
// POST /api/notes db.json
// DELETE /api/notes/:id db.json
app.delete("/api/notes/:id",(req,res)=>{
    fs.readFile(path.join(__dirname, './db/db.json'), 'utf-8',(err, data) => { 
        if(err)throw(err)
        let noteData = JSON.parse(data); 
        // console.log(req.params.id)
        noteData.splice(req.params.id,1);
        let stringNoteData = JSON.stringify(noteData)
        // fs.writefile 
        fs.writeFile(path.join(__dirname, './db/db.json'), stringNoteData, 'utf-8',(err, data) =>{
        if(err)throw(err);
        res.set(200).json(req.body);
        })})
})
app.get("*", (req,res)=>{
    // console.log('trash');
    res.sendFile(path.join(__dirname, "./public/index.html"))
});

app.listen(PORT, () => console.log("listening on " + PORT));

