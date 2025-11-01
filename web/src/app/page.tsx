import Link from 'next/link'
import { CheckCircle2, Sparkles, Users, BarChart3, FileText, Zap, ArrowRight, Star } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <span className="text-xl font-bold">Sidekick</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-sm font-medium hover:text-primary-600 transition">Features</a>
            <a href="#how-it-works" className="text-sm font-medium hover:text-primary-600 transition">How it Works</a>
            <a href="#pricing" className="text-sm font-medium hover:text-primary-600 transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium hover:text-primary-600 transition">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary-50 to-white py-20 md:py-32">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
                <Sparkles className="h-4 w-4" />
                AI-Powered Sales Assistant
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Never Miss a Step in Your Sales Calls
              </h1>
              <p className="mb-8 text-xl text-gray-600">
                Sidekick brings AI-powered checklists to your Zoom meetings. Auto-check items,
                get real-time coaching, and close more deals with proven playbooks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-8 py-4 text-lg font-semibold text-white hover:bg-primary-700 transition shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 px-8 py-4 text-lg font-semibold text-gray-900 hover:border-primary-600 hover:text-primary-600 transition"
                >
                  Watch Demo
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                No credit card required • 14-day free trial • Cancel anytime
              </p>
            </div>

            {/* Hero Image Placeholder */}
            <div className="mx-auto mt-16 max-w-5xl">
              <div className="relative rounded-xl border-4 border-gray-200 bg-white shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-blue-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="h-16 w-16 text-primary-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Sidekick in action during a Zoom call</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="border-b bg-white py-12">
          <div className="container">
            <p className="text-center text-sm font-medium text-gray-500 mb-8">
              Trusted by sales teams at leading companies
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-50">
              {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((company) => (
                <div key={company} className="text-2xl font-bold text-gray-400">
                  {company}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="border-b bg-white py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Everything you need to crush your quota
              </h2>
              <p className="text-lg text-gray-600">
                Sidekick combines AI, analytics, and proven sales playbooks to help your team close more deals.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="relative rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Sparkles className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">AI Auto-Checking</h3>
                <p className="text-gray-600">
                  GPT-4 analyzes your conversation in real-time and automatically checks off items as you cover them.
                  Get instant feedback on what you've covered.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="relative rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <CheckCircle2 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Proven Playbooks</h3>
                <p className="text-gray-600">
                  Start with battle-tested templates for discovery, demo, closing, and more.
                  Customize them to match your sales process.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="relative rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <BarChart3 className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Analytics & Insights</h3>
                <p className="text-gray-600">
                  See what's working. Track completion rates, identify coaching opportunities,
                  and correlate playbook adherence with win rates.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="relative rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <FileText className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Meeting Notes</h3>
                <p className="text-gray-600">
                  AI-generated summaries, action items, and key moments. Export to your CRM or
                  share with your team instantly.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="relative rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Team Collaboration</h3>
                <p className="text-gray-600">
                  Share templates across your team. See how top performers run their calls and
                  replicate what works.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="relative rounded-xl border bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                  <Zap className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">Real-Time Coaching</h3>
                <p className="text-gray-600">
                  Get AI-powered suggestions during your call. "You haven't discussed budget yet" or
                  "Ask about their timeline now."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="border-b bg-gradient-to-b from-white to-primary-50 py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                How Sidekick Works
              </h2>
              <p className="text-lg text-gray-600">
                Three simple steps to better sales calls
              </p>
            </div>

            <div className="mx-auto max-w-4xl">
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="flex gap-8 items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-lg">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">Choose Your Playbook</h3>
                    <p className="text-gray-600 text-lg">
                      Select from proven templates like Discovery Call, Product Demo, or Closing Call.
                      Or create your own custom playbook.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-8 items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-lg">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">Run Your Meeting</h3>
                    <p className="text-gray-600 text-lg">
                      Sidekick appears in your Zoom sidebar. As you talk, AI listens and automatically
                      checks off items. Get real-time coaching suggestions.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-8 items-start">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white font-bold text-lg">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold mb-2">Review & Improve</h3>
                    <p className="text-gray-600 text-lg">
                      Get AI-generated meeting summaries, action items, and insights. See your completion
                      rate and identify areas to improve.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="border-b bg-white py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-gray-600">
                Start free, upgrade when you're ready
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto">
              {/* Free Plan */}
              <div className="relative rounded-xl border-2 border-gray-200 bg-white p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Free</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                <p className="mb-6 text-gray-600">Perfect for trying Sidekick</p>
                <ul className="mb-8 space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">5 meetings per month</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">5 basic templates</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Manual checking</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Basic analytics</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">1 user</span>
                  </li>
                </ul>
                <Link
                  href="/signup"
                  className="block w-full rounded-lg border-2 border-primary-600 px-4 py-3 text-center font-semibold text-primary-600 hover:bg-primary-50 transition"
                >
                  Start Free
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-xl border-2 border-primary-600 bg-white p-8 shadow-lg">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-600 px-4 py-1 text-sm font-semibold text-white">
                    <Star className="h-4 w-4" />
                    Most Popular
                  </span>
                </div>
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-gray-600">/user/month</span>
                  </div>
                </div>
                <p className="mb-6 text-gray-600">For growing sales teams</p>
                <ul className="mb-8 space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm font-medium">Everything in Free, plus:</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Unlimited meetings</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">✨ AI auto-checking (50 credits/mo)</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Custom templates</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Advanced analytics</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Meeting notes & export</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Up to 10 users</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Email support</span>
                  </li>
                </ul>
                <Link
                  href="/signup?plan=pro"
                  className="block w-full rounded-lg bg-primary-600 px-4 py-3 text-center font-semibold text-white hover:bg-primary-700 transition"
                >
                  Start 14-Day Trial
                </Link>
              </div>

              {/* Enterprise Plan */}
              <div className="relative rounded-xl border-2 border-gray-200 bg-white p-8">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold">Enterprise</h3>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-bold">Custom</span>
                  </div>
                </div>
                <p className="mb-6 text-gray-600">For large teams & enterprises</p>
                <ul className="mb-8 space-y-3">
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm font-medium">Everything in Pro, plus:</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Unlimited AI credits</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">SSO (SAML)</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Dedicated success manager</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Custom integrations</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary-600" />
                    <span className="text-sm">API access</span>
                  </li>
                </ul>
                <Link
                  href="/contact-sales"
                  className="block w-full rounded-lg border-2 border-primary-600 px-4 py-3 text-center font-semibold text-primary-600 hover:bg-primary-50 transition"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary-600 py-20">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
                Ready to close more deals?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Join sales teams using Sidekick to crush their quotas
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-primary-600 hover:bg-gray-50 transition shadow-lg"
              >
                Start Your Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
              <p className="mt-4 text-sm text-primary-100">
                No credit card required • 14-day free trial
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-12">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-primary-600" />
                <span className="font-bold">Sidekick</span>
              </div>
              <p className="text-sm text-gray-600">
                AI-powered sales checklists for Zoom meetings
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 hover:text-primary-600">Features</a></li>
                <li><a href="#pricing" className="text-gray-600 hover:text-primary-600">Pricing</a></li>
                <li><a href="/integrations" className="text-gray-600 hover:text-primary-600">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-600 hover:text-primary-600">About</a></li>
                <li><a href="/blog" className="text-gray-600 hover:text-primary-600">Blog</a></li>
                <li><a href="/contact" className="text-gray-600 hover:text-primary-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-gray-600 hover:text-primary-600">Privacy</a></li>
                <li><a href="/terms" className="text-gray-600 hover:text-primary-600">Terms</a></li>
                <li><a href="/security" className="text-gray-600 hover:text-primary-600">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-gray-600">
            © 2025 Sidekick. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
