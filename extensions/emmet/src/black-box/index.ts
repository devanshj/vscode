import { getEmmetSyntaxType } from "../util";
import { getEmmetConfigs } from "../emmetExternalConfigs";

/**
 * I HAVE NO IDEA WHERE ALL THIS CAME FROM???
 */

const htmlAbbreviationStartRegex = /^[a-z,A-Z,!,(,[,#,\.]/;
const cssAbbreviationRegex = /^-?[a-z,A-Z,!,@,#]/;
const htmlAbbreviationRegex = /[a-z,A-Z\.]/;
const htmlData = {
    "tags": [
        "body","head","html",
        "address","blockquote","dd","div","section","article","aside","header","footer","nav","menu","dl","dt","fieldset","form","frame","frameset","h1","h2","h3","h4","h5","h6","iframe","noframes","object","ol","p","ul","applet","center","dir","hr","pre",
        "a","abbr","acronym","area","b","base","basefont","bdo","big","br","button","caption","cite","code","col","colgroup","del","dfn","em","font","head","html","i","img","input","ins","isindex","kbd","label","legend","li","link","map","meta","noscript","optgroup","option","param","q","s","samp","script","select","small","span","strike","strong","style","sub","sup","table","tbody","td","textarea","tfoot","th","thead","title","tr","tt","u","var",
        "canvas", "main", "figure", "plaintext"
    ]
}
const commonlyUsedTags = [...htmlData.tags, 'lorem'];
const propertyHexColorRegex = /^[a-zA-Z]+:?#[\d.a-fA-F]{0,6}$/;
const hexColorRegex = /^#[\d,a-f,A-F]{1,6}$/;

/**
 * Returns a boolean denoting validity of given abbreviation in the context of given syntax
 * Not needed once https://github.com/emmetio/atom-plugin/issues/22 is fixed
 * @param syntax string
 * @param abbreviation string
 */
export function isAbbreviationValid(syntax: string, abbreviation: string): boolean {
	if (!abbreviation) {
		return false;
	}
	if (isStyleSheet(syntax)) {
		// Fix for https://github.com/Microsoft/vscode/issues/1623 in new emmet
		if (abbreviation.endsWith(':')) {
			return false;
		}
		if (abbreviation.indexOf('#') > -1) {
			return hexColorRegex.test(abbreviation) || propertyHexColorRegex.test(abbreviation);
		}
		return cssAbbreviationRegex.test(abbreviation);
	}
	if (abbreviation.startsWith('!')) {
		return !/[^!]/.test(abbreviation);
	}

	const multipleMatch = abbreviation.match(/\*(\d+)$/)
	if (multipleMatch) {
		return parseInt(multipleMatch[1], 10) <= 100
	}
	// Its common for users to type (sometextinsidebrackets), this should not be treated as an abbreviation
	// Grouping in abbreviation is valid only if it's inside a text node or preceeded/succeeded with one of the symbols for nesting, sibling, repeater or climb up
	if ((/\(/.test(abbreviation) || /\)/.test(abbreviation)) && !/\{[^\}\{]*[\(\)]+[^\}\{]*\}(?:[>\+\*\^]|$)/.test(abbreviation) && !/\(.*\)[>\+\*\^]/.test(abbreviation) && !/[>\+\*\^]\(.*\)/.test(abbreviation)) {
		return false;
	}

	return (htmlAbbreviationStartRegex.test(abbreviation) && htmlAbbreviationRegex.test(abbreviation));
}

const markupSnippetKeys = (syntax: string) =>
	getEmmetSyntaxType(syntax) === "markup"
		? Object.keys(
			(getEmmetConfigs().snippetsJson[syntax] || { snippets: {} }).snippets || {}
		)
		: []

export function isExpandedTextNoise(syntax: string, abbreviation: string, expandedText: string): boolean {
	// Unresolved css abbreviations get expanded to a blank property value
	// Eg: abc -> abc: ; or abc:d -> abc: d; which is noise if it gets suggested for every word typed
	if (isStyleSheet(syntax)) {
		let after = (syntax === 'sass' || syntax === 'stylus') ? '' : ';';
		return expandedText === `${abbreviation}: \${1}${after}` || expandedText.replace(/\s/g, '') === abbreviation.replace(/\s/g, '') + after;
	}

	if (commonlyUsedTags.indexOf(abbreviation.toLowerCase()) > -1 || markupSnippetKeys(syntax).indexOf(abbreviation) > -1) {
		return false;
	}

	// Custom tags can have - or :
	if (/[-,:]/.test(abbreviation) && !/--|::/.test(abbreviation) && !abbreviation.endsWith(':')) {
		return false;
	}

	// Its common for users to type some text and end it with period, this should not be treated as an abbreviation
	// Else it becomes noise.

	// When user just types '.', return the expansion
	// Otherwise emmet loses change to participate later
	// For example in `.foo`. See https://github.com/Microsoft/vscode/issues/66013
	if (abbreviation === '.') {
		return false;
	}

	const dotMatches = abbreviation.match(/^([a-z,A-Z,\d]*)\.$/)
	if (dotMatches) {
		// Valid html tags such as `div.`
		if (dotMatches[1] && htmlData.tags.includes(dotMatches[1])) {
			return false
		}
		return true;
	}

	// Unresolved html abbreviations get expanded as if it were a tag
	// Eg: abc -> <abc></abc> which is noise if it gets suggested for every word typed
	return (expandedText.toLowerCase() === `<${abbreviation.toLowerCase()}>\${1}</${abbreviation.toLowerCase()}>`);
}

function isStyleSheet(syntax: string): boolean {
	let stylesheetSyntaxes = ['css', 'scss', 'sass', 'less', 'stylus'];
	return (stylesheetSyntaxes.indexOf(syntax) > -1);
}
