
import { Lock, Home, ArrowLeft } from 'lucide-react';

export default function NoAccessPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md mx-auto">
        
        {/* Lock Icon */}
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full">
            <Lock className="w-12 h-12 text-red-600" strokeWidth={2} />
          </div>
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-900 mb-3">
          403
        </h1>

        {/* Error Title */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
          Access Forbidden
        </h2>

        {/* Error Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 mb-8"></div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-gray-700 rounded-md font-medium hover:bg-gray-100 transition-colors border border-gray-300 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors shadow-sm"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12">
          <p className="text-sm text-gray-500">
            Error Code: 403 Forbidden
          </p>
        </div>
      </div>
    </div>
  );
}