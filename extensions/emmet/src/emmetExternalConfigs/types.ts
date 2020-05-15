/**
 * @see https://docs.emmet.io/customization/snippets/
 */
export type SnippetsJson = {
	[syntax: string]: undefined | {
		/**
		 * for old emmet it is Record<string, string | EmmetAbbreviation>
		 * but for new emmet it is Record<string, EmmetAbbreviation>
		 * so we have to detect if something is not an abbreviation the snippet should expand as it is
		 * to do this we can wrap it with {} and it becomes an abbreviation
		 */
		snippets?: Record<string, string | EmmetAbbreviation>,
		filters?: NonNullable<SyntaxProfilesJson[string]>["filters"],
		extends?: Syntax
	}
};


/**
 * @see https://docs.emmet.io/customization/syntax-profiles/
 */
export type SyntaxProfilesJson = {
	[syntax: string]: undefined | {

		/**
		* case of generated tag name, string. Possible values are upper, lower and asis.
		*/
		tag_case?: "upper" | "lower" | "asis",

		/**
		 * case of attribute names of generated tags, string. Possible values are upper, lower and asis.
		 */
		attr_case?:  "upper" | "lower" | "asis",

		/**
		 * quotes around attribute values, string. Possible values are single and double.
		 */
		attr_quotes?: "single" | "double",

		/**
		 * output each tag on new line with indentation, boolean. Values are true (each tag on new line), false (no formatting) and 'decide' (string; only block-level elements on new lines).
		 */
		tag_nl?: boolean | "decide",

		/**
		 * with tag_nl set to true, defines whether leaf block-level node (e.g. node with no children) should have formatted line breaks inside.
		 */
		tag_nl_leaf?: boolean,

		/**
		 * indent tags on new lines, boolean.
		 */
		indent?: boolean,

		/**
		 * how many inline elements are needed to force line break, number. The default value is 3. For example, span*2 will be expanded into <span></span><span></span>, but span*3 will create three <span> elements, each on a new line. Set this option to 0 to disable line breaks for inline elements.
		 */
		inline_break?: number,

		/**
		 * should empty elements—like br or img—be outputted with closing dash, boolean. Values are true, false and 'xhtml' (string; output closing slash in XHTML style, e.g. <br />).
		 */
		self_closing_tag?: boolean | "xhtml",

		/**
		 * list of filters (comma seperated) to be applied automatically.
		 * allowed filters are: haml, html, e (escape), c (comment tags), xsl, s (single line), t (trim line markers)
		 * @see https://docs.emmet.io/filters/
		 */
		filters?: string
	}
};

/**
 * @example html, css, scss
 */
type Syntax = string;

/**
 * Unexpanded emmet abbreviation
 * @example ul>li*3
 */
type EmmetAbbreviation = string