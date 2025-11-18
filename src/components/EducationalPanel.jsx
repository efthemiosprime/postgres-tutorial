import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Info, AlertTriangle, Lightbulb, Code, CheckCircle, XCircle, Target } from 'lucide-react';

const panelTypes = {
  default: {
    icon: BookOpen,
    borderColor: 'border-blue-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    hoverGradient: 'from-blue-100 to-indigo-100',
    iconColor: 'text-blue-600'
  },
  info: {
    icon: Info,
    borderColor: 'border-blue-500',
    bgGradient: 'from-blue-50 to-indigo-50',
    hoverGradient: 'from-blue-100 to-indigo-100',
    iconColor: 'text-blue-600'
  },
  warning: {
    icon: AlertTriangle,
    borderColor: 'border-yellow-500',
    bgGradient: 'from-yellow-50 to-amber-50',
    hoverGradient: 'from-yellow-100 to-amber-100',
    iconColor: 'text-yellow-600'
  },
  tip: {
    icon: Lightbulb,
    borderColor: 'border-green-500',
    bgGradient: 'from-green-50 to-emerald-50',
    hoverGradient: 'from-green-100 to-emerald-100',
    iconColor: 'text-green-600'
  },
  concept: {
    icon: Target,
    borderColor: 'border-purple-500',
    bgGradient: 'from-purple-50 to-pink-50',
    hoverGradient: 'from-purple-100 to-pink-100',
    iconColor: 'text-purple-600'
  },
  example: {
    icon: Code,
    borderColor: 'border-indigo-500',
    bgGradient: 'from-indigo-50 to-blue-50',
    hoverGradient: 'from-indigo-100 to-blue-100',
    iconColor: 'text-indigo-600'
  }
};

export default function EducationalPanel({ 
  title, 
  children, 
  defaultOpen = true,
  type = 'default',
  icon: customIcon
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const panelStyle = panelTypes[type] || panelTypes.default;
  const IconComponent = customIcon || panelStyle.icon;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden border-l-4 ${panelStyle.borderColor}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-6 py-4 bg-gradient-to-r ${panelStyle.bgGradient} hover:${panelStyle.hoverGradient} transition-colors flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <IconComponent className={`w-5 h-5 ${panelStyle.iconColor}`} />
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {isOpen && (
        <div className="p-6 prose prose-sm max-w-none">
          {children}
        </div>
      )}
    </div>
  );
}

// Helper components for common educational content patterns
export function KeyConcept({ term, definition, example }) {
  return (
    <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
      <div className="flex items-start gap-3">
        <Target className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-purple-900">{term}</strong>
          <p className="text-gray-700 text-sm mt-1">{definition}</p>
          {example && (
            <div className="mt-2 p-2 bg-white rounded border border-purple-200">
              <code className="text-xs text-purple-800">{example}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Prerequisites({ items }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2 mb-2">
        <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
        <h4 className="font-semibold text-blue-900">Prerequisites</h4>
      </div>
      <ul className="list-disc list-inside space-y-1 text-sm text-gray-700 ml-7">
        {items.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function CommonMistakes({ mistakes }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg mb-4">
      <div className="flex items-start gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        <h4 className="font-semibold text-yellow-900">Common Mistakes to Avoid</h4>
      </div>
      <div className="space-y-3">
        {mistakes.map((mistake, idx) => (
          <div key={idx} className="bg-white rounded p-3 border border-yellow-200">
            <div className="flex items-start gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <strong className="text-gray-900 text-sm">{mistake.wrong}</strong>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700 text-sm">{mistake.correct}</span>
            </div>
            {mistake.explanation && (
              <p className="text-xs text-gray-600 mt-2 ml-6">{mistake.explanation}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function StepByStep({ steps }) {
  return (
    <div className="space-y-4 mb-4">
      {steps.map((step, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              {idx + 1}
            </div>
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{step.title}</h4>
            <p className="text-gray-700 text-sm">{step.description}</p>
            {step.code && (
              <div className="mt-2 p-3 bg-gray-50 rounded border border-gray-200">
                <code className="text-xs text-gray-800">{step.code}</code>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function RealWorldExample({ title, description, example }) {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-2 mb-2">
        <Lightbulb className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <h4 className="font-semibold text-green-900">{title}</h4>
          <p className="text-gray-700 text-sm mt-1">{description}</p>
          {example && (
            <div className="mt-2 p-2 bg-white rounded border border-green-200">
              <p className="text-xs text-gray-700 italic">{example}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function VisualExample({ title, children }) {
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
      <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">
        <Code className="w-4 h-4" />
        {title}
      </h4>
      <div className="bg-white rounded p-3 border border-indigo-200">
        {children}
      </div>
    </div>
  );
}
