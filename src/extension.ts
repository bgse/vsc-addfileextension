// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { workspace, window, Uri } from 'vscode';
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

		// Get file path from active document, if there is one. There are 3 cases where there can be
		// an activeTextEditor, but it's not a valid one for our purposes:
		// 1) A non-editor pane (eg markdown preview). Here activeTextEditor.document will be null.
		// 2) Default settings or keyboard shortcuts. These panes have the uri scheme: 'vscode'.
		// 3) A new, unsaved, untitled document. These have no valid filename, simply Untitled-[X] 
		// (though it may differ in other languages, so we test for the absence of slashes).
		// In all these cases we treat it as there being no active document.
		const activeDocumentUri: Uri = window.activeTextEditor && 
			window.activeTextEditor.document && window.activeTextEditor.document.uri;
		const activeFilePath: string = activeDocumentUri && activeDocumentUri.scheme !== 'vscode' 
			&& activeDocumentUri.fsPath.match(/\/|\\/) && activeDocumentUri.fsPath;

		// If we have no workspace nor valid file open, fall back on the built-in new file command
		if(!workspace.rootPath && !activeFilePath){
			return vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
		}

		// Select a prompt based on the 3 allowed states re: workspace root and active document
		const placeHolder = 
			workspace.rootPath && !activeFilePath ?
				"provide a file name relative to the project folder" :
			!workspace.rootPath && activeFilePath ?
				`provide a file name relative to '${path.basename(activeFilePath)}'` :
			// both available
				`provide a file name relative to '${path.basename(activeFilePath)}' `
				+ `(or begin '/' for a path relative to the project folder)`;
		const prompt = "Add New File...";
		
		// Prompt the user for a path
		return window.showInputBox({placeHolder, prompt}).then(function(psPath: string){
			// If esc was pressed, do nothing
			if(psPath === undefined){
				return;
			}
			
			// If no text provided, fall back on the built-in new file command
			if(psPath === ""){
				return vscode.commands.executeCommand('workbench.action.files.newUntitledFile');
			}
			
			// Input must be a valid filename (this could probably be improved)
			if(psPath.match(/^[.\/\\]+$/)){
				return window.showErrorMessage("You must provide a valid file name.");
			}
			
			// Refuse to work if user input ends with a path separator
			// Check both variants here, since we advertise windows users can use unix separators
			if(psPath.endsWith('\\') || psPath.endsWith('/')){
				return window.showErrorMessage("Creating directories is not supported at this time, please specify a file.");
			}
			
			// If given path begins with slash, use project root path (if a folder is open)
			const beginsWithSlash = psPath.match(/^\/|\\/);
			if(beginsWithSlash && !workspace.rootPath){
				return window.showErrorMessage("Paths beginnning with '/' not allowed when no project folder is open");
			}
			// Now we need to remove the slash, otherwise the psPath will be treated as an absolute path
			psPath = beginsWithSlash ? psPath.substr(1) : psPath;

			const basePath: string = activeFilePath && !beginsWithSlash ?
				path.dirname(activeFilePath) : workspace.rootPath
	
			// path.resolve takes care of normalization and platform path separators
			const lsFullpath: string = path.resolve(basePath, psPath);

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