'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Database, Sparkles, Copy, Check, X } from 'lucide-react';

export default function Home() {
  const [input, setInput] = useState('');
  const [sqlQuery, setSqlQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/nl2sql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      if (res.ok && data.sql) {
        setSqlQuery(data.sql);
        showNotification('SQL query generated successfully!', 'success');
      } else {
        setSqlQuery('');
        showNotification(data.error || 'Failed to generate SQL. Please try again.', 'error');
      }
    } catch (error) {
  console.error(error);
  setSqlQuery('');
  showNotification('Failed to generate SQL. Please try again.', 'error');
} finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (sqlQuery) {
      await navigator.clipboard.writeText(sqlQuery);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showNotification('SQL query copied to clipboard!', 'success');
    }
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const examples = [
    "Get names of all students",
    "List all products with price above 500",
    "Maximum price of a product",
    "List books published after 2020",
    "Employees in HR or Finance",
    "Show students ordered by marks",
    "Get employees with their manager's name",
    "List employees earning more than average salary",
    "What is the average salary?",
    "Count all employees",
    "Get employees from department 'HR'",
    "Show students with marks > 90 and age < 18",
    "5+5",
    "What is 2+2?",
    "Tell me the meaning of life"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Notification */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <Database className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Talk2DB
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your natural language into powerful SQL queries with AI-powered intelligence
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Input Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Describe what you want to query:
                </label>
                <div className="relative">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., Get names of all students, List products with price above 500, or What is the average salary?"
                    className="w-full h-32 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute bottom-3 right-3 p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Examples Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-300 mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              Try these examples:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {examples.map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInput(example)}
                  className="p-3 bg-white/5 border border-white/10 rounded-lg text-left text-sm text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  {example}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Output Section */}
          {sqlQuery && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-300 flex items-center">
                  <Database className="w-5 h-5 mr-2 text-green-400" />
                  Generated SQL Query:
                </h3>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-gray-300 hover:bg-white/20 transition-all duration-200"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </button>
              </div>
              <div className="bg-gray-900/50 rounded-xl p-6 border border-white/10">
                <pre className="text-green-400 font-mono text-sm overflow-x-auto">
                  <code>{sqlQuery}</code>
                </pre>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16 text-gray-400"
        >
          <p>Powered by AI</p>
        </motion.div>
      </div>
    </div>
  );
}
