function Footer() {
  return (
    <footer className="bg-surface border-t border-border">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">PromptValar</h3>
            <p className="text-gray-600 text-sm">
              Professional AI prompt engineering platform for content creators.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/studio" className="hover:text-primary">
                  Prompt Studio
                </a>
              </li>
              <li>
                <a href="/library" className="hover:text-primary">
                  Prompt Library
                </a>
              </li>
              <li>
                <a href="/pricing" className="hover:text-primary">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/docs" className="hover:text-primary">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/guides" className="hover:text-primary">
                  Guides
                </a>
              </li>
              <li>
                <a href="/blog" className="hover:text-primary">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <a href="/about" className="hover:text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-primary">
                  Contact
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-primary">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="hover:text-primary">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="hover:text-primary">
                  Refund Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; 2025 PromptValar. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="/privacy" className="hover:text-primary">Privacy</a>
              <a href="/terms" className="hover:text-primary">Terms</a>
              <a href="/refund-policy" className="hover:text-primary">Refunds</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

