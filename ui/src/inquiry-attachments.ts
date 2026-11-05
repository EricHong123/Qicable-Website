export const attachmentPolicy = {
  maxFiles: 3,
  maxBytes: 20 * 1024 * 1024,
  accept: ".pdf,.jpg,.jpeg,.png,.step,.stp,.zip",
} as const;

export type AttachmentIssue =
  | "fileCount"
  | "fileSize"
  | "fileType"
  | "fileEmpty"
  | "fileName";
type FileInfo = Pick<File, "name" | "size">;

// Browser checks are for feedback. The server independently checks file content.
export function validateAttachments(
  files: readonly FileInfo[],
): AttachmentIssue | null {
  if (files.length > attachmentPolicy.maxFiles) return "fileCount";
  for (const file of files) {
    if (!/\.(pdf|jpe?g|png|step|stp|zip)$/i.test(file.name)) return "fileType";
    if (file.size === 0) return "fileEmpty";
    if (file.size > attachmentPolicy.maxBytes) return "fileSize";
    if (new TextEncoder().encode(file.name).length > 180) return "fileName";
  }
  return null;
}

export async function attachmentFingerprint(files: readonly File[]) {
  return Promise.all(
    files.map(async (file) => ({
      name: file.name,
      size: file.size,
      sha256: Array.from(
        new Uint8Array(
          await crypto.subtle.digest("SHA-256", await file.arrayBuffer()),
        ),
      )
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(""),
    })),
  );
}
