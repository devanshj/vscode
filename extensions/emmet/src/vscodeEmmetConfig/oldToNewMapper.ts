import { EmmetOldPreferences } from "./oldEmmetPreferences";
import { Config } from "emmet";
import { SyntaxProfilesJson } from "../emmetExternalConfigs";


const parseList = (s: string) =>
	s.split(",");

const parseMap = (s: string) =>
	s.split(",")
	.reduce((map, x) => {
		let [k, v] = x.split(":");
		map[k] = v;
		return map;
	}, {} as { [_: string]: string })

export const oldToNewMap: {
	preferences: MapFor<EmmetOldPreferences>,
	syntaxProfiles: MapFor<NonNullable<SyntaxProfilesJson[keyof SyntaxProfilesJson]>>
} = {
	preferences: {
		"bem.elementSeparator": "bem.element",
		"bem.modifierSeparator": "bem.modifier",
		"bem.shortElementPrefix": null,
		"caniuse.enabled": null,
		"caniuse.era": null,
		"caniuse.vendors": null,
		"css.alignVendor": null,
		"css.autoInsertVendorPrefixes": null,
		"css.closeBraceIndentation": null,
		"css.color.case": null,
		"css.color.short": "stylesheet.shortHex",
		"css.floatUnit": "stylesheet.floatUnit",
		"css.fuzzySearch": null,
		"css.fuzzySearchMinScore": "stylesheet.fuzzySearchMinScore",
		"css.gradient.defaultProperty": null,
		"css.gradient.fallback": null,
		"css.gradient.oldWebkit": null,
		"css.gradient.omitDefaultDirection": null,
		"css.gradient.prefixes": null,
		"css.intUnit": "stylesheet.intUnit",
		"css.keywordAliases": null,
		"css.keywords": ["stylesheet.keywords", parseList],
		"css.mozProperties": null,
		"css.mozPropertiesAddon": null,
		"css.msProperties": null,
		"css.msPropertiesAddon": null,
		"css.oProperties": null,
		"css.oPropertiesAddon": null,
		"css.propertyEnd": "stylesheet.after",
		"css.reflect.oldIEOpacity": null,
		"css.syntaxes": null,
		"css.unitAliases": ["stylesheet.unitAliases", parseMap],
		"css.unitlessProperties": ["stylesheet.unitless", parseList],
		"css.valueSeparator": "stylesheet.between",
		"css.webkitProperties": null,
		"css.webkitPropertiesAddon": null,
		"filter.commentAfter": "comment.after",
		"filter.commentBefore": "comment.before",
		"filter.commentTrigger": ["comment.trigger", parseList],
		"filter.trimRegexp": null,
		"format.forceIndentationForTags": ["output.formatForce", parseList],
		"format.noIndentTags": ["inlineElements", parseList],
		"href.autodetect": null,
		"href.emailPattern": null,
		"href.urlPattern": null,
		"less.autoInsertVendorPrefixes": null,
		"lorem.defaultLang": null,
		"lorem.omitCommonPart": null,
		"profile.allowCompactBoolean": "output.compactBoolean",
		"profile.booleanAttributes": ["output.booleanAttributes", parseList],
		"sass.autoInsertVendorPrefixes": null,
		"sass.propertyEnd": "stylesheet.after",
		"scss.autoInsertVendorPrefixes": null,
		"slim.attributesWrapper": null,
		"stylus.autoInsertVendorPrefixes": null,
		"stylus.propertyEnd": "stylesheet.after",
		"stylus.valueSeparator": "stylesheet.between"
	},
	syntaxProfiles: {
		attr_case: ["output.attributeCase", s => s === "asis" ? "" : s],
		attr_quotes: "output.attributeQuotes",
		filters: null,
		indent: null,
		inline_break: "output.inlineBreak",
		self_closing_tag: [
			"output.selfClosingStyle",
			s =>
				s === "xhtml" ? "xhtml" :
				s === true ? "xml" :
				s === false ? "html" :
				"html"
		],
		tag_case: ["output.tagCase", s => s === "asis" ? "" : s],
		tag_nl: null,
		tag_nl_leaf: "output.formatLeafNode"
	}
};

/*
type OldToNewMap = typeof oldToNewMap;
type UnusedNewProp = Exclude<keyof Config["options"], {
	[K in keyof OldToNewMap]:
		OldToNewMap[K] extends readonly [any, any] ? OldToNewMap[K][0] :
		OldToNewMap[K] extends string ? OldToNewMap[K] :
		never
}[keyof OldToNewMap]>;
*/

type MapFor<Old extends object> = Required<{
	[oldProp in keyof Old]:
		| keyof FilterWithValue<Config["options"], Old[oldProp]>
		| {
			[newProp in keyof Config["options"]]: [
				newProp,
				(oldValue: NonNullable<Old[oldProp]>) =>
					Config["options"][newProp]
			]
		}[keyof Config["options"]]
		| null
}>


type FilterWithValue<O, V> = Pick<O, {
	[K in keyof O]:
		O[K] extends V
			? K
			: never
}[keyof O]>;