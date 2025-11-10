
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class FcmService {
  static final _local = FlutterLocalNotificationsPlugin();

  static Future<void> init() async {
    await Firebase.initializeApp();
    await FirebaseMessaging.instance.requestPermission();
    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    await _local.initialize(const InitializationSettings(android: android));

    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      final n = message.notification;
      if (n != null) {
        _local.show(0, n.title, n.body, const NotificationDetails(android: AndroidNotificationDetails('magellan', 'Magellan')));
      }
    });
  }

  static Future<void> subscribeUserTopic(String userId) async {
    await FirebaseMessaging.instance.subscribeToTopic('user_$userId');
  }
}
