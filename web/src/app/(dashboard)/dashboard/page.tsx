'use client'

import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  Clock,
} from 'lucide-react'

// Mock data - replace with real data
const stats = [
  {
    name: 'Total Meetings',
    value: '24',
    change: '+12%',
    changeType: 'increase',
    icon: Calendar,
  },
  {
    name: 'Avg Completion Rate',
    value: '87%',
    change: '+4.2%',
    changeType: 'increase',
    icon: CheckCircle2,
  },
  {
    name: 'AI Credits Used',
    value: '42',
    change: '8 remaining',
    changeType: 'neutral',
    icon: Sparkles,
  },
  {
    name: 'Team Members',
    value: '5',
    change: '+1 this month',
    changeType: 'increase',
    icon: Users,
  },
]

const recentMeetings = [
  {
    id: '1',
    title: 'Discovery Call - Acme Corp',
    template: 'Discovery Call',
    date: '2024-01-15T14:00:00',
    duration: '45 min',
    completionRate: 92,
    outcome: 'Qualified',
    aiAnalyzed: true,
  },
  {
    id: '2',
    title: 'Product Demo - TechStart',
    template: 'Product Demo',
    date: '2024-01-15T10:00:00',
    duration: '60 min',
    completionRate: 88,
    outcome: 'Follow-up Scheduled',
    aiAnalyzed: true,
  },
  {
    id: '3',
    title: 'Closing Call - BigCo Industries',
    template: 'Closing Call',
    date: '2024-01-14T16:00:00',
    duration: '30 min',
    completionRate: 100,
    outcome: 'Closed Won',
    aiAnalyzed: true,
  },
]

const upcomingMeetings = [
  {
    id: '1',
    title: 'Discovery Call - StartupXYZ',
    template: 'Discovery Call',
    date: '2024-01-16T14:00:00',
    participants: 3,
  },
  {
    id: '2',
    title: 'Follow-up - TechStart',
    template: 'Follow-up Call',
    date: '2024-01-17T10:00:00',
    participants: 2,
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your sales calls.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </div>
              <div className="rounded-lg bg-primary-100 p-3">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm">
              {stat.changeType === 'increase' && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-600">{stat.change}</span>
                </>
              )}
              {stat.changeType === 'decrease' && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="font-medium text-red-600">{stat.change}</span>
                </>
              )}
              {stat.changeType === 'neutral' && (
                <span className="text-gray-600">{stat.change}</span>
              )}
              <span className="text-gray-500">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent meetings */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Meetings
                </h2>
                <Link
                  href="/dashboard/meetings"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {recentMeetings.map((meeting) => (
                <div key={meeting.id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {meeting.title}
                        </h3>
                        {meeting.aiAnalyzed && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                            <Sparkles className="h-3 w-3" />
                            AI Analyzed
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(meeting.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {meeting.duration}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          {meeting.template}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Completion</span>
                            <span className="font-medium text-gray-900">
                              {meeting.completionRate}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary-600 rounded-full"
                              style={{ width: `${meeting.completionRate}%` }}
                            />
                          </div>
                        </div>
                        <div className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                          meeting.outcome === 'Closed Won'
                            ? 'bg-green-100 text-green-700'
                            : meeting.outcome === 'Qualified'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {meeting.outcome}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/meetings/${meeting.id}`}
                      className="ml-4 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {recentMeetings.length === 0 && (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">
                  No meetings yet
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Start a Zoom meeting and open Sidekick to get started
                </p>
                <Link
                  href="/dashboard/templates"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  Browse Templates
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming meetings */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Meetings
            </h2>

            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div
                  key={meeting.id}
                  className="rounded-lg border border-gray-200 p-4 hover:border-primary-300 transition"
                >
                  <h3 className="font-medium text-gray-900 mb-1">
                    {meeting.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {new Date(meeting.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                      {meeting.template}
                    </span>
                    <span className="text-xs text-gray-500">
                      {meeting.participants} participants
                    </span>
                  </div>
                </div>
              ))}

              {upcomingMeetings.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No upcoming meetings
                </p>
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>

            <div className="space-y-2">
              <Link
                href="/dashboard/templates"
                className="block w-full rounded-lg border border-gray-200 p-3 text-left hover:border-primary-300 hover:bg-primary-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-100 p-2">
                    <CheckCircle2 className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Browse Templates
                    </p>
                    <p className="text-xs text-gray-500">
                      Explore sales playbooks
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/analytics"
                className="block w-full rounded-lg border border-gray-200 p-3 text-left hover:border-primary-300 hover:bg-primary-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-100 p-2">
                    <TrendingUp className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      View Analytics
                    </p>
                    <p className="text-xs text-gray-500">
                      Track your performance
                    </p>
                  </div>
                </div>
              </Link>

              <Link
                href="/dashboard/team"
                className="block w-full rounded-lg border border-gray-200 p-3 text-left hover:border-primary-300 hover:bg-primary-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary-100 p-2">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Invite Team
                    </p>
                    <p className="text-xs text-gray-500">
                      Add team members
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50 shadow-sm p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Pro Tip
                </h3>
                <p className="text-sm text-gray-700">
                  Enable AI auto-checking to let GPT-4 analyze your calls in real-time.
                  Teams with AI enabled close 32% more deals.
                </p>
                <Link
                  href="/dashboard/settings"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                >
                  Enable AI
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
