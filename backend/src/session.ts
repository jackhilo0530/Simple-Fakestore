import {getCookie, setCookie} from "hono/cookie";

export function ensureSessionId(c: any) {
    let sid = getCookie(c, "sid");
    if(!sid) {
        sid = crypto.randomUUID();
        setCookie(c, "sid", sid, {
            httpOnly: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });
    }
    return sid;
}