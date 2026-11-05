import { generateLlms } from "../../../ui/src/llms";
export const dynamic = "force-dynamic";
export function GET() { return new Response(generateLlms(), { headers: { "Content-Type": "text/plain; charset=utf-8" } }); }
