import React from 'react';
import { Sparkles } from 'lucide-react';
import { TopicSuggestion } from '../types/analysis';

interface TopicSuggestionsProps {
  onSelect: (excerpt: string) => void;
}

export const TopicSuggestions: React.FC<TopicSuggestionsProps> = ({ onSelect }) => {
  const suggestions: TopicSuggestion[] = [
    {
      title: "The Future of Remote Work",
      excerpt: [
        "As we stand at the crossroads of a workplace revolution, remote work has transformed from a temporary solution to a permanent reality.",
        "Companies worldwide are reimagining their organizational structures, embracing digital transformation like never before."
      ],
      category: "Business"
    },
    {
      title: "Sustainable Living in Urban Spaces",
      excerpt: [
        "Picture a city where every rooftop is a garden, every building generates its own power, and communities thrive in harmony with nature.",
        "The urban jungle doesn't have to be a concrete wasteland - it can be a blueprint for sustainable living."
      ],
      category: "Environment"
    },
    {
      title: "The Psychology of Social Media",
      excerpt: [
        "What drives us to share our lives online? The answer lies deeper than you might think.",
        "Behind every like, comment, and share, there's a complex web of psychological triggers shaping our digital behavior."
      ],
      category: "Technology"
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <Sparkles className="w-6 h-6 text-blue-500" />
        <h2 className="text-xl font-semibold">Writing Prompts</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => onSelect(suggestion.excerpt.join('\n\n'))}
          >
            <span className="text-sm font-medium text-blue-600 mb-2 block">
              {suggestion.category}
            </span>
            <h3 className="font-semibold mb-3">{suggestion.title}</h3>
            <p className="text-sm text-gray-600 line-clamp-3">
              {suggestion.excerpt[0]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};