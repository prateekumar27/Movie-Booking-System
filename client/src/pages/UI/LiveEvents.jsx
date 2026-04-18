import { events } from "../../utils/constants";

const LiveEvents = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-3 sm:px-4 py-6 sm:py-10 mb-4 bg-white rounded-2xl">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
        The Best Of Live Events
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
        {events.map((event, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden cursor-pointer border border-[#dcfce7] shadow-sm 
                       transition-all duration-300 ease-in-out
                       hover:scale-105 hover:shadow-[0_6px_20px_rgba(22,163,74,0.15)] hover:border-[#16a34a]"
          >
            <img
              src={event.img}
              alt={event.title}
              className="w-full h-[150px] sm:h-[180px] md:h-[200px] lg:h-[224px] object-cover block"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEvents;
