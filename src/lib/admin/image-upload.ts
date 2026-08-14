export const DEFAULT_ADMIN_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

export function validateAdminImageFile(
  file: File,
  maxBytes: number,
  allowedTypes: readonly string[] = DEFAULT_ADMIN_IMAGE_TYPES,
) {
  if (!file.size) return "Vui lòng chọn ảnh.";
  if (!allowedTypes.includes(file.type)) return "Tệp đã chọn không phải hình ảnh được hỗ trợ.";
  if (file.size > maxBytes) return `Ảnh không được vượt quá ${formatFileSize(maxBytes)}.`;
  return null;
}

export function buildAdminImagePath(
  file: File,
  folder: string,
  createId: () => string = () => crypto.randomUUID(),
) {
  const normalizedFolder = folder.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "uploads";
  const extension = extensionByMimeType[file.type] ?? "jpg";
  return `admin/${normalizedFolder}/${createId()}.${extension}`;
}

function formatFileSize(bytes: number) {
  if (bytes >= 1024 * 1024 && bytes % (1024 * 1024) === 0) return `${bytes / (1024 * 1024)} MB`;
  if (bytes >= 1024 && bytes % 1024 === 0) return `${bytes / 1024} KB`;
  return `${bytes} byte`;
}
