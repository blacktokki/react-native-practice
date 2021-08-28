  
import path from 'path'
import fs from 'fs'

export async function save_json(data:any, _path:string){
    fs.writeFile(_path, JSON.stringify(data), "utf8",(err)=>{if (err)console.log(err)});
}

export async function load_json(_path:string){
    let data = fs.readFileSync(_path, 'utf8')
    return JSON.parse(data)
}

export async function exists_file(_path:string){
    return fs.existsSync(_path)
}

export async function init_folder(_path:string){
    if(!await exists_file(_path)){
        fs.mkdirSync(_path)
    }
}