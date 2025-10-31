import { CheckCircle2 } from 'lucide-react';

export default function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary-100 rounded-full animate-pulse">
          <CheckCircle2 className="w-8 h-8 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">
          Loading SideKick...
        </h2>
        <p className="text-gray-500">
          Connecting to your meeting
        </p>
      </div>
    </div>
  );
}
