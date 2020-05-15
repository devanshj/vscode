import { SnippetsJson, SyntaxProfilesJson } from './types';
import { parse, ParseError, ParseErrorCode } from 'jsonc-parser';
import { join } from 'path'
import { promisify } from 'util';
import { readFile as readFileAsync } from 'fs';


const readEmmetConfigs = async (configDir: string) => ({
	snippetsJson:
		await readJsoncFile('snippets.json', configDir) as SnippetsJson,
	syntaxProfilesJson:
		await readJsoncFile('syntaxProfiles.json', configDir) as SyntaxProfilesJson
});
export default readEmmetConfigs;



const readJsoncFile = (filePath: string, relativePath?: string) =>
	readFile(
		join(filePath, relativePath || ""),
		"utf8"
	).then(parseJsonc);

const readFile = promisify(readFileAsync);

const parseJsonc = (s: string): unknown => {
	let errors = [] as ParseError[];
	let jsonc = parse(s, errors);
	if (errors.length > 0) throw stringifyJsoncError(errors[0]);
	return jsonc;
}

const stringifyJsoncError = ({ error, offset }: ParseError) =>
	`Found error ${{
		[ParseErrorCode.InvalidSymbol]: 'InvalidSymbol',
		[ParseErrorCode.InvalidNumberFormat]: 'InvalidNumberFormat',
		[ParseErrorCode.PropertyNameExpected]: 'PropertyNameExpected',
		[ParseErrorCode.ValueExpected]: 'ValueExpected',
		[ParseErrorCode.ColonExpected]: 'ColonExpected',
		[ParseErrorCode.CommaExpected]: 'CommaExpected',
		[ParseErrorCode.CloseBraceExpected]: 'CloseBraceExpected',
		[ParseErrorCode.CloseBracketExpected]: 'CloseBracketExpected',
		[ParseErrorCode.EndOfFileExpected]: 'EndOfFileExpected',
		[ParseErrorCode.InvalidCommentToken]: 'InvalidCommentToken',
		[ParseErrorCode.UnexpectedEndOfComment]: 'UnexpectedEndOfComment',
		[ParseErrorCode.UnexpectedEndOfString]: 'UnexpectedEndOfString',
		[ParseErrorCode.UnexpectedEndOfNumber]: 'UnexpectedEndOfNumber',
		[ParseErrorCode.InvalidUnicode]: 'InvalidUnicode',
		[ParseErrorCode.InvalidEscapeCharacter]: 'InvalidEscapeCharacter',
		[ParseErrorCode.InvalidCharacter]: 'InvalidCharacter'
	}[error]} at offset ${offset}`