import React, { useState } from 'react';
import { Bell, Sparkles, CloudRain, AlertCircle, Check, X } from 'lucide-react';
import { NotificationItem } from '../../types/farm';

interface NotificationPopoverProps {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

export const NotificationPopover: React.FC<NotificationPopoverProps> = ({
  notifications,
  onMarkAllAsRead,
  onMarkAsRead,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'recommendation':
        return <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
      case 'weather':
        return <CloudRain className="w-3.5 h-3.5 text-blue-600" />;
      case 'diagnostic':
        return <AlertCircle className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-emerald-600" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      <button
        id="dashboard-notification-bell-btn"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-8.5 h-8.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-300 flex items-center justify-center text-slate-600 hover:text-slate-900 shadow-2xs transition-colors focus:outline-none"
        title="Field Notifications & AI Alerts"
      >
        <Bell className="w-3.5 h-3.5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1e5128] text-[9px] font-mono font-bold text-white ring-2 ring-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-1.5 w-80 sm:w-96 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
            <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Field Telemetry Alerts</h4>
                <p className="text-[10px] text-slate-500 font-mono">
                  {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up'}
                </p>
              </div>

              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={onMarkAllAsRead}
                  className="text-[10px] font-semibold text-[#1e5128] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No notifications or field alerts at this time.
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 text-xs transition-colors flex items-start gap-3 ${
                      !item.read ? 'bg-emerald-50/40' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white border border-slate-200/60 shadow-2xs shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-slate-900 leading-tight truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">{item.timeAgo}</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                        {item.message}
                      </p>
                    </div>

                    {!item.read && (
                      <button
                        onClick={() => onMarkAsRead(item.id)}
                        className="text-slate-400 hover:text-emerald-600 p-1 shrink-0"
                        title="Mark as read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="px-3 pt-2 mt-1 border-t border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-semibold">
                Synced with BRICS Agricultural Grid
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
