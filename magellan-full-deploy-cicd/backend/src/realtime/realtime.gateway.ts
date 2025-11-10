
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class RealtimeGateway implements OnGatewayConnection {
  @WebSocketServer() server: Server;

  handleConnection() {}

  @SubscribeMessage('joinOrder')
  handleJoin(client: any, payload: { orderId: string }) {
    client.join(`order_${payload.orderId}`);
  }

  broadcastOrderLocation(orderId: string, lat: number, lng: number) {
    this.server.to(`order_${orderId}`).emit('location', { lat, lng });
  }

  broadcastOrderStatus(orderId: string, status: string) {
    this.server.to(`order_${orderId}`).emit('status', { status });
  }
}
