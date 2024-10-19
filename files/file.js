const fs = require('fs');
const path = require('path');
const util = require('util');


// dir doit être un tableau de path

const readdirAsync = util.promisify(fs.readdir)
const unlinkAsync = util.promisify(fs.unlink)

// Si il ne trouve pas le dir générer une erreur
async function findFilesName(dir, { recursive = false  }){
    if(typeof dir !== 'string'){
        throw new Error('dir doit être de type string')
    }

    if(!fs.existsSync(dir)){
        throw new Error(`Le chemin spécifié n'existe pas : ${path.resolve(dir)}`);
    }

    if (!fs.statSync(dir).isDirectory()) {
        throw new Error(`Le chemin spécifié n'est pas un répertoire valide : ${path.resolve(dir)}`);
    }
    
    return (await readdirAsync(dir, { recursive })).filter(file => !fs.statSync(path.join(dir, file)).isDirectory())
}

// ( async () => {
//     console.log(await findFilesName('./', { recursive: false }))
// })()


// Si il ne trouve pas le dir générer une erreur
async function findSubDirectories(dir, { recursive = false }){
    if(typeof dir !== 'string'){
        throw new Error('Dir doit être de type string')
    }

    if(!fs.existsSync(dir)){
        throw new Error(`Le chemin spécifié n'existe pas : ${path.resolve(dir)}`);
    }

    if (!fs.statSync(dir).isDirectory()) {
        throw new Error(`Le chemin spécifié n'est pas un répertoire valide : ${path.resolve(dir)}`);
    }

    return (await readdirAsync(dir, { recursive })).map(file => path.join(dir, file)).filter(filePath => fs.statSync(filePath).isDirectory())
}

// ( async () => {
//     console.log((await findSubDirectories('./', { recursive: true })).filter(dir => dir.split('\\').at(0) !== '.git'))
// })()


async function findFilesRecursiveByExtension(dir, extension) {
    if(typeof dir !== 'string'){
        throw new Error('dir doit de type string')
    }

    if(typeof extension !== 'string'){
        throw new Error('extension doit de type string')
    }

    if(!fs.existsSync(dir)){
        throw new Error(`Le chemin spécifié n'existe pas : ${path.resolve(dir)}`);
    }

    if (!fs.statSync(dir).isDirectory()) {
        throw new Error(`Le chemin spécifié n'est pas un répertoire valide : ${path.resolve(dir)}`);
    }

    return (await findFilesName(dir, { recursive: true })).filter(filePath => path.extname(filePath) === extension);
}

// ( async () => {
//        console.log(await findFilesRecursiveByExtension('./', '.png'))
// })()

async function deleteFile(filePath) {
    if(typeof filePath !== 'string'){
        throw new Error('filePath doit de type string')
    }

    if(!fs.existsSync(filePath)){
        throw new Error(`Le chemin spécifié n'existe pas : ${path.resolve(filePath)}`);
    }

    try{
        await unlinkAsync(filePath)
    } catch(err){
        throw new Error(`Erreur lors de la suppression du fichier ${filePath}: ${err}`)
    }
    
    return filePath
}

// (async () => {
//    await deleteFile('apiAsp.jpg')
// })()


const files = {
    "dir": [ 'file1', 'file2' ],
    "dir2": [ 'file1', 'file2' ]
}

async function deleteFileInAllSubdictories(dir, fileName) {
    if(typeof fileName !== 'string'){
        throw new Error('fileName doit de type string')
    }

    if(typeof dir !== 'string'){
        throw new Error('fileName doit de type string')
    }

    if(!fs.existsSync(dir)){
        throw new Error(`Le chemin spécifié n'existe pas : ${path.resolve(dir)}`);
    }

    if (!fs.statSync(dir).isDirectory()) {
        throw new Error(`Le chemin spécifié n'est pas un répertoire valide : ${path.resolve(dir)}`);
    }
    // Ici il est plus valable  de directement utiliser le findFile et non subdirectories
    const subDirectories = await findSubDirectories(dir, { recursive: true })

    const filesPath = subDirectories.map(subDir => path.join(subDir, fileName))
    const filesPathToDelete = [path.join(dir, fileName), ...filesPath].filter(filePath => fs.existsSync(filePath))
    
    return await Promise.all(filesPathToDelete.map(filepath => deleteFile(filepath)))
}

// (async () => {
//      console.log(await deleteFileInAllSubdictories('./','5-Anime-Like-The-Samurai-Champloo-You-Must-See-FHVIY-1.jpg'))
// })()
