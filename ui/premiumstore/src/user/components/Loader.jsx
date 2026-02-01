export default function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        {/* Main spinner */}
        <div className="w-12 h-12 border-2 border-slate-200 border-t-amber-700 rounded-full animate-spin" />
        
        {/* Optional: Inner dot for added elegance */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-amber-700 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}