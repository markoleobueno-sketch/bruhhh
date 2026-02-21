import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAHelper() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    // Check if app is installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isInstalled) {
      // Listen for install prompt
      const handler = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e as BeforeInstallPromptEvent);
        setShowInstallBanner(true);
      };
      window.addEventListener('beforeinstallprompt', handler);

      return () => window.removeEventListener('beforeinstallprompt', handler);
    }
  }, []);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        console.log('Service Worker registered:', registration);
      }).catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setShowInstallBanner(false);
      setInstallPrompt(null);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        // Schedule daily reminders
        scheduleDailyReminders();
      }
    }
  };

  const scheduleDailyReminders = () => {
    // This would typically use a backend service, but for now we'll use local scheduling
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      // In a real app, you'd set up push notifications with a backend
      console.log('Push notifications would be configured here');
    }
  };

  const sendTestNotification = () => {
    if (Notification.permission === 'granted') {
      new Notification('777LIFE Reminder', {
        body: "Time to log your morning weight! 💪",
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'daily-reminder'
      });
    }
  };

  if (!showInstallBanner && notificationPermission !== 'default') {
    return null;
  }

  return (
    <>
      {showInstallBanner && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          left: '16px',
          right: '16px',
          background: 'linear-gradient(135deg, #a8e063 0%, #56ab2f 100%)',
          borderRadius: '16px',
          padding: '18px',
          boxShadow: '0 8px 24px rgba(168, 224, 99, 0.3)',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>📱</div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '15px', 
                fontWeight: 700, 
                color: '#111', 
                marginBottom: '2px',
                fontFamily: 'Outfit, sans-serif'
              }}>
                Install 777LIFE
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.7)' }}>
                Add to home screen for quick access
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setShowInstallBanner(false)}
                style={{
                  background: 'rgba(0,0,0,0.15)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#111',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                Later
              </button>
              <button
                onClick={handleInstall}
                style={{
                  background: '#111',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#a8e063',
                  cursor: 'pointer',
                  fontFamily: 'Outfit, sans-serif'
                }}
              >
                Install
              </button>
            </div>
          </div>
        </div>
      )}

      {notificationPermission === 'default' && (
        <div style={{
          position: 'fixed',
          bottom: showInstallBanner ? '180px' : '80px',
          left: '16px',
          right: '16px',
          background: 'linear-gradient(135deg, #1a4a7a 0%, #0d2847 100%)',
          borderRadius: '16px',
          padding: '18px',
          boxShadow: '0 8px 24px rgba(26, 74, 122, 0.3)',
          zIndex: 999,
          animation: 'slideUp 0.3s ease-out',
          animationDelay: '0.5s',
          animationFillMode: 'backwards'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ fontSize: '32px' }}>🔔</div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '15px', 
                fontWeight: 700, 
                color: '#fff', 
                marginBottom: '2px',
                fontFamily: 'Outfit, sans-serif'
              }}>
                Enable Notifications
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                Get reminders for workouts & weigh-ins
              </div>
            </div>
            <button
              onClick={requestNotificationPermission}
              style={{
                background: '#a8e063',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#111',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif'
              }}
            >
              Allow
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// Hook for scheduling notifications
export function useNotificationScheduler() {
  useEffect(() => {
    // Check if Notification API is available
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;

    // Schedule morning weight reminder (7 AM)
    const scheduleMorningReminder = () => {
      const now = new Date();
      const reminder = new Date();
      reminder.setHours(7, 0, 0, 0);
      
      if (reminder <= now) {
        reminder.setDate(reminder.getDate() + 1);
      }
      
      const timeout = reminder.getTime() - now.getTime();
      
      return setTimeout(() => {
        new Notification('777LIFE Morning Check', {
          body: "Good morning! Don't forget to log your weight 💪",
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          tag: 'morning-weight'
        });
        scheduleMorningReminder(); // Reschedule for next day
      }, timeout);
    };

    // Schedule evening weight reminder (9 PM)
    const scheduleEveningReminder = () => {
      const now = new Date();
      const reminder = new Date();
      reminder.setHours(21, 0, 0, 0);
      
      if (reminder <= now) {
        reminder.setDate(reminder.getDate() + 1);
      }
      
      const timeout = reminder.getTime() - now.getTime();
      
      return setTimeout(() => {
        new Notification('777LIFE Evening Check', {
          body: "Time to log your evening weight! 🌙",
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          vibrate: [200, 100, 200],
          tag: 'evening-weight'
        });
        scheduleEveningReminder(); // Reschedule for next day
      }, timeout);
    };

    const morningTimeout = scheduleMorningReminder();
    const eveningTimeout = scheduleEveningReminder();

    return () => {
      clearTimeout(morningTimeout);
      clearTimeout(eveningTimeout);
    };
  }, []);
}