"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
;
function activate(context) {
    let runTagDev = vscode.commands.registerCommand('liv-tag-runner.runTagDev', (item) => {
        executeCommand('DEV', item.path);
    });
    context.subscriptions.push(runTagDev);
    let runTagUAT = vscode.commands.registerCommand('liv-tag-runner.runTagUAT', (item) => {
        executeCommand('UAT', item.path);
    });
    context.subscriptions.push(runTagUAT);
}
exports.activate = activate;
/**
 * Executes the command.
 * @param environment Env selected from the user.
 * @param path Path of the lite where the command was activated.
 */
function executeCommand(environment, path) {
    const textEditor = vscode.window.activeTextEditor;
    const tag = textEditor === null || textEditor === void 0 ? void 0 : textEditor.document.getText(textEditor === null || textEditor === void 0 ? void 0 : textEditor.selection);
    const projectName = checkProject(path);
    const terminal = getActiveTerminal();
    if (validateTag(tag)) {
        terminal === null || terminal === void 0 ? void 0 : terminal.show(true);
        if (projectName === "automation-api" /* automationApi */) {
            terminal === null || terminal === void 0 ? void 0 : terminal.sendText(`cucumber -t ${tag} -p ${environment === 'UAT' ? 'local' : 'dev'}`);
        }
        else if (projectName === "automation-pj" /* automationPj */) {
            terminal === null || terminal === void 0 ? void 0 : terminal.sendText(`cucumber -t ${tag} -p ${environment === 'UAT' ? 'lpp' : 'lpp -p dev'}`);
        }
        else if (projectName === "automation-store" /* automationStore */) {
            terminal === null || terminal === void 0 ? void 0 : terminal.sendText(`cucumber -t ${tag} -p ${environment === 'UAT' ? '' : ' dev'}`);
        }
        else if (projectName === "automation-app" /* automationApp */) {
            terminal === null || terminal === void 0 ? void 0 : terminal.sendText(`rake run_ios\\[${tag},1234,1,\\]`);
        }
    }
}
/**
 * Checks if the givin string is a valid tag.
 * @param tag Tag selected by the user.
 */
function validateTag(tag) {
    if (tag.indexOf('@') > -1) {
        return true;
    }
    else {
        vscode.window.showWarningMessage('Texto selecionado não é uma tag válida!');
        return false;
    }
}
/**
 * Checks the project to run the correct cmd parameter.
 * @param path Path of the lite where the command was activated.
 */
function checkProject(path) {
    const foldersName = path.split('/');
    const projects = [
        'automation-api',
        'automation-app',
        'automation-pj',
        'automation-store'
    ];
    const projectName = foldersName.find(folderName => {
        const result = projects.find(project => {
            return project === folderName ? project : false;
        });
        return result ? result : false;
    });
    return projectName;
}
/**
 * Creates a new terminal or fetches the activated terminal.
 * @returns vscode.Terminal
 */
function getActiveTerminal() {
    const occActionsTerminalName = "LTR actions";
    let occActiveTerminal = vscode.window.terminals.find((activeTerm) => {
        return activeTerm.name === occActionsTerminalName ? activeTerm : false;
    });
    if ((occActiveTerminal === null || occActiveTerminal === void 0 ? void 0 : occActiveTerminal.creationOptions.name) === occActionsTerminalName) {
        return occActiveTerminal;
    }
    else {
        return vscode.window.createTerminal(occActionsTerminalName);
    }
}
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map