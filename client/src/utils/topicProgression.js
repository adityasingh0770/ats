/** Linear curriculum: must complete each topic before the next unlocks. */
export const TOPIC_ORDER = ['perimeter', 'area', 'surface_area', 'volume'];

export const SHAPES_BY_TOPIC = {
  perimeter: ['square', 'rectangle', 'circle'],
  area: ['square', 'rectangle', 'circle'],
  surface_area: ['cube', 'cuboid', 'cylinder'],
  volume: ['cube', 'cuboid', 'cylinder'],
};

const AVG_MASTERY_THRESHOLD = 0.38;

/**
 * Topic is "complete" when average mastery across its shapes meets threshold.
 */
export function isTopicComplete(conceptProgress, topic) {
  const shapes = SHAPES_BY_TOPIC[topic];
  const prog = conceptProgress?.[topic];
  if (!shapes?.length || !prog) return false;
  let sum = 0;
  for (const s of shapes) {
    sum += prog[s]?.score ?? 0;
  }
  return sum / shapes.length >= AVG_MASTERY_THRESHOLD;
}

/** Index of last topic that is unlocked (0 = perimeter only). */
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
  const need = TOPIC_ORDER[idx - 1];
  return `Finish ${formatTopicLabel(need)} (raise average mastery across all shapes) to unlock this topic.`;
}

function formatTopicLabel(t) {
  return String(t).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}
