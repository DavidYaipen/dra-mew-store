export function isForeignKeyViolation(error: { code?: string } | null): boolean {
  return error?.code === '23503';
}
