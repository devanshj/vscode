import * as vscode from 'vscode';
import { extract } from 'emmet';
import { getEmmetSyntaxType } from './util';

export function extractAbbreviationFromDocument(document: vscode.TextDocument, position: vscode.Position, syntax: string) {
	const extracted = extractAbbreviationFromText(
		document
		.lineAt(position).text
		.substring(0, position.character),
		syntax
	);
	if (!extracted) return;

	return {
		abbreviationRange: new vscode.Range(
			position.line,
			extracted.location,
			position.line,
			extracted.location + extracted.abbreviation.length
		),
		abbreviation: extracted.abbreviation
	}
}

export function extractAbbreviationFromText(abbreviation: string, syntax: string) {
	return extract(
		abbreviation,
		abbreviation.length, {
			type: getEmmetSyntaxType(syntax),
			lookAhead: getEmmetSyntaxType(syntax) === "stylesheet",
			prefix: syntax === "jsx" ? "<" : undefined
		}
	);
}
