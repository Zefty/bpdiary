import { z } from "zod";

export const DEPLOYMENT_ENV = z
	.enum(["development", "staging", "production"])
	.default("development");
