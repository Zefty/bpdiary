import { createServerOnlyFn } from "@tanstack/react-start";
import { pgSchema } from "drizzle-orm/pg-core";
import { serverEnv } from "@/server/lib/serverEnv";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM.
 * Use the same database instance for multiple projects.
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// We might need this if frontend breaks with drizzle. Not sure yet
// const getEnvironment = createIsomorphicFn()
// 	.server(() => {
// 		return serverEnv.DEPLOYMENT_ENV;
// 	})
// 	.client(() => {
// 		return clientEnv.VITE_DEPLOYMENT_ENV;
// 	});
const getEnvironment = createServerOnlyFn(() => {
	return serverEnv.DEPLOYMENT_ENV;
});
const raiseError = (message: string): never => {
	throw new Error(message);
};

/**
 * Setup project schema
 */
const projectName = "bpdiary";
export const envSchema = pgSchema(
	`${projectName}_${
		getEnvironment() || raiseError("DEPLOYMENT_ENV is not set!")
	}`,
);

/**
 * Custom table names with project prefix
 */
type TableFn = typeof envSchema.table;
export const pgTableCreatorWithSchema = (
	customiseTableName: (name: string) => string,
) => {
	const pgTable: TableFn = (...args) => {
		const [name, ...rest] = args;
		// @ts-expect-error TS cannot infer overload-safe spread here
		return envSchema.table(customiseTableName(name), ...rest);
	};
	pgTable.withRLS = (...args) => {
		const [name, ...rest] = args;
		// @ts-expect-error TS cannot infer overload-safe spread here
		return envSchema.table.withRLS(customiseTableName(name), ...rest);
	};
	return pgTable;
};
export const createTable = pgTableCreatorWithSchema(
	(name) => `${projectName}_${name}`,
);

/**
 * Custom view names with project prefix
 */
export const createView = (name: string) =>
	envSchema.view(`${projectName}_${name}`);

export const createMaterializedView = (name: string) =>
	envSchema.materializedView(`${projectName}_${name}`);

/**
 * Custom enum names with project prefix
 */
type PgEnum = typeof envSchema.enum;
const pgEnumCreatorWithSchema = (
	customiseEnumName: (name: string) => string,
) => {
	const pgEnum: PgEnum = (...args: Parameters<PgEnum>) => {
		const [enumName, ...rest] = args;
		return envSchema.enum(customiseEnumName(enumName), ...rest);
	};
	return pgEnum;
};
export const createEnum = pgEnumCreatorWithSchema(
	(name) => `${projectName}_${name}`,
);
