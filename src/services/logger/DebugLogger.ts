type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class DebugLogger {
  private isEnabled: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.isEnabled = localStorage.getItem('conceptscroll_debug') === 'true';
      if (this.isEnabled) {
        console.log('🐞 Debug Logger Initialized (Enabled)');
      }
    }
  }

  enable() {
    this.isEnabled = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('conceptscroll_debug', 'true');
    }
    console.log('🐞 Debug Logger Enabled');
  }

  disable() {
    this.isEnabled = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('conceptscroll_debug');
    }
    console.log('🐞 Debug Logger Disabled');
  }

  log(level: LogLevel, category: string, message: string, data?: any) {
    if (!this.isEnabled) return;

    const timestamp = new Date().toLocaleTimeString();
    const style = this.getStyle(level);
    
    // Check if it's an API error to expand by default
    if (level === 'error') {
      console.group(`%c[${timestamp}] [${category}] ${message}`, style);
    } else {
      console.groupCollapsed(`%c[${timestamp}] [${category}] ${message}`, style);
    }
    
    if (data) {
      console.log('Data:', data);
    }
    // Print stack trace for errors
    if (level === 'error') {
      console.trace();
    }
    console.groupEnd();
  }

  logApiCall(method: string, url: string, status?: number, data?: any) {
    const level = status && status >= 400 ? 'error' : 'info';
    this.log(level, 'API', `${method.toUpperCase()} ${url} ${status ? `(${status})` : ''}`, data);
  }

  logRoute(route: string, authStatus: boolean, params?: any) {
    this.log('info', 'ROUTE', `Navigated to ${route}`, {
      authenticated: authStatus,
      params
    });
  }

  logAuth(action: string, user?: any) {
    const status = user ? 'Authenticated' : 'Unauthenticated';
    this.log('info', 'AUTH', `${action} - User is ${status}`, user);
  }

  private getStyle(level: LogLevel): string {
    switch (level) {
      case 'error': return 'color: #ef4444; font-weight: bold;'; // Red-500
      case 'warn': return 'color: #f59e0b; font-weight: bold;';  // Amber-500
      case 'debug': return 'color: #3b82f6; font-weight: bold;'; // Blue-500
      case 'info':
      default: return 'color: #10b981; font-weight: bold;';      // Emerald-500
    }
  }
}

export const debugLogger = new DebugLogger();

// Expose to window for easy toggling via console
if (typeof window !== 'undefined') {
  (window as any).debugLogger = debugLogger;
}
