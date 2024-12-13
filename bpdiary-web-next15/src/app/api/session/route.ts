import { headers } from "next/headers";
import { api } from "~/trpc/server";

export async function GET(request: Request) {
  const sessionToken = (await headers()).get("authjs.session-token") ?? "";
  const valid = await api.session.validate({ sessionToken });
  return Response.json(valid);
}
