  
import path from 'path'
import fs from 'fs'

export function save_json(data:any, _path:string){
    fs.writeFile( path.join(_path), JSON.stringify(data), "utf8",()=>{});
}

export function load_json(_path:string){
    let data:any = null
    fs.readFile(path.join(_path), 'utf8', function(err, data){
        try{
            data = JSON.parse(data);
        }
        catch(e){
            console.log(path.join(_path) + ' err');
        }
    })
    return data
}

export function exists_file(_path:string){
    return fs.existsSync(_path)
}
