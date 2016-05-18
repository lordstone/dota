var ndjson = require('ndjson')
var spawn = require('child_process').spawn;
var fs = require('fs');


var entries = [];
var parser = spawn("java", ["-jar",
                    "-Xmx64m",
                    "./java_parser/target/stats-0.1.0.jar"
],
{
    stdio: ['pipe', 'pipe','ignore'],
    encoding: 'utf8'
});


fs.createReadStream('./dem/2332828356.dem').pipe(parser.stdin);

parser.stdin.on('error', exit);
parser.stdout.on('error', exit);

 
var parseStream = ndjson.parse();
parseStream.on('data', function handleStream(e)
{
    if (e.type === 'epilogue')
    {
        console.log('received epilogue');
    }
    entries.push(e);
});

    
parseStream.on('end', exit);
parseStream.on('error', exit);
parser.stdout.pipe(parseStream);

function exit()
{
    console.log("exit");
    
    fs.writeFileSync('out/out.json', JSON.stringify(entries));
    
    return;
}
