import React from 'react';
import { Link } from 'react-router-dom';
import { SparklesIcon, LogoIcon } from './Icons';

interface HomepageProps {
  onGetStarted: () => void;
  t: (key: string) => string;
}


const Homepage: React.FC<HomepageProps> = ({ onGetStarted, t }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="bg-yellow-400 rounded-full p-1.5 text-black">
            <LogoIcon className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-yellow-400">Ideation Engine</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          {/* <Link to="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">How It Works</Link>
          <Link to="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</Link> */}
        </nav>
        
        {/* <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full text-sm transition">
          Login
        </button> */}
        <button onClick={onGetStarted} className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full text-sm transition">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full uppercase tracking-wide">
                  AI-POWERED SOLUTION
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Turn a Random
                  <br />
                  Thought into a
                  <br />
                  Profitable
                  <br />
                  <span className="bg-yellow-400 px-2 py-1 rounded">Business</span>
                </h1>
                
                <p className="text-lg text-gray-600 leading-relaxed max-w-md">
                  Enter your targets or observations, and let our AI map out valid business problems and innovative solutions instantly.
                </p>
                
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <SparklesIcon className="h-4 w-4" />
                  <span>e.g I love baking but hate the cleanup.</span>
                </div>
              </div>
              
              <button 
                onClick={onGetStarted}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg transition shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                View Ideas
                <span className="text-xl">→</span>
              </button>
              
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  No signup
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Free forever
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Instant results
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Mind-blowing
                </span>
              </div>
            </div>
            
            {/* Right Content - Mind Map Preview */}
            <div className="relative">
              <div className="bg-gray-50 rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Opportunity Map</h3>
                  <div className="inline-block bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
                    Generated
                  </div>
                </div>
                
                {/* Mock Mind Map */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Problems</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-700">Solutions</span>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="text-sm text-gray-600 mb-2">Central Topic:</div>
                    <div className="font-semibold text-gray-900">Baking cleanup frustration</div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                      <div className="text-xs text-yellow-600 font-medium mb-1">PROBLEM</div>
                      <div className="text-sm text-gray-700">Time-consuming cleanup process</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                      <div className="text-xs text-green-600 font-medium mb-1">SOLUTION</div>
                      <div className="text-sm text-gray-700">Disposable baking tools startup</div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-6">
                  <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                    WITH FULL BUSINESS
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Process Section */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            From raw thought to structured plan.
          </h2>
          <p className="text-lg text-gray-600 mb-16 max-w-2xl mx-auto">
            Our unique three-step process takes that guesswork out of validating your next big venture.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-xl mx-auto">
                1
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded mx-auto flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Input Interest</h3>
              <p className="text-gray-600">
                Share a hobby, observation, or frustration. No need to be specific or detailed.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                2
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded mx-auto flex items-center justify-center">
                <SparklesIcon className="w-4 h-4 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">AI Processing</h3>
              <p className="text-gray-600">
                Our engine analyzes your input and generates feasible problems, solutions, and market insights.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto">
                3
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded mx-auto flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-400 rounded"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Business Plan</h3>
              <p className="text-gray-600">
                Receive a comprehensive mind map, strategy documents, and launch steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to build your next venture?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join 10,000+ entrepreneurs finding their next big thing with IdeaGem.
            </p>
            <button 
              onClick={onGetStarted}
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-4 px-8 rounded-full text-lg transition shadow-lg hover:shadow-xl"
            >
              Start Free Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <div className="bg-yellow-400 rounded-full p-1 text-black">
              <LogoIcon className="h-3 w-3" />
            </div>
            <span>© 2024 Ideation. </span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-700">Privacy</a>
            <a href="#" className="hover:text-gray-700">Terms</a>
            <a href="#" className="hover:text-gray-700">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;