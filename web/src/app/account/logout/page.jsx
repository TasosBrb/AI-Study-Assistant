import useAuth from "@/utils/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();
  
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1E1E1E] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 dark:text-gray-100 font-jetbrains-mono">
            Sign Out
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 font-jetbrains-mono">
            Are you sure you want to sign out?
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleSignOut}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 font-jetbrains-mono"
          >
            Sign Out
          </button>
          
          <div className="text-center">
            <a
              href="/dashboard"
              className="font-medium text-orange-600 hover:text-orange-500 font-jetbrains-mono"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}