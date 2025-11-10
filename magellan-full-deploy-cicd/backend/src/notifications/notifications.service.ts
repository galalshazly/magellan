
import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class NotificationsService {
  private app: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      // Initialize with env var JSON or path
      if (process.env.FCM_SERVICE_ACCOUNT_JSON) {
        const creds = JSON.parse(process.env.FCM_SERVICE_ACCOUNT_JSON);
        this.app = admin.initializeApp({ credential: admin.credential.cert(creds) });
      } else {
        this.app = admin.initializeApp();
      }
    } else {
      this.app = admin.app();
    }
  }

  async notifyUser(userId: string, message: string) {
    // In real system, map userId -> device tokens; for demo, use topic
    const topic = `user_${userId}`;
    try {
      await admin.messaging().send({ notification: { title: 'Magellan', body: message }, topic });
    } catch (e) {
      console.error('FCM send error', e);
    }
  }
}
