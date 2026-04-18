import BannerSlider from "../pages/UI/BannerSlider.jsx";
import Recommended from "../pages/UI/Recommended.jsx";
import LiveEvents from "../pages/UI/LiveEvents.jsx";

const Home = () => {
  return (
    <div>
      <BannerSlider />
      <Recommended />
      <LiveEvents />
    </div>
  );
};

export default Home;
