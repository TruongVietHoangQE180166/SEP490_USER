import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { API_BASE_URL } from './apiConfig';

class SocketService {
    private client: Client | null = null;
    private userId: string | null = null;
    private isAttemptingConnect = false;

    connect(userId: string) {
        if (this.client && this.client.connected && this.userId === userId) {
            console.log("🔵 [Socket] Đã kết nối với server, bỏ qua việc tạo connection mới.");
            return;
        }

        if (this.isAttemptingConnect) {
            console.log("🟡 [Socket] Đang trong quá trình kết nối rồi, vui lòng đợi...");
            return;
        }

        // Đảm bảo ngắt kết nối cũ nếu đổi userId
        if (this.client && this.userId !== userId) {
            this.disconnect();
        }

        this.userId = userId;
        this.isAttemptingConnect = true;
        console.log(`🟡 [Socket] Bắt đầu khởi tạo kết nối với userId: ${userId} qua ${API_BASE_URL}/ws`);

        this.client = new Client({
            webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
            connectHeaders: {
                userId: userId
            },
            reconnectDelay: 10000, 
            heartbeatIncoming: 20000,
            heartbeatOutgoing: 20000,
            onConnect: (frame) => {
                this.isAttemptingConnect = false;
                console.log("✅ [Socket] Connected thành công: ", frame);

                // Theo cấu hình ở file test
                this.client?.subscribe(`/topic/trading/${userId}`, (message) => {
                    console.log("📩 [Socket Message Giao dịch] " + message.body);
                });
            },
            onStompError: (frame) => {
                this.isAttemptingConnect = false;
                console.error("❌ [Socket] STOMP Error: Lỗi giao thức.");
                console.error("❌ [Socket] Headers:", frame.headers);
                console.error("❌ [Socket] Body:", frame.body);
            },
            onWebSocketError: (event) => {
                this.isAttemptingConnect = false;
                console.error("🔴 [Socket] Lỗi kết nối WebSocket (Server có thể đang down):", event);
            },
            onDisconnect: () => {
                this.isAttemptingConnect = false;
                console.log("🔴 [Socket] Disconnected.");
            }
        });

        // Bắt đầu chạy background process
        this.client.activate();
    }

    disconnect() {
        if (this.client) {
            console.log("🟡 [Socket] Đang thực hiện ngắt kết nối chủ động...");
            this.client.deactivate();
            this.client = null;
            this.userId = null;
            this.isAttemptingConnect = false;
        } else {
            console.log("🔵 [Socket] Chưa có connection nào tồn tại để ngắt.");
        }
    }
}

// Global Singleton Instance
export const socketService = new SocketService();
