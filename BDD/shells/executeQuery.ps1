param (
    [Parameter(Mandatory = $true)]
    [string]$SERVEUR,

    [Parameter(Mandatory = $true)]
    [string]$DATABASE,

    [Parameter(Mandatory = $true)]
    [string]$QUERY
)


# Install-Module -Name SqlServer -AllowClobber -Force -SkipPublisherCheck

if (-not (Get-Module -ListAvailable -Name SqlServer)) {
    Write-Host 'Installation du module SqlServer'
    Install-Module -Name SqlServer -AllowClobber -Force -SkipPublisherCheck
}

# $passwordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($PASSWORD))


#$connectionString = "Server=$SERVEUR;Database=$DATABASE;User Id=$USER;Password=$passwordPlain;"

$ConnectionString = "Server=$SERVEUR;Database=$DATABASE;Integrated Security=True;TrustServerCertificate=True;"



$Query = "SELECT
         'SELECT ''' + COLUMNS.TABLE_NAME + ''' AS TABLE_NAME, ' +
         '''' + COLUMNS.COLUMN_NAME + ''' AS COLUMN_NAME, ' +
          COLUMNS.COLUMN_NAME + ' AS VALUE ' +
         'FROM ' + COLUMNS.TABLE_NAME + ' ' +
         'WHERE ' + COLUMNS.COLUMN_NAME + ' LIKE ''%.png'' ' Query
          FROM INFORMATION_SCHEMA.COLUMNS AS COLUMNS
          WHERE COLUMNS.DATA_TYPE IN ('nvarchar','varchar');"


$result = Invoke-Sqlcmd -ConnectionString $ConnectionString -Query $QUERY


# $jsonData = $result | ConvertTo-Json


# $result | Format-Table -AutoSize
  
$result | ConvertTo-Json 


# # Définir la chaîne de connexion
# $server = "nom_serveur"
# $database = "nom_base"
# $user = "utilisateur"
# $password = "mot_de_passe"
# 
# $connectionString = "Server=$server;Database=$database;User Id=$user;Password=$password;"
# 
# # Écrire la requête SQL
# $Query = "SELECT * FROM nom_table"
# 
# # Exécuter la requête et récupérer les données
# $data = Invoke-Sqlcmd -ConnectionString $connectionString -Query $Query
# 
# # Convertir les données en JSON
# $jsonData = $data | ConvertTo-Json
# 
# # Chemin du fichier JSON
# $jsonFilePath = "C:\chemin\vers\ton_fichier.json"
# 
# # Écrire les données JSON dans le fichier
# $jsonData | Out-File -FilePath $jsonFilePath -Encoding utf8
# 
# Write-Host "Les données ont été écrites dans le fichier JSON : $jsonFilePath"
