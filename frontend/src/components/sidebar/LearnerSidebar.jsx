import {
  LayoutDashboard,
  Search,
  BookCheck,
  LineChart,
  MessageSquare,
  UserCircle,
} from 'lucide-react';
import SidebarBase from './SidebarBase';

const learnerNavItems = [
  { path: '/learner/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/learner/browse', icon: <Search size={20} />, label: 'Browse Courses' },
  { path: '/learner/my-courses', icon: <BookCheck size={20} />, label: 'My Courses' },
  { path: '/learner/progress', icon: <LineChart size={20} />, label: 'Progress' },
  { path: '/profile', icon: <UserCircle size={20} />, label: 'Profile' },
];

export default function LearnerSidebar(props) {
  return <SidebarBase navItems={learnerNavItems} {...props} />;
}
