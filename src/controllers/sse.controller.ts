import type { Request, Response, NextFunction } from "express";
import { InternalType, notifications, sseClients } from "../lib/notifications.js";

export const handleSSEConnect = (req: Request, res: Response) => {
  res.set({
    // 브라우저나 중간 프록시가 응답을 캐싱하지 않도록 설정, SSE는 실시간 스트리밍이라 캐시되면 안됨. -> 매번 서버와 새롭게 통신
    'Cache-Control': 'no-cache',
    // SSE 프로토콜의 핵심: 서버가 보낼 데이터가 이벤트 스트림 형식이라는 것을 명시한다.
    // 브라우저는 이 MIME 타입을 보고 EventSource API를 통해 한 줄 한 줄을 이벤트로 파싱
    'Content-Type': 'text/event-stream',
    // HTTP 연결을 끊지 않고 계속 유지하도록 지시
    // 일반 HTTP 요청은 응답이 끝나면 연결을 끊지만, SSE는 서버가 계속해서 res.write 로 데이터를 흘려보내야 하므로 연결을 열어둔다.
    'Connection': 'keep-alive',
  });
  
  // 아직 클라이언트로 보내지 않은 HTTP 응답 헤더를 즉시 전송(flush) 하도록 강제로 실행하는 메서드
  // SSE는 연결 직후 바로 헤더가 전송되어야 브라우저가 스트리밍 응답을 파싱할 수 있음.
  // flushHeaders()를 호출하지 않으면, Node.js가 데이터를 조금 더 모았다가 한꺼번에 보낼 수도 있는데, 클라이언트는 연결이 늦게 열린 것처럼 느껴짐.
  // SSE에서는 res.flushHeaders()로 헤더를 강제 전송하고, 이후에는 `res.write(...)`로 이벤트 데이터를 스트리밍
  res.flushHeaders();

  sseClients.add(res);

  res.write(`event: unread:\n`);
  res.write(`data: ${JSON.stringify({ unread: 1 })}\n\n`);

  console.log('CONNECT!');
  
  const ping = setInterval(() => {
    res.write(`event: ping:\n`);
    // res.write(`data: {}\n\n`)`);
    res.write(`data: {}\n\n`);
    console.log('PING');
  }, 25_000);

  req.on('close', () => {
    console.log('CLOSE!')
    clearInterval(ping);
    sseClients.delete(res);
  });
}

export const handleNotifications = (req: Request, res: Response) => {
  const limit = Math.min(parseInt((req.query.limit as string) || '20', 10), 100);
  const cursor = req.query.cursor ? parseInt(req.query.cursor as string, 10) : null;

  const sorted = [...notifications].sort((a, b) => b.created_at - a.created_at);
  const filtered = cursor ? sorted.filter((n) => n.created_at < cursor) : sorted;
  const page = filtered.slice(0, limit);

  const items = page.map((n) => {
    if (n.type === InternalType.INBOX) return { ...n.payload, created_at: n.created_at };
    if (n.type === InternalType.RESERVATION) return { ...n.payload, created_at: n.created_at };
    return { ...n.payload, created_at: n.created_at };
  });

  const pageItem = page[page.length - 1];

  const nextCursor = page.length > 0 && pageItem ? pageItem.created_at : null;
  res.json({ items, nextCursor });
}