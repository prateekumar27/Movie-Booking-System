import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import { banners } from "../../utils/constants.js";

const BannerSlider = () => {
  return (
    <div className="w-full bg-[#f0fdf4] py-3 sm:py-4">
      <Swiper
        modules={[Autoplay, Pagination]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        speed={800}
        style={{ paddingBottom: "36px" }}
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={i}>
            <img
              src={banner}
              alt={`banner-${i}`}
              className="w-full h-[160px] sm:h-[220px] md:h-[260px] lg:h-[300px] object-cover rounded-lg sm:rounded-xl px-2 sm:px-4"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerSlider;
