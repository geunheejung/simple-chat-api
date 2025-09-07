import { faker } from '@faker-js/faker';
import type { Response } from 'express';

/**
 * 타입 정의
 */
type AuthorType = 'GUEST' | 'HOST' | 'SUPPORT';
type ReservationStatus = 'REQUEST' | 'CANCEL' | 'COMPLETED';
type NoticeTarget = 'GUEST' | 'HOST';

export enum InternalType {
  INBOX = 'inbox',
  RESERVATION = 'reservation',
  NOTICE = 'notice',
}

export interface NotificationInternal {
  id: string;
  type: InternalType;
  created_at: number; // ms
  readAt: number | null;
  payload: any;
}

/**
 * 저장소: 단일 유저 알림 리스트
 */
export const notifications: NotificationInternal[] = [];
export const sseClients = new Set<Response>();

/**
 * 더미 알림 생성
 */
export function makeFakeInternal(): NotificationInternal {
  const pick = faker.helpers.arrayElement<InternalType>([
    InternalType.INBOX,
    InternalType.RESERVATION,
    InternalType.NOTICE,
  ]);
  const created_at = Date.now();
  const id = faker.string.uuid();

  if (pick === InternalType.INBOX) {
    return {
      id,
      type: InternalType.INBOX,
      created_at,
      readAt: null,
      payload: {
        inbox_id: faker.string.uuid(),
        comment_id: faker.string.uuid(),
        author_type: faker.helpers.arrayElement<AuthorType>(['GUEST', 'HOST', 'SUPPORT']),
      },
    };
  }
  if (pick === InternalType.RESERVATION) {
    return {
      id,
      type: InternalType.RESERVATION,
      created_at,
      readAt: null,
      payload: {
        reservation_id: faker.string.uuid(),
        reservation_status: faker.helpers.arrayElement<ReservationStatus>([
          'REQUEST',
          'CANCEL',
          'COMPLETED',
        ]),
      },
    };
  }
  return {
    id,
    type: InternalType.NOTICE,
    created_at,
    readAt: null,
    payload: {
      notice_id: faker.string.uuid(),
      target: faker.helpers.arrayElement<NoticeTarget>(['GUEST', 'HOST']),
    },
  };
}

/**
 * 유틸
 */
export function unreadCount(): number {
  return notifications.filter((n) => !n.readAt).length;
}

export function broadcastUnread() {
  const payload = JSON.stringify({ unread: unreadCount() });
  for (const res of sseClients) {
    res.write(`event: unread\n`);
    res.write(`data: ${payload}\n\n`);
  }
}