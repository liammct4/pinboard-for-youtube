import os
import shutil
from misc import TColour

# ---------------------------------------------
# Since "vite build"/"npm run build" deletes everything in /dist,
# including needed assets and the manifest, the files need to copied over
# manually. This script runs after "npm run build" and copies
# the assets folder and manifest.json file to /dist ready to load in Edge. 
# ---------------------------------------------

def get_folder_count(path):
	folders = [x for x in os.listdir(path) if os.path.isdir(os.path.join(path, x))]

	return len(folders)

def get_file_count(path):
	files = [x for x in os.listdir(path) if os.path.isfile(os.path.join(path, x))]

	return len(files)


print(f"\n{TColour.LightBlue}Starting{TColour.Reset} {TColour.Purple}build_release.py{TColour.Reset} {TColour.LightBlue}build...{TColour.Reset}")
print(f"{TColour.Yellow} > Copying assets...{TColour.Reset}")

baseDir = os.getcwd()

# Start copying the assets, images, logo etc.
assets = os.listdir("assets")

for entry in assets:
	path = os.path.join(baseDir, os.path.join("assets", entry))
	newRelative = f"dist\\assets\\{entry}"
	newFull = os.path.join(baseDir, newRelative)

	print(f"	{TColour.Cyan}Copying:{TColour.Reset} {TColour.Grey}{newRelative}{TColour.Reset} to {TColour.Grey}\\assets{TColour.Reset}")

	if os.path.isdir(path):
		shutil.copytree(path, newFull)
	elif os.path.isfile(path):
		shutil.copyfile(path, newFull)

numOfFiles = get_file_count("assets")
numofFolders = get_folder_count("assets")

print(f"   Done copying {TColour.Purple}{numOfFiles}{TColour.Reset} files and {TColour.Purple}{numofFolders}{TColour.Reset} folders.")

# Start copying the content scripts.
print(f"{TColour.Yellow} > Copying content scripts...{TColour.Reset}")

contentScripts = os.listdir("content_scripts")

for entry in contentScripts:
	path = os.path.join(baseDir, os.path.join("content_scripts", entry))
	newRelative = f"dist\\{entry}"
	newFull = os.path.join(baseDir, newRelative)

	print(f"	{TColour.Cyan}Copying:{TColour.Reset} {TColour.Grey}{newRelative}{TColour.Reset} to {TColour.Grey}\\dist{TColour.Reset}")

	shutil.copyfile(path, newFull)

print(f"   Done copying {TColour.Purple}{len(contentScripts)}{TColour.Reset} files.")

# Start copying the manifest file.
print(f"{TColour.Yellow} > Copying manifest...{TColour.Reset}")

manifestPath = os.path.join(baseDir, "manifest.json")
manifestOutputPath = os.path.join(baseDir, "dist\\manifest.json")

print(f"	{TColour.Cyan}Copying:{TColour.Reset} {TColour.LightGrey}manifest.json{TColour.Reset} to {TColour.LightGrey}{manifestOutputPath}{TColour.Reset}")
shutil.copyfile(manifestPath, manifestOutputPath);

print(f"{TColour.Green}Release build successful!{TColour.Reset}")
