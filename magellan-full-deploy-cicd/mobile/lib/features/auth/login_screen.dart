
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:dio/dio.dart';
import '../../data/api_client.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../notifications/fcm_service.dart';
import 'package:go_router/go_router.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  String phone = '';
  String code = '';
  bool sent = false;

  Future<void> _request() async {
    await ApiClient().dio.post('/auth/request-otp', data: {'phone': phone});
    setState(()=> sent = true);
  }

  Future<void> _verify() async {
    final res = await ApiClient().dio.post('/auth/verify-otp', data: {'phone': phone, 'code': code});
    final token = res.data['token'];
    final userId = res.data['user']['id'];
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt', token);
    ApiClient().dio.options.headers['Authorization'] = 'Bearer $token';
    await FcmService.subscribeUserTopic(userId);
    if (mounted) GoRouter.of(context).go('/menu');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('تسجيل الدخول')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(decoration: const InputDecoration(labelText: 'رقم الجوال'), onChanged: (v)=> phone=v),
            const SizedBox(height: 12),
            if (!sent)
              FilledButton(onPressed: _request, child: const Text('إرسال رمز')),
            if (sent) ...[
              TextField(decoration: const InputDecoration(labelText: 'الرمز'), onChanged: (v)=> code=v),
              const SizedBox(height: 12),
              FilledButton(onPressed: _verify, child: const Text('تحقق')),
            ]
          ],
        ),
      ),
    );
  }
}
