import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Accessibility information for our news platform",
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Accessibility</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            Accessibility information for our news platform. This page is currently under construction.
          </p>
          <p className="text-gray-600">
            Please check back later for our complete accessibility statement.
          </p>
        </div>
      </div>
    </div>
  );
}
