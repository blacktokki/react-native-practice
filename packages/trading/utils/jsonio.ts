  
import path from 'path'
import fs from 'fs'

export function save_json(data:any, _path:string){
    fs.writeFile( path.join(_path), JSON.stringify(data), "utf8",(err)=>{if (err)console.log(err)});
}

export function load_json(_path:string){
    let data:any = null
    data = fs.readFileSync(path.join(_path), 'utf8')
    return JSON.parse(data)
}

export function exists_file(_path:string){
    return fs.existsSync(_path)
}

export function init_folder(_path:string){
    if(!exists_file(_path)){
        fs.mkdirSync(_path)
    }
}