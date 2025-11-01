'use client'

import { useState } from 'react'
import {
  User,
  Building2,
  CreditCard,
  Key,
  Plug,
  Bell,
  Shield,
  Trash2,
  Save,
  Copy,
  Eye,
  EyeOff,
  Plus,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'

type Tab = 'profile' | 'organization' | 'billing' | 'api' | 'integrations' | 'notifications'

interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: Date
  lastUsed?: Date
  expiresAt?: Date
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Profile state
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john@company.com',
    title: 'Sales Manager',
    timezone: 'America/New_York',
  })

  // Organization state
  const [organization, setOrganization] = useState({
    name: 'Acme Corp',
    domain: 'acme.com',
    size: '10-50',
    industry: 'Technology',
  })

  // Billing state
  const [billing, setBilling] = useState({
    plan: 'pro',
    seats: 5,
    billingCycle: 'monthly',
    paymentMethod: '**** **** **** 4242',
  })

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production API',
      key: 'sidekick_live_1234567890abcdefghijklmnopqrstuvwxyz',
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-15T10:30:00'),
    },
    {
      id: '2',
      name: 'Development API',
      key: 'sidekick_test_1234567890abcdefghijklmnopqrstuvwxyz',
      createdAt: new Date('2024-01-10'),
      lastUsed: new Date('2024-01-14T15:20:00'),
    },
  ])

  // Integrations state
  const [integrations, setIntegrations] = useState({
    zoom: { connected: true, email: 'john@company.com' },
    salesforce: { connected: false },
    hubspot: { connected: false },
    slack: { connected: true, workspace: 'Acme Corp' },
  })

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailMeetingReminders: true,
    emailWeeklyReport: true,
    emailTeamActivity: false,
    pushMeetingStart: true,
    pushChecklistComplete: true,
    pushTeamMentions: true,
  })

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'organization', name: 'Organization', icon: Building2 },
    { id: 'billing', name: 'Billing', icon: CreditCard },
    { id: 'api', name: 'API Keys', icon: Key },
    { id: 'integrations', name: 'Integrations', icon: Plug },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ]

  const handleSave = () => {
    // TODO: API call to save settings
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1 bg-white rounded-lg border border-gray-200 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200 p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-2xl font-semibold text-primary-700">JS</span>
                    </div>
                    <div>
                      <button className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                        Change photo
                      </button>
                      <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. Max size 2MB.</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Timezone
                      </label>
                      <select
                        value={profile.timezone}
                        onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Chicago">Central Time</option>
                        <option value="America/Denver">Mountain Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Change Password</h3>
                    <div className="space-y-4 max-w-md">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Organization Tab */}
          {activeTab === 'organization' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Settings</h2>
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Organization Name
                      </label>
                      <input
                        type="text"
                        value={organization.name}
                        onChange={(e) => setOrganization({ ...organization, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Domain
                      </label>
                      <input
                        type="text"
                        value={organization.domain}
                        onChange={(e) => setOrganization({ ...organization, domain: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Size
                      </label>
                      <select
                        value={organization.size}
                        onChange={(e) => setOrganization({ ...organization, size: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="1-10">1-10 employees</option>
                        <option value="10-50">10-50 employees</option>
                        <option value="50-200">50-200 employees</option>
                        <option value="200+">200+ employees</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <select
                        value={organization.industry}
                        onChange={(e) => setOrganization({ ...organization, industry: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Retail">Retail</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 text-red-600">Danger Zone</h3>
                    <div className="bg-red-50 rounded-lg border border-red-200 p-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-1">Delete Organization</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Permanently delete your organization and all associated data. This action cannot be undone.
                      </p>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition">
                        <Trash2 className="h-4 w-4" />
                        Delete Organization
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing & Subscription</h2>

                {/* Current Plan */}
                <div className="bg-primary-50 rounded-lg border border-primary-200 p-6 mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Pro Plan</h3>
                      <p className="text-sm text-gray-600 mt-1">Unlimited meetings, AI auto-checking, analytics</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">$29</p>
                      <p className="text-sm text-gray-600">per user/month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <CheckCircle2 className="h-4 w-4 text-primary-600" />
                    <span>5 team members • Renews on February 1, 2024</span>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                      Change Plan
                    </button>
                    <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                      Cancel Subscription
                    </button>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Payment Method</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{billing.paymentMethod}</p>
                        <p className="text-xs text-gray-500">Expires 12/2025</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700">
                      Update
                    </button>
                  </div>
                </div>

                {/* Billing History */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Billing History</h3>
                  <div className="space-y-2">
                    {[
                      { date: 'Jan 1, 2024', amount: '$145.00', status: 'Paid', invoice: '#INV-2024-001' },
                      { date: 'Dec 1, 2023', amount: '$145.00', status: 'Paid', invoice: '#INV-2023-012' },
                      { date: 'Nov 1, 2023', amount: '$145.00', status: 'Paid', invoice: '#INV-2023-011' },
                    ].map((invoice) => (
                      <div
                        key={invoice.invoice}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-4">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{invoice.amount}</p>
                            <p className="text-xs text-gray-500">{invoice.date} • {invoice.invoice}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {invoice.status}
                          </span>
                          <button className="text-sm font-medium text-primary-600 hover:text-primary-700">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">API Keys</h2>
                    <p className="text-sm text-gray-600 mt-1">Manage your API keys for integrations</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition">
                    <Plus className="h-4 w-4" />
                    Create New Key
                  </button>
                </div>

                <div className="space-y-3">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{apiKey.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Created {formatDate(apiKey.createdAt)}
                            {apiKey.lastUsed && ` • Last used ${formatDate(apiKey.lastUsed)}`}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-red-600 transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 relative">
                          <input
                            type={showApiKey[apiKey.id] ? 'text' : 'password'}
                            value={apiKey.key}
                            readOnly
                            className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg bg-white text-sm font-mono"
                          />
                          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                            <button
                              onClick={() => setShowApiKey({ ...showApiKey, [apiKey.id]: !showApiKey[apiKey.id] })}
                              className="p-1 text-gray-400 hover:text-gray-600 transition"
                            >
                              {showApiKey[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-blue-50 rounded-lg border border-blue-200 p-4">
                  <div className="flex gap-3">
                    <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-sm font-semibold text-blue-900 mb-1">Keep your keys secure</h3>
                      <p className="text-sm text-blue-800">
                        API keys grant full access to your account. Never share them publicly or commit them to version control.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Connect Sidekick with your favorite tools
                </p>

                <div className="space-y-4">
                  {/* Zoom */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                        Z
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Zoom</h3>
                        <p className="text-xs text-gray-500">
                          {integrations.zoom.connected
                            ? `Connected as ${integrations.zoom.email}`
                            : 'Connect your Zoom account'}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        integrations.zoom.connected
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {integrations.zoom.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>

                  {/* Salesforce */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold">
                        SF
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Salesforce</h3>
                        <p className="text-xs text-gray-500">
                          Sync meetings and deals with Salesforce
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition">
                      Connect
                    </button>
                  </div>

                  {/* HubSpot */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">
                        H
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">HubSpot</h3>
                        <p className="text-xs text-gray-500">
                          Sync contacts and activities with HubSpot
                        </p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition">
                      Connect
                    </button>
                  </div>

                  {/* Slack */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">Slack</h3>
                        <p className="text-xs text-gray-500">
                          {integrations.slack.connected
                            ? `Connected to ${integrations.slack.workspace}`
                            : 'Get notifications in Slack'}
                        </p>
                      </div>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                        integrations.slack.connected
                          ? 'bg-red-50 text-red-700 hover:bg-red-100'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                      }`}
                    >
                      {integrations.slack.connected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
                <p className="text-sm text-gray-600 mb-6">
                  Choose how you want to be notified about activity
                </p>

                <div className="space-y-6">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Meeting Reminders</p>
                          <p className="text-xs text-gray-500">Get reminded 15 minutes before meetings</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailMeetingReminders}
                          onChange={(e) =>
                            setNotifications({ ...notifications, emailMeetingReminders: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Weekly Report</p>
                          <p className="text-xs text-gray-500">Summary of your week's activity every Monday</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailWeeklyReport}
                          onChange={(e) =>
                            setNotifications({ ...notifications, emailWeeklyReport: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Team Activity</p>
                          <p className="text-xs text-gray-500">Updates when team members complete meetings</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.emailTeamActivity}
                          onChange={(e) =>
                            setNotifications({ ...notifications, emailTeamActivity: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Push Notifications */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Push Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Meeting Started</p>
                          <p className="text-xs text-gray-500">Alert when your scheduled meeting starts</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushMeetingStart}
                          onChange={(e) =>
                            setNotifications({ ...notifications, pushMeetingStart: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Checklist Completed</p>
                          <p className="text-xs text-gray-500">Notify when you complete all items</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushChecklistComplete}
                          onChange={(e) =>
                            setNotifications({ ...notifications, pushChecklistComplete: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                      <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-100 transition">
                        <div>
                          <p className="text-sm font-medium text-gray-900">Team Mentions</p>
                          <p className="text-xs text-gray-500">Alert when someone mentions you</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifications.pushTeamMentions}
                          onChange={(e) =>
                            setNotifications({ ...notifications, pushTeamMentions: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center justify-between pt-6 border-t">
            {saveSuccess && (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Settings saved successfully</span>
              </div>
            )}
            <div className="ml-auto flex gap-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition">
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
