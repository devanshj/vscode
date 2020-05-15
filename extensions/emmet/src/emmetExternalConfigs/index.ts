import readEmmetConfigs from "./readEmmetConfigs";
import * as path from "path";
import { SnippetsJson, SyntaxProfilesJson } from "./types";

const configCache = {
	snippetsJson: {} as SnippetsJson,
	syntaxProfilesJson: {} as SyntaxProfilesJson
}

export const setEmmetExtensionsPath = (extensionsPath: string, workspacePath?: string) =>
	readEmmetConfigs(
		toConfigDir(extensionsPath, workspacePath)
	).then(newConfig => {
		configCache.snippetsJson = newConfig.snippetsJson;
		configCache.syntaxProfilesJson = newConfig.syntaxProfilesJson;
	});

const toConfigDir = (extensionsPath: string, workspacePath?: string) => {
	if (path.isAbsolute(extensionsPath)) return extensionsPath;
	if (workspacePath !== undefined) return path.join(extensionsPath, workspacePath);
	throw (
		"The path provided in emmet.extensionsPath setting " +
		"should be absolute path or " +
		"should be relative to opened workspace"
	);
}

export const getEmmetConfigs = () =>
	configCache as Readonly<typeof configCache>

export * from "./types";