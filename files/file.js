const fs = require('fs');
const path = require('path');
const util = require('util');

//  https://clearpurpose.media/book-brief-playing-to-win-e78f7f5f7142
//  Chaque shéma dans une bdd correspond à un domaine (gestion des callendrier, des dossiers, des droits utilisateurs)
//  Connecter une API(s) à chaque schéma ce qui permet d'avoir une gestion plus fine au niveau des droits applicatiifs
//  Lorsqu'un schéma est modifier alors les autres shéma peuvent réagir en conséquence ?   



const readdirAsync = util.promisify(fs.readdir)
const unlinkAsync = util.promisify(fs.unlink)



// dir doit être un tableau de path. limité est conservant uniquement le parent racine, rajouter to: 'ddd' ou s'arrétera la recusivité
// Puis rajouter un sytéme de filtrage
async function findFilesName(directories, { recursive = false  }){
    if(!Array.isArray(directories)){
        throw new Error('directories doit être un tableau')
    }

    if(directories.some(directory => typeof directory !== "string")){
        throw new Error('directories doit être un tableau de string')
    }

    const resolvedPath = directories.map(directory => path.resolve(directory))

    const unresolvedPath = resolvedPath.filter(directory => !fs.existsSync(directory))
    if(unresolvedPath.length > 0){
        throw new Error(`Les chemins spécifiés n'existent pas : ${unresolvedPath.join(', ')}`);
    }

    const filesPath = resolvedPath.filter(directory => !fs.statSync(directory).isDirectory())
    if (filesPath.length > 0) {
        throw new Error(`Les chemins spécifiés ne sont pas des répertoires valide : ${filesPath.join(', ')}`);
    }


    const filtreByFile = async directory => (await readdirAsync(directory, { recursive })).filter(file => !fs.statSync(path.join(directory, file)).isDirectory())
    return await Promise.all(directories.map(directory => filtreByFile(directory) ))
}

( async () => {

    // ------ Recursion terminal ----------------------
   const directories = [
        './../../', 
        './mem', 
        '../../../../', 
        'C:\\Users\\franc\\Videos\\films\\..'
    ].map(dir => path.resolve(dir))
    
    const lastPaths = directories
            .filter((currentDir) => directories.every(
                dir => currentDir === dir ? true :  !dir.includes(currentDir) 
            ))

    const potentialParentPath = directories.filter(currentDir => 
        !(lastPaths.some(lastPath => currentDir === lastPath)))

    const sureParentPath = lastPaths.filter(
        lastPath => potentialParentPath.some(dir => !(lastPath.includes(dir))))

    console.log(sureParentPath)
    console.log(potentialParentPath)
    
    //----------------------------------------------------------------------------




    

    directories.map(dir => path.resolve(dir)).sort((a, b) => a.length - b.length).reduce((array, dir) => {
        return array
    },[])
   
    //console.log(directories)
   // console.log(await findFilesName(['./'] ,{ recursive: false }))
})()



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
    

    // Existe un undefined le supprimer
    const filesPath = (await findFilesName(dir, { recursive: true })).filter(filePath => path.basename(filePath) === fileName)
    
    const filesPathToDelete = [path.join(dir, fileName), ...filesPath].filter(filePath => fs.existsSync(filePath))
    
    return await Promise.all(filesPathToDelete.map(filepath => deleteFile(filepath)))
}

// (async () => {
//      console.log(await deleteFileInAllSubdictories('./','Ah-ouais-Cest.jpg'))
// })()
