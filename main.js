#!/usr/bin/env node
'use strict';

var fs = require('fs');
var filename = 'sample';
var content = '';
var readStream = fs.createReadStream(`./csv_files/${filename}.csv`, 'utf8');

//var csv is the CSV file with headers
const csvJSON = (csv) => {

    var lines=csv.split("\r\n");
    var result = [];
    var headers=lines[0].split(",");

    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].split(",");
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
}

readStream.on('data', function(chunk) {  
    content += chunk;
}).on('end', function() {
    console.log("CSV Loaded!! Convert to JSON....");
    var JSON_Content = csvJSON(content);
    var obj_json = JSON.parse(JSON_Content)
    console.log(`Total Line Count: ${obj_json.length}`);
    console.log("JSON Converted!! Save as a JSON file....");
    fs.writeFile(`./json_files/${filename}.json`, JSON_Content, 'utf8', (err) => {  
        // throws an error, you could also catch it here
        if (err) throw err;
    
        // success case, the file was saved
        console.log(`JSON saved! - Path: ./json_files/${filename}.json`);

        console.log(`Verifying...`);
        var verify_content = '';
        var verify_readStream = fs.createReadStream(`./json_files/${filename}.json`, 'utf8');
        verify_readStream.on('data', function(chunk) {  
            verify_content += chunk;
        }).on('end', function() {
            var obj_json = JSON.parse(verify_content)
            console.log(`JSON File is validated.`);
            console.log(`Total Line Count: ${obj_json.length}`);
            console.log("Successfully...");
        });
    });
    
});




