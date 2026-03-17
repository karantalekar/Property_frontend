import HeroSlider from "@/component/home/HeroSlider";
import Feature from "@/component/home/Features";
import { getHomeData, getCityData } from "@/API/home";
import Booking_Steps from "@/component/home/Booking_Steps";
import TrendingProperties from "@/component/property/TrendingProperties";
import { getTrendingProperties } from "@/API/property";
import City from "@/component/home/City";
import Newsletter from "@/component/home/Newsletter";
import SearchBar from "@/component/home/searchBarComponents/SearchBar";
export default async function Home() {
  const homeData = await getHomeData();
  const trendingData = await getTrendingProperties();
  const cities = await getCityData();

  return (
    <main>
      <HeroSlider banners={homeData?.banner?.banner || []} />
      <SearchBar
        cityData={cities}
        propertyData={trendingData.type}
        isHomepage={true}
        lang="en"
      />
      <Feature featureData={homeData?.feature} />
      <City cities={cities} />
      <Booking_Steps data={homeData?.booking_steps || homeData?.bookingstep} />
      <TrendingProperties data={trendingData} />
      <Newsletter />
    </main>
  );
}
