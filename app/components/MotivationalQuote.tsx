import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your limitation—it's only your imagination.", author: "Unknown" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Great things never come from comfort zones.", author: "Unknown" },
  { text: "Dream it. Wish it. Do it.", author: "Unknown" },
  { text: "Success doesn't just find you. You have to go out and get it.", author: "Unknown" },
  { text: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" },
  { text: "Dream bigger. Do bigger.", author: "Unknown" },
  { text: "Don't stop when you're tired. Stop when you're done.", author: "Unknown" },
  { text: "Wake up with determination. Go to bed with satisfaction.", author: "Unknown" },
  { text: "Do something today that your future self will thank you for.", author: "Unknown" },
];

export const MotivationalQuote = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    // Change quote daily based on date
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    setQuoteIndex(dayOfYear % quotes.length);
  }, []);

  const refreshQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const currentQuote = quotes[quoteIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-6 shadow-lg border border-amber-200"
    >
      <div className="flex items-start gap-4">
        <Quote className="text-amber-500 flex-shrink-0 mt-1" size={24} />
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-gray-800 text-lg font-medium italic mb-2">
                "{currentQuote.text}"
              </p>
              <p className="text-gray-600 text-sm">— {currentQuote.author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <Button
          onClick={refreshQuote}
          variant="ghost"
          size="icon"
          className="text-amber-600 hover:text-amber-700 hover:bg-amber-200/50 flex-shrink-0"
        >
          <RefreshCw size={18} />
        </Button>
      </div>
    </motion.div>
  );
};
