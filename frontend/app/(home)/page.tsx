import HomeHeader from "./components/home-header";
import QuickActions from "./components/quick-actions";
import RecentActivity from "./components/recent-activity";

export default function HomePage() {
  return (
    <div>
      <HomeHeader />
      <QuickActions />
      <RecentActivity />
    </div>
  );
}