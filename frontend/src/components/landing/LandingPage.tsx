import React from 'react';
import { Leaf, CreditCard, BarChart3, Lock, ArrowRight, Users, Globe } from 'lucide-react';
import Button from '../ui/Button';

interface LandingPageProps {
  onOpenAuthModal: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuthModal }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-6 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 mb-4">
                <Leaf className="h-4 w-4 mr-1" />
                <span>Blockchain Powered Carbon Credits</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Reduce Your Carbon Footprint with 
                <span className="text-emerald-600 dark:text-emerald-500"> GreenLedger</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                A transparent and secure blockchain platform for tracking, trading, and verifying carbon credits. Join the global effort to combat climate change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={onOpenAuthModal}
                >
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-75 animate-pulse"></div>
              <div className="relative">
                <img 
                  src="https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Carbon credit visualization" 
                  className="rounded-lg shadow-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Why Choose GreenLedger?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our blockchain platform makes carbon credit trading transparent, secure, and accessible to businesses of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Secure Blockchain</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All transactions are secured by blockchain technology, ensuring transparency and immutability.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Easy Trading</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Buy and sell carbon credits with ease through our intuitive marketplace interface.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Real-time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monitor your carbon footprint and offset progress with detailed analytics and reports.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Global Impact</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Join a worldwide network of businesses committed to environmental sustainability.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Accessible for All</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Designed for companies of all sizes, from startups to global enterprises.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Verified Credits</h3>
              <p className="text-gray-600 dark:text-gray-400">
                All carbon credits are verified and certified to ensure their authenticity and impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-emerald-600 dark:bg-emerald-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Reduce Your Carbon Footprint?</h2>
          <p className="text-xl text-emerald-100 mb-8">
            Join thousands of companies already using GreenLedger to trade carbon credits and make a positive impact on the environment.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={onOpenAuthModal}
            className="bg-white text-emerald-700 hover:bg-gray-100"
          >
            Get Started Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Trusted by Industry Leaders</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See what companies are saying about their experience with GreenLedger.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center text-blue-600 font-bold">EC</div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">EcoTech Solutions</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Technology Sector</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "GreenLedger has transformed how we manage our carbon offset strategy. The platform is intuitive and the blockchain verification gives us confidence."
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-emerald-100 w-12 h-12 flex items-center justify-center text-emerald-600 font-bold">GF</div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">Green Future Energy</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Energy Sector</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The real-time analytics have been crucial for our sustainability reporting. We've seen a 30% improvement in our carbon management efficiency."
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-orange-100 w-12 h-12 flex items-center justify-center text-orange-600 font-bold">SF</div>
                <div className="ml-4">
                  <h4 className="font-bold text-gray-900 dark:text-white">Sustainable Farming Co.</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Agriculture Sector</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "As a smaller company, we thought carbon trading would be out of reach. GreenLedger made it accessible and straightforward for us."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;