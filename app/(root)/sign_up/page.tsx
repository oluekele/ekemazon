// app/(root)/sign_up/page.tsx
import SignupForm from "@/components/SignupForm";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Suspense fallback={<p>Loading signup form...</p>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
