
import 'package:flutter/material.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;

class OrderTrackScreen extends StatefulWidget {
  final String orderId;
  const OrderTrackScreen({super.key, required this.orderId});

  @override
  State<OrderTrackScreen> createState() => _OrderTrackScreenState();
}

class _OrderTrackScreenState extends State<OrderTrackScreen> {
  IO.Socket? socket;
  LatLng? driver;

  @override
  void initState() {
    super.initState();
    socket = IO.io(const String.fromEnvironment('SOCKET_BASE', defaultValue: 'http://localhost:3000'), IO.OptionBuilder().setTransports(['websocket']).disableAutoConnect().build());
    socket!.connect();
    socket!.emit('joinOrder', {'orderId': widget.orderId});
    socket!.on('location', (data) {
      setState(()=> driver = LatLng((data['lat'] as num).toDouble(), (data['lng'] as num).toDouble()));
    });
    socket!.on('status', (data) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('الحالة: ${data['status']}')));
    });
  }

  @override
  void dispose() {
    socket?.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('تتبع الطلب')),
      body: GoogleMap(
        initialCameraPosition: const CameraPosition(target: LatLng(24.7136, 46.6753), zoom: 12),
        markers: { if (driver != null) Marker(markerId: const MarkerId('driver'), position: driver!) },
      ),
    );
  }
}
