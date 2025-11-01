'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  CheckCircle2,
  Users,
  Target,
  Sparkles,
  Download,
  Filter,
  ArrowRight,
} from 'lucide-react'

// Mock data for charts
const completionTrend = [
  { date: 'Jan 1', rate: 78 },
  { date: 'Jan 8', rate: 82 },
  { date: 'Jan 15', rate: 85 },
  { date: 'Jan 22', rate: 87 },
  { date: 'Jan 29', rate: 89 },
]

const templatePerformance = [
  { name: 'Discovery Call', meetings: 45, avgCompletion: 87, winRate: 42 },
  { name: 'Product Demo', meetings: 38, avgCompletion: 92, winRate: 65 },
  { name: 'Closing Call', meetings: 28, avgCompletion: 94, winRate: 78 },
  { name: 'Follow-up Call', meetings: 32, avgCompletion: 81, winRate: 38 },
  { name: 'Qualification Call', meetings: 52, avgCompletion: 85, winRate: 55 },
]

const topPerformers = [
  { name: 'John Doe', meetings: 24, avgCompletion: 92, deals: 8, value: 285000 },
  { name: 'Jane Smith', meetings: 22, avgCompletion: 89, deals: 6, value: 195000 },
  { name: 'Bob Wilson', meetings: 19, avgCompletion: 87, deals: 5, value: 150000 },
  { name: 'Alice Johnson', meetings: 18, avgCompletion: 85, deals: 4, value: 125000 },
]

const mostSkippedItems = [
  { content: 'Budget discussion', skipped: 34, template: 'Discovery Call' },
  { content: 'Timeline commitment', skipped: 28, template: 'Closing Call' },
  { content: 'Competitor analysis', skipped: 25, template: 'Qualification Call' },
  { content: 'Technical requirements', skipped: 22, template: 'Product Demo' },
  { content: 'Decision maker confirmation', skipped: 20, template: 'Discovery Call' },
]

const insights = [
  {
    id: '1',
    type: 'positive',
    title: 'Win rate increased 12% this month',
    description: 'Teams using AI auto-checking close 32% more deals than manual checking.',
    action: 'Enable AI for all team members',
    actionLink: '/dashboard/settings',
  },
  {
    id: '2',
    type: 'warning',
    title: 'Budget discussions often skipped',
    description: 'Budget is skipped in 34% of discovery calls. Deals without budget discussion are 2x less likely to close.',
    action: 'Review discovery playbook',
    actionLink: '/dashboard/templates',
  },
  {
    id: '3',
    type: 'info',
    title: 'Product demos have highest conversion',
    description: 'Demos with 90%+ completion rate have a 65% win rate vs 28% for incomplete demos.',
    action: 'View demo template',
    actionLink: '/dashboard/templates',
  },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('last-30-days')

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">
            Track performance, identify trends, and optimize your sales process
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="last-7-days">Last 7 days</option>
            <option value="last-30-days">Last 30 days</option>
            <option value="last-90-days">Last 90 days</option>
            <option value="this-year">This year</option>
          </select>
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <div className="rounded-lg bg-green-100 p-2">
              <Target className="h-5 w-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-1">$755K</p>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">+18.2%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">Win Rate</p>
            <div className="rounded-lg bg-blue-100 p-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-1">58%</p>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">+12%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">Avg Deal Size</p>
            <div className="rounded-lg bg-purple-100 p-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-1">$45K</p>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">+8.5%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-600">Avg Sales Cycle</p>
            <div className="rounded-lg bg-orange-100 p-2">
              <Calendar className="h-5 w-5 text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-semibold text-gray-900 mb-1">32 days</p>
          <div className="flex items-center gap-1 text-sm">
            <TrendingDown className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">-15%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">AI-Powered Insights</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {insights.map((insight) => (
            <div
              key={insight.id}
              className={`rounded-xl border p-6 ${
                insight.type === 'positive'
                  ? 'border-green-200 bg-green-50'
                  : insight.type === 'warning'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className={`rounded-lg p-2 ${
                    insight.type === 'positive'
                      ? 'bg-green-200'
                      : insight.type === 'warning'
                      ? 'bg-yellow-200'
                      : 'bg-blue-200'
                  }`}
                >
                  <Sparkles
                    className={`h-5 w-5 ${
                      insight.type === 'positive'
                        ? 'text-green-700'
                        : insight.type === 'warning'
                        ? 'text-yellow-700'
                        : 'text-blue-700'
                    }`}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{insight.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
                  <a
                    href={insight.actionLink}
                    className={`inline-flex items-center gap-1 text-sm font-medium ${
                      insight.type === 'positive'
                        ? 'text-green-700 hover:text-green-800'
                        : insight.type === 'warning'
                        ? 'text-yellow-700 hover:text-yellow-800'
                        : 'text-blue-700 hover:text-blue-800'
                    }`}
                  >
                    {insight.action}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Completion Rate Trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Completion Rate Trend
          </h2>
          <div className="space-y-4">
            {completionTrend.map((data, index) => (
              <div key={data.date} className="flex items-center gap-4">
                <p className="text-sm font-medium text-gray-600 w-16">{data.date}</p>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="h-3 bg-gray-200 rounded-full flex-1 mr-3 overflow-hidden">
                      <div
                        className="h-full bg-primary-600 rounded-full transition-all"
                        style={{ width: `${data.rate}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                      {data.rate}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Template Performance */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Template Performance
          </h2>
          <div className="space-y-4">
            {templatePerformance.map((template) => (
              <div key={template.name} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{template.name}</h3>
                  <span className="text-sm text-gray-500">{template.meetings} meetings</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Avg. Completion</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                        <div
                          className="h-full bg-blue-600 rounded-full"
                          style={{ width: `${template.avgCompletion}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {template.avgCompletion}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Win Rate</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 bg-gray-200 rounded-full flex-1 overflow-hidden">
                        <div
                          className="h-full bg-green-600 rounded-full"
                          style={{ width: `${template.winRate}%` }}
                        />
                      </div>
                      <span className="font-semibold text-gray-900">
                        {template.winRate}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Performers</h2>
          <div className="space-y-4">
            {topPerformers.map((performer, index) => (
              <div
                key={performer.name}
                className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{performer.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <span>{performer.meetings} meetings</span>
                    <span>•</span>
                    <span>{performer.avgCompletion}% avg</span>
                    <span>•</span>
                    <span>{performer.deals} deals</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ${(performer.value / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-500">closed</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Skipped Items */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Most Skipped Items
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Focus on these items to improve completion rates
          </p>
          <div className="space-y-3">
            {mostSkippedItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-100"
              >
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-200 text-red-700 font-bold text-xs shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{item.content}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">{item.template}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-red-600 font-medium">
                      Skipped {item.skipped}% of the time
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Pipeline Value</h3>
            <Target className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">$1.2M</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Discovery</span>
              <span className="font-medium">$450K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Demo</span>
              <span className="font-medium">$380K</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Negotiation</span>
              <span className="font-medium">$370K</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Team Activity</h3>
            <Users className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">195</p>
          <p className="text-sm text-gray-600 mb-3">meetings this month</p>
          <div className="flex items-center gap-1 text-sm">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">+24%</span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">AI Impact</h3>
            <Sparkles className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-2">+32%</p>
          <p className="text-sm text-gray-600 mb-3">higher close rate with AI</p>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Enable for team
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
