import { Cog6ToothIcon, CodeBracketIcon, BookmarkIcon, CalculatorIcon, InboxIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'next-i18next';
import NavigationItems from './NavigationItems';
import { NavigationProps, MenuItem } from './NavigationItems';

interface NavigationItemsProps extends NavigationProps {
  slug: string;
}

const TeamNavigation = ({ slug, activePathname }: NavigationItemsProps) => {
  const { t } = useTranslation('common');

  const menus: MenuItem[] = [
    {
      name: "Promos",
      href: `/teams/${slug}/promos`,
      icon: BookmarkIcon,
      active: activePathname === `/teams/${slug}/promos`,
    },{
      name: "Insights",
      href: `/teams/${slug}/products`,
      icon: InboxIcon,
      active: activePathname === `/teams/${slug}/products`,
    },{
      name: t('settings'),
      href: `/teams/${slug}/settings`,
      icon: Cog6ToothIcon,
      active:
        activePathname?.startsWith(`/teams/${slug}`) &&
        !["promos", "products"].some(e=>activePathname.includes(e)),
    },
  ];

  return <NavigationItems menus={menus} />;
};

export default TeamNavigation;
