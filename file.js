const fs = require('fs');
const path = require('path');
const util = require('util');


// dir doit être un tableau de path

const readdirAsync = util.promisify(fs.readdir)


async function findFilesName(dir){
    if(typeof dir !== 'string'){
        throw new Error('Dir doit être de type string')
    }
    
    return (await readdirAsync(dir)).filter(file => !fs.statSync(path.join(dir, file)).isDirectory())
}

// ( async () => {
//     console.log(await findFilesName('./'))
// })()



async function findSubDirectories(dir){
    if(typeof dir !== 'string'){
        throw new Error('Dir doit être de type string')
    }

    return (await readdirAsync(dir)).map(file => path.join(dir, file)).filter(filePath => fs.statSync(filePath).isDirectory())
}

// ( async () => {
//      console.log(await findSubDirectories('./'))
// })()

async function findSubDirectoriesRecursive(dir){

    if(typeof dir !== 'string'){
        throw new Error('dir doit être de type string')
    }

    return (await readdirAsync('./', { recursive: true })).map(file => path.join(dir, file)).filter(filePath => fs.statSync(filePath).isDirectory())
}

// ( async () => {
//       console.log(await findSubDirectoriesRecursive('./'))
// })()


async function findFilesRecusive(dir){

    if(typeof dir !== 'string'){
        throw new Error('dir doit de type string')
    }

    return (await readdirAsync(dir, {recursive: true})).filter(file => !fs.statSync(path.join(dir, file)).isDirectory())
}

 // ( async () => {
 //       console.log(await findFilesRecusive('./'))
 // })()



async function findFilesRecursiveByExtension(dir, extension) {
    if(typeof dir !== 'string'){
        throw new Error('dir doit de type string')
    }

    if(typeof extension !== 'string'){
        throw new Error('extension doit de type string')
    }

    return (await findFilesRecusive(dir)).filter(filePath => path.extname(filePath) === extension);
}

function deleteFile(filePath) {
    if(typeof filePath !== 'string'){
        throw new Error('filePath doit de type string')
    }

    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err) {
                throw new Error(`Erreur lors de la suppression du fichier ${filePath}: ${err}`)
            } else {
                return filePath
            }
        });
    }
}

// retourner le filePath
console.log(deleteFile('images.jpg')







// Fonction pour parcourir récursivement un répertoire et ses sous-dossiers
function traverseDirectory(directory) {
    // Lire le contenu du répertoire
    fs.readdir(directory, (err, files) => {
        if (err) {
            console.error(`Erreur lors de la lecture du dossier ${directory}:`, err);
            return;
        }

        // Parcourir chaque fichier/dossier dans le répertoire
        files.forEach(file => {
            const filePath = path.join(directory, file);

            // Vérifie si c'est un répertoire
            fs.stat(filePath, (err, stat) => {
                if (err) {
                    console.error(`Erreur lors de la vérification du fichier ${filePath}:`, err);
                    return;
                }

                // Si c'est un dossier, on appelle récursivement traverseDirectory
                if (stat.isDirectory()) {
                    traverseDirectory(filePath); // Appel récursif
                } else {
                    // Si c'est un fichier et qu'il correspond au nom à supprimer
                    if (file === fileNameToDelete) {
                        deleteFile(filePath); // Supprimer le fichier
                    }
                }
            });
        });
    });
}

// Répertoire racine où commencer la recherche (remplace-le par le chemin de ton dossier)
// const rootDirectory = path.resolve(__dirname, 'ton_dossier');

// Lancer la recherche récursive et suppression des fichiers correspondants
// traverseDirectory(rootDirectory);
