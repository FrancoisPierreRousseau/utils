const { spawn } = require('child_process');
const { error } = require('console');



function chunck(arrayToChunk, numberChunk){
    return Array.from({ length: arrayToChunk.length }, (_, i) => i + 1).reduce((array, index) => {

        if(index >= arrayToChunk.length){
            return array
        }

        if(array.length === 0){
            array.push([])
        }

        array[array.length - 1].push(arrayToChunk[index])

        if((index % numberChunk) === 0){
            array.push([])
            return array
        }
        return array
    }, [])
}


function pLimit(limit) {
    let countExec = 0;
    const queue = [];

    const next = () => {
        if (queue.length > 0 && countExec < limit) {
            const { fn, resolve, reject } = queue.shift();
            run(fn).then(resolve).catch(reject);
        }
    };

    const run = async (fn) => {
        countExec++;
        try {
            console.log(fn)
            const result = await fn();
            return result;
        } finally {
            countExec--;
            next(); 
        }
    };

    return (fn) => new Promise((resolve, reject) => {
        if (countExec < limit) {
            run(fn).then(resolve).catch(reject);
        } else {
            queue.push({ fn, resolve, reject }); 
        }
    });
}



function spawnAsync(command, args){
    return new Promise((resolve, reject) => {
        const process = spawn(command, args)

        let output = ''
        let errorOutput = ''
        
        // Écouter la sortie standard
        process.stdout.on('data', data => {
            output += data.toString(); // Accumuler la sortie
        });

        // Écouter les erreurs
        process.stderr.on('data', data => {
            errorOutput += data.toString();
        });

        // Écouter la fin du processus
        process.on('close', code => {
            if(code !== 0){
                reject(new Error(`Process exited with code ${code}: ${errorOutput}`));
            }else{
                resolve(output); // Résoudre la promesse avec la sortie
            }
        });

        process.on('error', err => {
            console.log(error)
            reject(err)
        })
    })
}


const spawnExecuteQuery =  query => {
    return spawnAsync('powershell.exe', [ 
        '-ExecutionPolicy', 
        'Bypass', 
        '-File', 
        './shells/executeQuery.ps1',
        '-SERVEUR',
        'LAPTOP-OPT2NCJT',
        '-DATABASE',
        'EBP',
        '-Query',
        query
    ])
}


(async () => {
    const limit = pLimit(2)

    const result = await spawnExecuteQuery('powershell.exe', `"SELECT
         '"SELECT ''' + COLUMNS.TABLE_NAME + ''' AS TABLE_NAME, ' +
         '''' + COLUMNS.COLUMN_NAME + ''' AS COLUMN_NAME, ' +
          COLUMNS.COLUMN_NAME + ' AS VALUE ' +
         'FROM ' + COLUMNS.TABLE_NAME + ' ' +
         'WHERE ' + COLUMNS.COLUMN_NAME + ' LIKE ''%.png'' ' Query
          FROM INFORMATION_SCHEMA.COLUMNS AS COLUMNS
          WHERE COLUMNS.DATA_TYPE IN ('nvarchar','varchar');"`);

    const jsonOutput = JSON.parse(result);
    const queries = Object.values(jsonOutput).map(result => ({ Query: result['Query'] }))
    
    const callsQuery = queries.map(query => limit(() => spawnExecuteQuery(query)))

    const results = await Promise.all(callsQuery)


    // const resutls = await Promise.all(callsQuery)

    // console.log(resutls)
})()


// Instalation VSCode (avec extensions, autosave, autoformate...), discord, Visual Studio Community
// Avec une commande Installer
// Ce serais bien que je puisse save les configuration que j'apprécie pour les utiliser
// sur un autre poste
// Ce serais bien si je pouvais réutiliser des configuration ou le logi est déja présente
// Ce serait bien de snapshot pour revenir en arriére au cas où

// Création de fichiers de configuration
// Synchronisation fichiers
// Triage et nettoyage mails