import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-light/20 to-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Master AI Prompts for{' '}
            <span className="text-primary">Sora, Veo & More</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your ideas into professional AI prompts with our intelligent generator
            and structured editor
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/studio" className="btn-primary text-lg px-8 py-3">
              Try Prompt Studio
            </Link>
            <Link to="/library" className="btn-secondary text-lg px-8 py-3">
              Browse Library
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose PromptValar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Generation</h3>
              <p className="text-gray-600">
                Transform natural language into professional prompts optimized for specific AI
                models
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3">Structured Editor</h3>
              <p className="text-gray-600">
                Fine-tune every aspect with our component-based editor for precise control
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3">Curated Library</h3>
              <p className="text-gray-600">
                Access thousands of proven prompts organized by model, style, and category
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;

