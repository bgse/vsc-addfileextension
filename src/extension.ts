// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "addfileextension" was loaded.'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var addFileCommand = vscode.commands.registerCommand('addfileextension.addFile', () => {
		// The code you place here will be executed every time your command is executed

		// Refuse to work when rootPath is undefined (no folder is open)
		if(vscode.workspace.rootPath == undefined){
			vscode.window.showErrorMessage("Please open a folder first.");
			return;
		}

		// Prompt the user for a path
		vscode.window.showInputBox({prompt: "Provide file path relative to project folder."}).then(function(psPath: string){
			
			// Refuse to work if user input ends with a path separator
			// Check both variants here, since we advertise windows users can use unix separators
			if(psPath.endsWith('\\') || psPath.endsWith('/')){
				vscode.window.showErrorMessage("Creating directories is not supported at this time, please specify a file.");
				return;
			}
			
			// Add leading path separator if necessary
			if(!psPath.startsWith(path.sep)){
				psPath = path.sep + psPath;
			}
			
			// Add workspace folder to path
			let lsFullpath: string = vscode.workspace.rootPath + psPath;
			
			// Correct path separators to platform default
			// Allow windows users to use unix-like separators too
			lsFullpath = path.normalize(lsFullpath.replace(/\//g, path.sep));
			
			
			vscode.workspace.openTextDocument(vscode.Uri.parse("untitled:" + lsFullpath)).then(function(poDocument: vscode.TextDocument){
				vscode.window.showTextDocument(poDocument).then(function(poEditor: vscode.TextEditor){
					//
				}, function(reason: any){
					vscode.window.showErrorMessage("Could not bring up editor: " + reason);
				});
			}, function(reason: any){
				vscode.window.showErrorMessage("Could not open file: " + reason);
			});
		},function(reason: any){
			vscode.window.showErrorMessage("Could not open InputBox: " + reason);
		});
	});
	
	context.subscriptions.push(addFileCommand);
}