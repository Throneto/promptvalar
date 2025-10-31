import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { generateOrganizationSchema, generateWebSiteSchema, generateSoftwareApplicationSchema } from '../utils/structuredData';

function HomePage() {
  // 生成结构化数据
  const organizationSchema = generateOrganizationSchema(
    'PromptValar',
    'https://promptvalar.com',
    'https://promptvalar.com/logo.svg',
    'Professional AI prompt engineering platform for Sora, Veo, Midjourney and more. Create, optimize, and share AI prompts with our intelligent generator.',
    ['https://twitter.com/PromptValar', 'https://github.com/promptvalar']
  );

  const websiteSchema = generateWebSiteSchema(
    'PromptValar',
    'https://promptvalar.com',
    'Professional AI prompt engineering platform for Sora, Veo, Midjourney and more.',
    true
  );

  const softwareSchema = generateSoftwareApplicationSchema(
    'PromptValar',
    'https://promptvalar.com',
    'Professional AI prompt engineering platform for Sora, Veo, Midjourney and more.'
  );

  // 合并结构化数据
  const structuredData = {
    '@graph': [organizationSchema, websiteSchema, softwareSchema]
  };

  return (
    <div>
      <SEO 
        title="PromptValar - AI Prompt Engineering Made Easy"
        description="Create professional AI prompts for Sora, Veo, Midjourney and more. AI-powered optimization, structured editing, and a vast library of community prompts."
        url="https://promptvalar.com"
        keywords="AI prompts, Sora prompts, Veo prompts, Midjourney prompts, AI video generation, prompt engineering, AI tools, prompt generator, AI content creation"
        structuredData={structuredData}
      />
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-light/20 to-white dark:from-primary/20 dark:to-gray-900 py-20 transition-colors duration-300">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-gray-100">
            Master AI Prompts for{' '}
            <span className="text-primary dark:text-primary-light">Sora, Veo & More</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Transform your ideas into professional AI prompts with our intelligent generator
            and structured editor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
            Why Choose PromptValar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-surface dark:bg-surface-dark rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">AI-Powered Generation</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Transform natural language into professional prompts optimized for specific AI
                models
              </p>
            </div>

            <div className="text-center p-6 bg-surface dark:bg-surface-dark rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Structured Editor</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Fine-tune every aspect with our component-based editor for precise control
              </p>
            </div>

            <div className="text-center p-6 bg-surface dark:bg-surface-dark rounded-lg hover:shadow-lg transition-shadow duration-300">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Curated Library</h3>
              <p className="text-gray-600 dark:text-gray-400">
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

