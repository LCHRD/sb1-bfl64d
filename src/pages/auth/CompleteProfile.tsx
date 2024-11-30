import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const INTEREST_OPTIONS = [
  'Technology',
  'Business',
  'Marketing',
  'Education',
  'Entertainment',
  'Health',
  'Science',
  'Politics',
  'Travel',
  'Lifestyle',
  'Sports',
  'Food',
  'Fashion',
  'Art',
  'Music'
];

export const CompleteProfile: React.FC = () => {
  const { user, updateProfile, loading } = useAuthStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customTopic, setCustomTopic] = useState('');
  const navigate = useNavigate();

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleAddCustomTopic = () => {
    if (customTopic.trim() && !selectedInterests.includes(customTopic.trim())) {
      setSelectedInterests(prev => [...prev, customTopic.trim()]);
      trackCustomTopic(customTopic.trim());
      setCustomTopic('');
    }
  };

  const trackCustomTopic = async (topic: string) => {
    try {
      const topicsRef = doc(db, 'customTopics', 'tracking');
      const topicsDoc = await getDoc(topicsRef);
      
      if (topicsDoc.exists()) {
        const currentData = topicsDoc.data();
        await updateDoc(topicsRef, {
          topics: arrayUnion(topic),
          count: {
            ...currentData.count,
            [topic]: (currentData.count?.[topic] || 0) + 1
          }
        });
      } else {
        // Create the document if it doesn't exist
        await setDoc(topicsRef, {
          topics: [topic],
          count: { [topic]: 1 }
        });
      }
    } catch (error) {
      console.error('Error tracking custom topic:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await updateProfile({
      interests: selectedInterests
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            What do you wish to write about?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Select topics that interest you or add your own
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="Add your own topic"
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddCustomTopic}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...new Set([...selectedInterests, ...INTEREST_OPTIONS])].map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`p-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      selectedInterests.includes(interest)
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : 'bg-gray-50 text-gray-700 border-gray-200'
                    } border`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || selectedInterests.length === 0}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};