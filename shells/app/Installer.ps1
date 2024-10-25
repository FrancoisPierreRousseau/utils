# Avoir la possibilité de spécifier une version.


##########################################################################
#
# Ce module Installer serra ce qui est spécifique à moi, le reste pourra 
# être utiliser de façon totalement indépendante  
#
##########################################################################


##########################################################################
#     PRES REQUIS GLOBAL
# Dev: PowerShell: 
#      - Version minimum pour fonctionner
#      - Activer globalement Set-StrictMode  
#
##########################################################################


######################################################
#
# Installation d'outils 
# Prérequie: .... 
#
######################################################
# Installater : (doit avoir la capaciter de choisir ce que l'on veut installer) 
#          IDE:
#             vscommunity: Install-Module -Name VSSetup -Scope CurrentUser
#             vscode:
#                 extension:
#                         Prettier - Code formatter > utilise package prettiers)
#                         shellcheck
#                         shellformat
#                         PowerShell
#                         Material Icon Theme
#                         Material Theme — Free
#                         Night Owl
#                         PowerShell
#          Outils : 
#             volta (installer directement node via volta)
#          Packages: 
#             Node: prettier(creation d'un fichier de config, avec son path), volta pour installer node




######################################################
#
# Workspace
# Prérequie: .... 
#
######################################################


############################ NOTES ###########################################################

## Structure par défaut du système de fichiers
# Mon PC C:bin/ (tout les exécutable dans le PATH pointe vers se dossiers) 
#        C:Documents/Documents personnels : Administratif, Finances(Banque/Impôts/Assurances), Santé, Logement, Formation et Éducation
#        C:Documents/Documents professionnels/Emploi actuel: Contrats, Fiches de paie, Formations, Évaluations
#                                            /Développement professionnel: Certifications, Formations externes
#                                            /Recherche d'emploi: CV et lettres de motivation, Candidatures
#                                            /Propositions d'embauche
#        C:Vidéos/Films:Par genre
#                /Séries TV:Par série/Par saison
#                /Vidéos personnelles: Par année,Par événement
#        C:temp/ (centralise les dossiers à supprimer avec une tache planifier qui passe tout les X temps pour le vider)
#                (temps que le dossier est présent, conservation des anciennes configuration pour backup)

# Synchronisation
# Dans le dossier vidéos, à chaque fois que j'y placerais un fichier .torrent, il serra consommé par l'API Alldebrid, telechargera le contenu qui serra placé au bon endroit 

# Autocomplétion
# Vous pouvez créer vos propres modules d'autocomplétion pour des commandes spécifiques en utilisant Register-ArgumentCompleter.
#


########################## Analyse fonctionnel #######################################################

# Lors de l'initialisation de ce "module", fournir une structure par défaut celle en haut
# sinon offrir la possibilité de changer la structure 
# Gérer fichiers dossiers: New-Item, Remove-Item, Copy-Item, Move-Item


# Initialize-Workspace

# Workspace -List 

################################################################################
# Permet de pouvoir automatiquement maper les dossiers en theme et sous sous theme
#
#
##################################################################################

################## 
# Un thémes doit être unique dans son théme racine. Cela crée le repertoire en même temps
# Set-WorkspacePath -Theme "Documents" -Path "D:\Users\Francois" -> D:\Users\Francois\Documents
#                   -RootTheme "Documents" -Theme "Dossiers pro" -> D:\Users\Francois\Documents\Dossiers pro
##################

#############################################################
# Repertorie le path avec tout les sous theme et sous sous theme du theme avec les paths
# Get-WorkspaceInfo -Theme "Documents" 
#
#############################################################

# Open-Workspace -Theme "Documents"

# Copy-WorkspaceContent -SourceTheme  "Documents" -SourceName "Dossier/Sous Dossier" -DestinationTheme "Videos" -DestinationName="Dossier/Sous Dossier"
# Copy-WorkspaceContent -SourceTheme  "Documents" -DestinationTheme "Videos"
# Copy-WorkspaceContent -SourceTheme  "Documents" -Name "Dossier/Sous Dossier" -DestinationPath "E:/backup"
# Copy-WorkspaceContent -SourceTheme  "Documents" -Name "Dossier/Sous Dossier" 
# Copy-WorkspaceContent -SourcePath "E:/backup"   -DestinationName  "Documents" -Name "Dossier/Sous Dossier"

# Get-WorkspaceContent -Theme "Documents" -Name "Dossier/Sous Dossier"
# Get-WorkspaceContent -Theme "Documents" 


# New-WorkspaceItem -Theme "Documents"  -Name "Nouveau Dossier" -IsTheme (ne dois pas fonctionner pour 'Nouveau Dossier/Sous Dossier')
# New-WorkspaceItem -Theme "Documents"  -Name "Nouveau Dossier/Sous Dossier" -IsFolder
# New-WorkspaceItem -Theme "Documents"  -Name "Nouveau Dossier/doc.csv" -IsFile

# Remove-WorkspaceItem -Theme "Documents"  -Name "Dossier/Sous Dossier/fichier.txt"  

# Move-WorkspaceItem -SourceTheme = "Document" -Name "Dossier/Sous Dossier" -DestinationTheme "Videos"

# Invoke-WorkspaceCleanup




#########################################################################################
#                                                                                        
# Synchronisation: Synchronisation avec les espaces de stockage en ligne, clouds......    
#  Prérequie: ....
#                                                                       
#########################################################################################s

# Prévoire: 
#      Que se passe t'il si je supprime un fichier de google drive ou de mon pc ? 
#                          - Option:Resync (false, true)
#      Fournir l'option de toujours resync certains dossiers spécifiques (fiche d'impôt, dossier administratif....)
#   
#      Si resync est à false, pouvoir sync un dossiers, contenu spécifique 

#
# Planification du nettoyage
# $trigger = New-JobTrigger -Weekly -DaysOfWeek Sunday -At 3am
# Register-ScheduledJob -Name "CleanupTemp" -ScriptBlock { Invoke-WorkspaceCleanup } -Trigger $trigger
#