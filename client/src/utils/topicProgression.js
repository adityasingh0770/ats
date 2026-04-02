/** Linear curriculum: complete 50% of a topic's shapes to unlock the next topic. */
export const TOPIC_ORDER = ['perimeter', 'area', 'surface_area', 'volume'];

export const SHAPES_BY_TOPIC = {
  perimeter: ['square', 'rectangle', 'circle'],
  area: ['square', 'rectangle', 'circle'],
  surface_area: ['cube', 'cuboid', 'cylinder'],
  volume: ['cube', 'cuboid', 'cylinder'],
};

/** Mastery score that counts a shape as "done" (student has completed ≥1 session) */
export const SUBTOPIC_DONE_THRESHOLD = 0.10;

/** Minimum shapes that must be done (50% rounded up) to unlock the next topic */
export function subtopicsNeededForNext(topic) {
  const shapes = SHAPES_BY_TOPIC[topic];
  return Math.ceil((shapes?.length ?? 0) * 0.5);
}

/** How many shapes in a topic the student has completed */
export function completedSubtopicCount(conceptProgress, topic) {
  const shapes = SHAPES_BY_TOPIC[topic];
  const prog = conceptProgress?.[topic];
  if (!shapes || !prog) return 0;
  return shapes.filter((s) => (prog[s]?.score ?? 0) >= SUBTOPIC_DONE_THRESHOLD).length;
}

/** True when ≥50% of the topic's shapes are done */
export function isTopicComplete(conceptProgress, topic) {
  return completedSubtopicCount(conceptProgress, topic) >= subtopicsNeededForNext(topic);
}

/** Index of the last topic that is unlocked (0 = only perimeter). */
export function getLastUnlockedTopicIndex(conceptProgress) {
  if (!conceptProgress) return 0;
  let last = 0;
  for (let i = 1; i < TOPIC_ORDER.length; i++) {
    const prev = TOPIC_ORDER[i - 1];
    if (isTopicComplete(conceptProgress, prev)) last = i;
    else break;
  }
  return last;
}

export function isTopicUnlocked(conceptProgress, topic) {
  const idx = TOPIC_ORDER.indexOf(topic);
  if (idx < 0) return false;
  return idx <= getLastUnlockedTopicIndex(conceptProgress);
}

export function unlockHintForTopic(topic) {
  const idx = TOPIC_ORDER.indexOf(topic);
  if (idx <= 0) return null;
  const prevTopic = TOPIC_ORDER[idx - 1];
  const needed = subtopicsNeededForNext(prevTopic);
  const total = SHAPES_BY_TOPIC[prevTopic].length;
  return `Complete ${needed}/${total} shapes in ${formatTopicLabel(prevTopic)} to unlock this topic.`;
}

function formatTopicLabel(t) {
  return String(t).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
