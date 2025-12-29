import {
  LayoutDashboard,
  BookCheck,
  LineChart,
  MessageSquare,
  UserCircle,
} from 'lucide-react';
import SidebarBase from './SidebarBase';

const instructorNavItems = [
  { path: '/instructor/dashboard', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/instructor/courses', icon: <BookCheck size={20} />, label: 'My Courses' },
  { path: '/instructor/create-course', icon: <LineChart size={20} />, label: 'Create Course' },
  { path: '/instructor/enrollments', icon: <MessageSquare size={20} />, label: 'Enrollments' },
  { path: '/profile', icon: <UserCircle size={20} />, label: 'Profile' },
];

export default function InstructorSidebar(props) {
  return <SidebarBase navItems={instructorNavItems} {...props} />;
}
