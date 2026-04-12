import { Ruler, Layers, Box, Package, Square, RectangleHorizontal, Circle, Database } from 'lucide-react';

export const classifyMastery = (score) => {
  if (score < 0.40) return 'Explorer';
  if (score <= 0.70) return 'Scholar';
  return 'Legend';
};

export const masteryColor = (score) => {
  if (score < 0.40) return 'text-green-600';
  if (score <= 0.70) return 'text-orange-600';
  return 'text-purple-600';
};

export const masteryBg = (score) => {
  if (score < 0.40) return 'bg-green-500';
  if (score <= 0.70) return 'bg-[#FF6500]';
  return 'bg-purple-500';
};

export const masteryBadgeClass = (level) => {
  if (level === 'Explorer') return 'badge-beginner';
  if (level === 'Scholar')  return 'badge-intermediate';
  return 'badge-advanced';
};

export const difficultyColor = (d) => {
  if (d === 'beginner')     return 'text-green-600';
  if (d === 'intermediate') return 'text-orange-600';
  return 'text-purple-600';
};

const topicIcons  = { perimeter: Ruler, area: Layers, surface_area: Box, volume: Package };
export const topicIcon = (topic) => topicIcons[topic] || Box;

const shapeIcons  = { square: Square, rectangle: RectangleHorizontal, circle: Circle, cube: Box, cuboid: Package, cylinder: Database };
export const shapeIcon = (shape) => shapeIcons[shape] || Square;

export const formatTopicName = (topic) =>
  topic?.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()) || '';

export const formatShapeName = (shape) =>
  shape?.replace(/\b\w/g, c => c.toUpperCase()) || '';

// Per-topic accent color (hex)
export const topicColor = (topic) => {
  const map = { perimeter: '#FF6500', area: '#0D9488', surface_area: '#3B82F6', volume: '#8B5CF6' };
  return map[topic] || '#FF6500';
};
