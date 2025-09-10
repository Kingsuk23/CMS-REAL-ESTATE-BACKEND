export const MAX_SIZE_BY_TYPE: Record<string, number> = {
  'image/png': 2 * 1024 * 1024, // 2 MB
  'image/jpeg': 2 * 1024 * 1024, // 2 MB
  'video/mp4': 2048 * 1024 * 1024, // 50 MB
  'video/matroska': 2048 * 1024 * 1024,
  'video/ogg': 2048 * 1024 * 1024,
  'video/webm': 2048 * 1024 * 1024,
};
