'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Sparkles,
  Star,
  Users,
  MoreVertical,
  Edit,
  Trash2,
  Copy,
  Eye,
} from 'lucide-react'

// Mock data - replace with real API calls
const templates = [
  {
    id: '1',
    name: 'Discovery Call',
    description: 'Essential questions for understanding prospect needs and pain points',
    category: 'Sales',
    items: [
      { id: '1', content: 'Introduction and agenda setting', order: 0 },
      { id: '2', content: 'Current situation and challenges', order: 1 },
      { id: '3', content: 'Goals and desired outcomes', order: 2 },
      { id: '4', content: 'Decision-making process', order: 3 },
      { id: '5', content: 'Budget and timeline discussion', order: 4 },
      { id: '6', content: 'Next steps and follow-up', order: 5 },
    ],
    isPublic: true,
    isFeatured: true,
    aiEnabled: true,
    usageCount: 124,
    avgCompletionRate: 87,
    createdBy: 'Sidekick',
    tags: ['sales', 'discovery', 'qualification'],
  },
  {
    id: '2',
    name: 'Product Demo',
    description: 'Structured demo flow to showcase value and handle objections',
    category: 'Sales',
    items: [
      { id: '1', content: 'Recap prospect needs from discovery', order: 0 },
      { id: '2', content: 'Demo key features relevant to pain points', order: 1 },
      { id: '3', content: 'Show ROI and business value', order: 2 },
      { id: '4', content: 'Handle objections and questions', order: 3 },
      { id: '5', content: 'Trial or pilot discussion', order: 4 },
      { id: '6', content: 'Agree on next steps and timeline', order: 5 },
    ],
    isPublic: true,
    isFeatured: true,
    aiEnabled: true,
    usageCount: 98,
    avgCompletionRate: 92,
    createdBy: 'Sidekick',
    tags: ['sales', 'demo', 'product'],
  },
  {
    id: '3',
    name: 'Closing Call',
    description: 'Final steps to secure commitment and close the deal',
    category: 'Sales',
    items: [
      { id: '1', content: 'Confirm decision criteria met', order: 0 },
      { id: '2', content: 'Review pricing and contract terms', order: 1 },
      { id: '3', content: 'Address final concerns', order: 2 },
      { id: '4', content: 'Get verbal commitment', order: 3 },
      { id: '5', content: 'Outline implementation timeline', order: 4 },
      { id: '6', content: 'Send contract and next steps', order: 5 },
    ],
    isPublic: true,
    isFeatured: true,
    aiEnabled: true,
    usageCount: 156,
    avgCompletionRate: 94,
    createdBy: 'Sidekick',
    tags: ['sales', 'closing', 'negotiation'],
  },
  {
    id: '4',
    name: 'Customer Success Onboarding',
    description: 'Guide new customers through successful implementation',
    category: 'Customer Success',
    items: [
      { id: '1', content: 'Welcome and set expectations', order: 0 },
      { id: '2', content: 'Review implementation plan', order: 1 },
      { id: '3', content: 'Schedule training sessions', order: 2 },
      { id: '4', content: 'Assign success manager', order: 3 },
      { id: '5', content: 'Set up communication channels', order: 4 },
    ],
    isPublic: false,
    isFeatured: false,
    aiEnabled: true,
    usageCount: 45,
    avgCompletionRate: 88,
    createdBy: 'John Doe',
    tags: ['customer success', 'onboarding'],
  },
]

const categories = [
  { name: 'All Templates', count: templates.length },
  { name: 'Sales', count: 3 },
  { name: 'Customer Success', count: 1 },
  { name: 'My Templates', count: 1 },
]

export default function TemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Templates')
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Templates' ||
      template.category === selectedCategory ||
      (selectedCategory === 'My Templates' && template.createdBy === 'John Doe')
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Templates
          </h1>
          <p className="mt-2 text-gray-600">
            Browse and manage your sales playbook templates
          </p>
        </div>
        <Link
          href="/dashboard/templates/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 transition"
        >
          <Plus className="h-5 w-5" />
          Create Template
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                selectedCategory === category.name
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                selectedCategory === category.name
                  ? 'bg-primary-200 text-primary-800'
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="group relative rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-primary-300 transition cursor-pointer"
            onClick={() => setSelectedTemplate(template.id)}
          >
            {/* Header */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {template.isFeatured && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                  {template.aiEnabled && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700">
                      <Sparkles className="h-3 w-3" />
                      AI
                    </div>
                  )}
                </div>

                {/* Actions dropdown */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Toggle dropdown
                    }}
                    className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {template.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {template.description}
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>{template.items.length} items</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{template.usageCount} uses</span>
              </div>
            </div>

            {/* Completion rate */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="text-gray-600">Avg. completion</span>
                <span className="font-semibold text-gray-900">
                  {template.avgCompletionRate}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-600 rounded-full transition-all"
                  style={{ width: `${template.avgCompletionRate}%` }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {template.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
                {template.tags.length > 2 && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                    +{template.tags.length - 2}
                  </span>
                )}
              </div>

              {template.isPublic ? (
                <span className="text-xs text-gray-500">Public</span>
              ) : (
                <span className="text-xs text-primary-600 font-medium">Private</span>
              )}
            </div>

            {/* Hover actions */}
            <div className="absolute inset-x-0 bottom-0 flex gap-2 p-4 bg-gradient-to-t from-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Use template:', template.id)
                }}
                className="flex-1 rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition"
              >
                Use Template
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('View template:', template.id)
                }}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {filteredTemplates.length === 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No templates found
          </h3>
          <p className="text-gray-600 mb-6">
            {searchQuery
              ? `No templates match "${searchQuery}"`
              : 'Create your first custom template to get started'}
          </p>
          <Link
            href="/dashboard/templates/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 transition"
          >
            <Plus className="h-5 w-5" />
            Create Template
          </Link>
        </div>
      )}

      {/* Featured templates section */}
      {selectedCategory === 'All Templates' && filteredTemplates.length > 0 && (
        <div className="rounded-xl border border-primary-200 bg-gradient-to-br from-primary-50 to-blue-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-primary-600 p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Explore Featured Templates
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                These battle-tested playbooks are used by top-performing sales teams.
                Each template is optimized for AI auto-checking.
              </p>
              <div className="flex flex-wrap gap-2">
                {templates
                  .filter((t) => t.isFeatured)
                  .slice(0, 3)
                  .map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-gray-900 shadow-sm hover:shadow transition"
                    >
                      {template.name}
                      <Sparkles className="h-3.5 w-3.5 text-primary-600" />
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
