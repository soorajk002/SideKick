'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar,
  Clock,
  Search,
  Filter,
  Download,
  Sparkles,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Users,
  FileText,
  MoreVertical,
} from 'lucide-react'
import { formatDate, formatRelativeTime } from '@/lib/utils'

// Mock data
const meetings = [
  {
    id: '1',
    title: 'Discovery Call - Acme Corp',
    template: 'Discovery Call',
    date: new Date('2024-01-15T14:00:00'),
    duration: 45,
    participants: [
      { name: 'John Doe', email: 'john@example.com', role: 'host' },
      { name: 'Jane Smith', email: 'jane@acme.com', role: 'participant' },
      { name: 'Bob Wilson', email: 'bob@acme.com', role: 'participant' },
    ],
    completionRate: 92,
    outcome: 'Qualified',
    dealStage: 'Discovery',
    dealValue: 50000,
    aiAnalyzed: true,
    aiSummary: 'Strong interest in enterprise plan. Main pain points: manual processes, lack of analytics. Budget approved for Q1.',
    aiSentiment: 'positive',
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: '2',
    title: 'Product Demo - TechStart',
    template: 'Product Demo',
    date: new Date('2024-01-15T10:00:00'),
    duration: 60,
    participants: [
      { name: 'John Doe', email: 'john@example.com', role: 'host' },
      { name: 'Alice Johnson', email: 'alice@techstart.com', role: 'participant' },
    ],
    completionRate: 88,
    outcome: 'Follow-up Scheduled',
    dealStage: 'Demo',
    dealValue: 35000,
    aiAnalyzed: true,
    aiSummary: 'Demo went well. Customer impressed with AI features. Requested technical deep-dive next week.',
    aiSentiment: 'positive',
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: '3',
    title: 'Closing Call - BigCo Industries',
    template: 'Closing Call',
    date: new Date('2024-01-14T16:00:00'),
    duration: 30,
    participants: [
      { name: 'John Doe', email: 'john@example.com', role: 'host' },
      { name: 'Mike Chen', email: 'mike@bigco.com', role: 'participant' },
      { name: 'Sarah Lee', email: 'sarah@bigco.com', role: 'participant' },
    ],
    completionRate: 100,
    outcome: 'Closed Won',
    dealStage: 'Closed Won',
    dealValue: 125000,
    aiAnalyzed: true,
    aiSummary: 'Deal closed! All objections addressed. Contract signed. Implementation starts next week.',
    aiSentiment: 'very positive',
    hasRecording: true,
    hasTranscript: true,
  },
  {
    id: '4',
    title: 'Follow-up Call - StartupXYZ',
    template: 'Follow-up Call',
    date: new Date('2024-01-12T11:00:00'),
    duration: 25,
    participants: [
      { name: 'John Doe', email: 'john@example.com', role: 'host' },
      { name: 'Tom Brown', email: 'tom@startupxyz.com', role: 'participant' },
    ],
    completionRate: 75,
    outcome: 'No Show',
    dealStage: 'Follow-up',
    dealValue: 0,
    aiAnalyzed: false,
    aiSummary: null,
    aiSentiment: null,
    hasRecording: false,
    hasTranscript: false,
  },
]

const filters = {
  outcomes: ['All', 'Qualified', 'Closed Won', 'Follow-up Scheduled', 'No Show'],
  templates: ['All Templates', 'Discovery Call', 'Product Demo', 'Closing Call', 'Follow-up Call'],
  dateRanges: ['All Time', 'Today', 'This Week', 'This Month', 'Last 30 Days'],
}

export default function MeetingsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOutcome, setSelectedOutcome] = useState('All')
  const [selectedTemplate, setSelectedTemplate] = useState('All Templates')
  const [selectedDateRange, setSelectedDateRange] = useState('All Time')

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.participants.some((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesOutcome = selectedOutcome === 'All' || meeting.outcome === selectedOutcome
    const matchesTemplate = selectedTemplate === 'All Templates' || meeting.template === selectedTemplate
    return matchesSearch && matchesOutcome && matchesTemplate
  })

  const stats = {
    total: meetings.length,
    thisWeek: meetings.filter((m) => {
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return m.date >= weekAgo
    }).length,
    avgCompletion: Math.round(
      meetings.reduce((sum, m) => sum + m.completionRate, 0) / meetings.length
    ),
    aiAnalyzed: meetings.filter((m) => m.aiAnalyzed).length,
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Meetings</h1>
        <p className="mt-2 text-gray-600">
          View and analyze your sales call history
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Total Meetings</p>
            <Calendar className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.total}</p>
          <p className="text-sm text-gray-500 mt-1">{stats.thisWeek} this week</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Avg. Completion</p>
            <CheckCircle2 className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.avgCompletion}%</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            +4.2% from last month
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">AI Analyzed</p>
            <Sparkles className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{stats.aiAnalyzed}</p>
          <p className="text-sm text-gray-500 mt-1">
            {Math.round((stats.aiAnalyzed / stats.total) * 100)}% of meetings
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-gray-600">Win Rate</p>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {Math.round(
              (meetings.filter((m) => m.outcome === 'Closed Won').length / stats.total) * 100
            )}
            %
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {meetings.filter((m) => m.outcome === 'Closed Won').length} closed won
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search meetings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedOutcome}
            onChange={(e) => setSelectedOutcome(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {filters.outcomes.map((outcome) => (
              <option key={outcome} value={outcome}>
                {outcome}
              </option>
            ))}
          </select>

          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {filters.templates.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>

          <select
            value={selectedDateRange}
            onChange={(e) => setSelectedDateRange(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {filters.dateRanges.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>

          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Meetings List */}
      <div className="space-y-4">
        {filteredMeetings.map((meeting) => (
          <Link
            key={meeting.id}
            href={`/dashboard/meetings/${meeting.id}`}
            className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{meeting.title}</h3>
                  {meeting.aiAnalyzed && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                      <Sparkles className="h-3 w-3" />
                      AI Analyzed
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(meeting.date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {meeting.duration} min
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    {meeting.participants.length} participants
                  </span>
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                    {meeting.template}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                    meeting.outcome === 'Closed Won'
                      ? 'bg-green-100 text-green-700'
                      : meeting.outcome === 'Qualified'
                      ? 'bg-blue-100 text-blue-700'
                      : meeting.outcome === 'Follow-up Scheduled'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {meeting.outcome === 'Closed Won' && <CheckCircle2 className="h-3 w-3" />}
                  {meeting.outcome === 'No Show' && <XCircle className="h-3 w-3" />}
                  {meeting.outcome}
                </span>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    console.log('More actions:', meeting.id)
                  }}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* AI Summary */}
            {meeting.aiSummary && (
              <div className="mb-4 rounded-lg bg-purple-50 p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">AI Summary</p>
                    <p className="text-sm text-gray-700">{meeting.aiSummary}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress and Stats */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Completion Rate */}
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Completion</span>
                  <span className="font-semibold text-gray-900">{meeting.completionRate}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-600 rounded-full transition-all"
                    style={{ width: `${meeting.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Deal Stage */}
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gray-100 p-2">
                  <TrendingUp className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Deal Stage</p>
                  <p className="text-sm font-semibold text-gray-900">{meeting.dealStage}</p>
                </div>
              </div>

              {/* Deal Value */}
              {meeting.dealValue > 0 && (
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gray-100 p-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Deal Value</p>
                    <p className="text-sm font-semibold text-gray-900">
                      ${meeting.dealValue.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Resources */}
              <div className="flex items-center gap-2">
                {meeting.hasRecording && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700">
                    Recording
                  </span>
                )}
                {meeting.hasTranscript && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    Transcript
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state */}
      {filteredMeetings.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No meetings found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No meetings match your search "${searchQuery}"`
              : 'Start a Zoom meeting with Sidekick to begin tracking'}
          </p>
        </div>
      )}
    </div>
  )
}
