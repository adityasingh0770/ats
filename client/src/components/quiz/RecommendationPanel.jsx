import { motion } from 'framer-motion';
import { Sparkles, ExternalLink } from 'lucide-react';

/**
 * Displays the recommendation returned by the course Recommendation API.
 * If the recommendation type is "prerequisite" and a URL is provided,
 * shows a link for the student to review prerequisite material.
 */
export default function RecommendationPanel({ recommendation, loading }) {
  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="card bg-blue-50 border-blue-200 py-4 px-4 text-center text-xs text-blue-600">
        Fetching recommendation from the portal...
      </motion.div>
    );
  }

  if (!recommendation) return null;

  // Portal shape: { recommendation: { type, reason, next_steps, prerequisite_url? }, learning_state, ... }
  const inner =
    recommendation.recommendation &&
    typeof recommendation.recommendation === 'object'
      ? recommendation.recommendation
      : null;

  const reasonText =
    (typeof recommendation.recommendation === 'string' && recommendation.recommendation) ||
    inner?.reason ||
    recommendation.message ||
    recommendation.detail ||
    '';

  const nextSteps = Array.isArray(inner?.next_steps) ? inner.next_steps : [];

  const isPrerequisite =
    inner?.type === 'prerequisite' && Boolean(inner?.prerequisite_url);

  const prerequisiteUrl = inner?.prerequisite_url;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card bg-indigo-50 border-indigo-200 space-y-3 py-4 px-4"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
          <Sparkles className="w-4 h-4 text-indigo-600" />
        </div>
        <h3 className="text-xs font-bold text-indigo-900">Portal Recommendation</h3>
      </div>

      {recommendation.learning_state && (
        <p className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wide">
          Learning state: {recommendation.learning_state}
        </p>
      )}

      {reasonText ? (
        <p className="text-sm text-indigo-800 leading-relaxed">{reasonText}</p>
      ) : (
        <p className="text-sm text-indigo-800 leading-relaxed">No summary text from the portal.</p>
      )}

      {nextSteps.length > 0 && (
        <ul className="list-disc list-inside text-xs text-indigo-800 space-y-1">
          {nextSteps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ul>
      )}

      {isPrerequisite && (
        <a
          href={prerequisiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Review prerequisite material
        </a>
      )}
    </motion.div>
  );
}
