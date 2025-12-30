export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Under Maintenance
        </h1>
        <p className="text-gray-600 mb-6">
          JoyJuncture is currently undergoing maintenance. Please check back
          soon!
        </p>
        <div className="text-sm text-gray-500">
          Admin can disable this in Settings
        </div>
      </div>
    </div>
  );
}
