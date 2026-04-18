const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#f0fdf4]/60">
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {/* Spinning loader */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin"></div>

        {/* Label */}
        <p className="text-base sm:text-lg font-semibold text-[#15803d] animate-pulse text-center px-4">
          Warming Up the projector...
        </p>
      </div>
    </div>
  );
};

export default FullScreenLoader;
