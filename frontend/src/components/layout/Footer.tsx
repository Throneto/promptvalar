function Footer() {
  return (
    <footer className="bg-surface dark:bg-surface-dark border-t border-border dark:border-border-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">PromptValar</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Professional AI prompt engineering platform for content creators.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/studio" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Prompt Studio
                </a>
              </li>
              <li>
                <a href="/library" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Prompt Library
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/docs" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/guides" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Guides
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>
                <a href="/about" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-primary dark:hover:text-primary-light transition-colors">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border dark:border-border-dark">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2025 PromptValar. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-primary dark:hover:text-primary-light transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-primary dark:hover:text-primary-light transition-colors">Terms</a>
              <a href="/refund-policy" className="hover:text-primary dark:hover:text-primary-light transition-colors">Refunds</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

