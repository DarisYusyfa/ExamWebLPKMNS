export class AntiCheatManager {
  private static instance: AntiCheatManager;
  private isActive = false;
  private onViolation?: () => void;

  static getInstance(): AntiCheatManager {
    if (!AntiCheatManager.instance) {
      AntiCheatManager.instance = new AntiCheatManager();
    }
    return AntiCheatManager.instance;
  }

  startMonitoring(onViolation: () => void): void {
    this.onViolation = onViolation;
    this.isActive = true;

    // Prevent tab switching
    this.setupVisibilityListener();

    // Prevent reload/navigation
    this.setupBeforeUnloadListener();

    // Prevent context menu
    this.setupContextMenuListener();

    // Prevent common keyboard shortcuts
    this.setupKeyboardListener();

    // Monitor fullscreen
    this.setupFullscreenListener();

    // Request fullscreen
    // this.requestFullscreen();
  }

  stopMonitoring(): void {
    this.isActive = false;
    this.removeAllListeners();
    this.exitFullscreen();
  }

  private setupVisibilityListener(): void {
    const handleVisibilityChange = () => {
      if (this.isActive && document.hidden) {
        this.handleViolation('Tab switching detected');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', () => {
      if (this.isActive) {
        this.handleViolation('Window lost focus');
      }
    });
  }

  private setupBeforeUnloadListener(): void {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (this.isActive) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave the exam?';
        return 'Are you sure you want to leave the exam?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
  }

  private setupContextMenuListener(): void {
    const handleContextMenu = (e: MouseEvent) => {
      if (this.isActive) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
  }

  private setupKeyboardListener(): void {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!this.isActive) return;

      // Prevent common shortcuts
      const forbiddenKeys = [
        'F12', // DevTools
        'F5', // Refresh
        'F11', // Fullscreen toggle
      ];

      const forbiddenCombos = [
        { ctrl: true, key: 'r' }, // Ctrl+R (refresh)
        { ctrl: true, key: 'R' },
        { ctrl: true, shift: true, key: 'I' }, // Ctrl+Shift+I (DevTools)
        { ctrl: true, shift: true, key: 'J' }, // Ctrl+Shift+J (Console)
        { ctrl: true, shift: true, key: 'C' }, // Ctrl+Shift+C (Inspect)
        { ctrl: true, key: 'u' }, // Ctrl+U (View Source)
        { ctrl: true, key: 'U' },
        { alt: true, key: 'Tab' }, // Alt+Tab (switch windows)
        { ctrl: true, key: 'Tab' }, // Ctrl+Tab (switch tabs)
        { ctrl: true, shift: true, key: 'Tab' },
        { cmd: true, key: 'Tab' }, // Cmd+Tab (Mac)
      ];

      if (forbiddenKeys.includes(e.key)) {
        e.preventDefault();
        this.handleViolation(`Forbidden key pressed: ${e.key}`);
        return;
      }

      for (const combo of forbiddenCombos) {
        const ctrlPressed = combo.ctrl && (e.ctrlKey || e.metaKey);
        const shiftPressed = combo.shift ? e.shiftKey : true;
        const altPressed = combo.alt ? e.altKey : true;
        const cmdPressed = combo.cmd && e.metaKey;

        if ((ctrlPressed || cmdPressed) && shiftPressed && altPressed && e.key.toLowerCase() === combo.key.toLowerCase()) {
          e.preventDefault();
          this.handleViolation(`Forbidden key combination detected`);
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
  }

  private setupFullscreenListener(): void {
    // Tidak melakukan apa-apa lagi, listener dimatikan
  }

  private async requestFullscreen(): Promise<void> {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.warn('Could not enter fullscreen mode:', error);
    }
  }

  private exitFullscreen(): void {
    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(console.warn);
    }
  }

  private handleViolation(reason: string): void {
    console.warn('Anti-cheat violation:', reason);
    if (this.onViolation) {
      this.onViolation();
    }
  }

  private removeAllListeners(): void {
    // This is a simplified version - in a real implementation,
    // you'd want to store references to the specific handlers
    // and remove them individually
  }
}
