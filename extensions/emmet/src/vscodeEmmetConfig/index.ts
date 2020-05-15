import * as vscode from 'vscode';
import { SyntaxProfilesJson } from '../emmetExternalConfigs';
import { Config } from 'emmet';
import { EmmetOldPreferences } from './oldEmmetPreferences';

export type VscodeEmmetConfiguration = {
    "excludeLanguages"?: string[],
    "extensionsPath"?: string,
    "includeLanguages"?: { [key: string]: string },
    "optimizeStylesheetParsing"?: boolean,
    "preferences"?: EmmetOldPreferences & Config["options"],
    "showAbbreviationSuggestions"?: boolean,
	"showExpandedAbbreviation"?:
		| "always"
    	| "inMarkupAndStylesheetFilesOnly"
    	| "never"
    "showSuggestionsAsSnippets"?: boolean,
    "syntaxProfiles"?: SyntaxProfilesJson,
    "triggerExpansionOnTab"?: boolean,
	"variables"?: { [variable: string]: string }
}
