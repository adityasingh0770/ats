/**
 * Merge portal provides JWT via /chapter → POST /api/merge/entry (see ChapterEntryPage).
 * We do not create anonymous guest users — that would show dummy guest_* ids and skip Merge session data.
 */
export default function AuthBootstrap() {
  return null;
}
