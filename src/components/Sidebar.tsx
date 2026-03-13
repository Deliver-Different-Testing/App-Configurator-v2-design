import { useState } from 'react';
import type { ActivePage } from '../App';

interface NavChild {
  label: string;
  badge?: string;
  badgeType?: string;
  page?: ActivePage;
}

interface NavSectionData {
  icon: string;
  label: string;
  children?: NavChild[];
  defaultOpen?: boolean;
}

const NAV_SECTIONS: NavSectionData[] = [
  { icon: '🏠', label: 'General', children: [] },
  { icon: '🚚', label: 'Services', children: [] },
  { icon: '👥', label: 'Users & Permissions', children: [] },
  {
    icon: '⚙️', label: 'Advanced', defaultOpen: true, children: [
      { label: 'Tasks', badge: 'Implemented', badgeType: 'implemented' },
      { label: 'Schedules', badge: 'Implemented', badgeType: 'implemented' },
      { label: 'Notifications', badge: 'Implemented', badgeType: 'implemented' },
      { label: 'Automations', badge: 'Implemented', badgeType: 'implemented', page: 'automations' },
      { label: 'Territory & Locations', badge: 'Implemented', badgeType: 'implemented' },
      { label: 'Integrations Hub', badge: 'Beta', badgeType: 'beta' },
      { label: 'Dashboards', badge: 'Implemented', badgeType: 'implemented' },
      { label: 'Site Settings', badge: 'Implemented', badgeType: 'implemented' },
      { label: 'App Setup', page: 'app-setup' },
    ],
  },
  { icon: '📦', label: 'Import & Export' },
];

interface SidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(NAV_SECTIONS.filter(s => s.defaultOpen).map(s => [s.label, true]))
  );

  const toggle = (label: string) => {
    setOpenSections(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="sidebar-brand">
        <div className="logo-mark">DD</div>
        <span><em>Deliver</em> Different</span>
      </div>

      <div className="sidebar-nav">
        {NAV_SECTIONS.map(section => {
          const hasActiveChild = section.children?.some(c => c.page);
          const isDisabledParent = !hasActiveChild && !section.children?.length;

          return (
            <div className="nav-section" key={section.label}>
              <div
                className={`nav-item${isDisabledParent ? ' disabled' : ''}`}
                onClick={() => section.children && section.children.length > 0 && toggle(section.label)}
                style={isDisabledParent ? { opacity: 0.35, cursor: 'default' } : undefined}
              >
                <span className="nav-icon">{section.icon}</span>
                <span className="nav-label">{section.label}</span>
                {section.children && section.children.length > 0 && (
                  <span className={`nav-chevron${openSections[section.label] ? ' open' : ''}`}>▸</span>
                )}
              </div>
              {section.children && section.children.length > 0 && (
                <div className={`sub-nav${openSections[section.label] ? ' open' : ''}`}>
                  {section.children.map(child => {
                    const isActive = child.page === activePage;
                    const isClickable = !!child.page;
                    return (
                    <div
                      className={`nav-item${isActive ? ' active' : ''}`}
                      key={child.label}
                      style={!isClickable ? { opacity: 0.35, cursor: 'default' } : { cursor: 'pointer' }}
                      onClick={() => child.page && onNavigate(child.page)}
                    >
                      <span className="nav-label">{child.label}</span>
                      {child.badge && (
                        <span className={`nav-badge ${child.badgeType}`}>{child.badge}</span>
                      )}
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-collapse" onClick={() => setCollapsed(!collapsed)}>
        <span className="nav-icon">◀</span>
        <span>Collapse</span>
      </div>

      <div className="sidebar-user">
        <div className="avatar">SA</div>
        <div className="sidebar-user-info">
          <div className="name">Steve Arlow</div>
          <div className="role">Admin</div>
        </div>
      </div>
    </div>
  );
}
