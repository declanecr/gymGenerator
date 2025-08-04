import UserPageMobile from './UserPageMobile';
import UserPageTablet from './UserPageTablet';
import UserPageDesktop from './UserPageDesktop';
import { useDevice } from '../../context/DeviceContext';

export default function UserPage() {
  const { isMobile, isTablet } = useDevice();
  const View = isMobile ? UserPageMobile : isTablet ? UserPageTablet : UserPageDesktop;
  return <View />;
}