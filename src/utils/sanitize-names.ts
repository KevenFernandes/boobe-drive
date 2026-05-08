import path from "node:path";
import crypto from "crypto";

// Achar nome melhor
export function generateSlug(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");

  const sufix = crypto.randomBytes(4).toString("hex");

  return `${slug}-${sufix}`;
}

// Achar nome melhor
export function generateFileName(fileName: string): string {
  const ext = path.extname(fileName);
  const nameWithoutExt = path.parse(fileName).name;

  const sanitizedFilName = generateSlug(nameWithoutExt);

  return `${sanitizedFilName}-${ext}`;
}
