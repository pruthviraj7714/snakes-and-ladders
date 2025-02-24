'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export function useSocket() {
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [wsError, setWsError] = useState<null | Event>(null);
    const { data: session } = useSession();
    //@ts-ignore
    const token = session?.user.accessToken;

    useEffect(() => {
        if (!token) return;

        const ws = new WebSocket(`ws://localhost:8080?token=${token}`);

        ws.onopen = () => setWs(ws);
        ws.onerror = (e) => setWsError(e);

        ws.onclose = () => setWs(null);

        return () => {
            ws.close();
        };
    }, [token]);

    return { ws, wsError };
}
