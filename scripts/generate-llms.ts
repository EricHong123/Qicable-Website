import { mkdir, writeFile } from "node:fs/promises";
import { generateLlms } from "../ui/src/llms";

async function main() {
  await mkdir("preview/public", { recursive: true });
  await writeFile("preview/public/llms.txt", generateLlms());
}
main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
