
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:go_router/go_router.dart';

class CheckoutScreen extends StatefulWidget {
  const CheckoutScreen({super.key});

  @override
  State<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends State<CheckoutScreen> {
  late final WebViewController controller;

  @override
  void initState() {
    super.initState();
    final extra = GoRouterState.of(context).extra as Map<String, dynamic>?;
    final url = extra?['url'] ?? 'https://example.com';
    controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(Uri.parse(url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('الدفع')),
      body: WebViewWidget(controller: controller),
    );
  }
}
