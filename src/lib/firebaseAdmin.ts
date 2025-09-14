import * as admin from 'firebase-admin';
import { type Messaging  } from 'firebase-admin/messaging'

const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID || '',
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL || '',
      privateKey: privateKey || '',
    }),
  });
}

export const fcm: Messaging = admin.messaging();
