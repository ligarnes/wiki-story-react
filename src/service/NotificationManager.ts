export interface NotificationListener {
  successNotification(message: string): void;

  warnNotification(message: string): void;

  errorNotification(error: Array<string>): void;
}

export interface NotificationController {
  setComponent(listener: NotificationListener): void;

  successNotification(message: string): void;

  warnNotification(message: string): void;

  errorNotification(error: string | Array<string>): void;
}

export class NotificationControllerImpl implements NotificationController {
  private notificationListener: NotificationListener | null;

  constructor() {
    this.notificationListener = null;
  }

  setComponent(listener: NotificationListener): void {
    this.notificationListener = listener;
  }

  errorNotification(error: string | Array<string>): void {
    if (this.notificationListener) {
      const errors = [];
      if (typeof error === 'string') {
        errors.push(error);
      } else {
        errors.push(...error);
      }
      this.notificationListener.errorNotification(errors);
    }
  }

  successNotification(message: string): void {
    if (this.notificationListener) {
      this.notificationListener.successNotification(message);
    }
  }

  warnNotification(message: string): void {
    if (this.notificationListener) {
      this.notificationListener.warnNotification(message);
    }
  }
}
