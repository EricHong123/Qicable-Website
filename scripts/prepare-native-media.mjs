/** Copy only content-addressed media referenced by the approved build snapshot. */
import { readFile, mkdir, realpath, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const snapshot = process.env.QICABLE_CONTENT_SNAPSHOT;
if (snapshot) {
  const content = JSON.parse(await readFile(snapshot, "utf8"));
  const references = new Set();
  function collect(value) {
    if (Array.isArray(value)) return value.forEach(collect);
    if (!value || typeof value !== "object") return;
    if (typeof value.src === "string" && value.src.startsWith("/media/native/")) {
      if (!/^\/media\/native\/[a-f0-9]{64}\/[a-f0-9]{64}\.png$/.test(value.src)) {
        throw new Error("Invalid native media reference");
      }
      references.add(value.src);
    }
    Object.values(value).forEach(collect);
  }
  collect(content);
  if (references.size) {
    const root = process.env.QICABLE_NATIVE_MEDIA_ROOT;
    if (!root || !path.isAbsolute(root) || await realpath(root) !== root) {
      throw new Error("Set QICABLE_NATIVE_MEDIA_ROOT to the canonical approved-media directory");
    }
    for (const reference of references) {
      const source = path.join(root, reference);
      if (await realpath(source) !== source) throw new Error("Native media symlinks are forbidden");
      const bytes = await readFile(source);
      const digest = createHash("sha256").update(bytes).digest("hex");
      if (path.basename(reference) !== `${digest}.png`) throw new Error("Native media digest mismatch");
      const destination = path.join("preview/public", reference);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, bytes);
    }
  }
}
