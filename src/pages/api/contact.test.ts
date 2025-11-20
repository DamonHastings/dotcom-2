import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../lib/email', () => ({ sendContactEmail: vi.fn() }));
vi.mock('../../lib/db', () => ({ saveContactMessage: vi.fn() }));

import handler from './contact';
import { sendContactEmail } from '../../lib/email';
import { saveContactMessage } from '../../lib/db';

function createReq(body = {}, ip = '127.0.0.1') {
  return {
    method: 'POST',
    body,
    headers: {},
    socket: { remoteAddress: ip },
  } as any;
}

function createRes() {
  let _status = 200;
  let _body: any = null;
  return {
    status(code: number) {
      _status = code;
      return this;
    },
    json(obj: any) {
      _body = obj;
      return this;
    },
    // helpers for assertions
    getStatus() {
      return _status;
    },
    getBody() {
      return _body;
    },
  } as any;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('POST /api/contact', () => {
  it('returns 200 and calls email+db on valid input', async () => {
    const req = createReq({ name: 'Alice', email: 'a@example.com', message: 'Hello there' });
    const res = createRes();

    await handler(req, res);

    expect(res.getStatus()).toBe(200);
    expect(sendContactEmail).toHaveBeenCalled();
    expect(saveContactMessage).toHaveBeenCalled();
  });

  it('returns 400 on missing fields', async () => {
    const req = createReq({ name: 'Bob' });
    const res = createRes();

    await handler(req, res);

    expect(res.getStatus()).toBe(400);
  });
});
