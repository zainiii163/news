import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use and conditions for our news platform",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 max-w-4xl py-12">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Terms of Use</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-4">
            Terms of use and conditions for our news platform. This page is currently under construction.
          </p>
          <p className="text-gray-600">
            Please check back later for our complete terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
