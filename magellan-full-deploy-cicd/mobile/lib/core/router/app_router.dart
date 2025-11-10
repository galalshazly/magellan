import '../../features/auth/login_screen.dart';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../features/menu/menu_screen.dart';
import '../../features/cart/cart_screen.dart';
import '../../features/checkout/checkout_screen.dart';
import '../../features/orders/order_track_screen.dart';

final appRouterProvider = Provider<GoRouter>((ref) {
  return GoRouter(
    initialLocation: '/menu',
    routes: [
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/menu', builder: (_, __) => const MenuScreen()),
      GoRoute(path: '/cart', builder: (_, __) => const CartScreen()),
      GoRoute(path: '/checkout', builder: (_, __) => const CheckoutScreen()),
      GoRoute(path: '/track/:id', builder: (c,s) => OrderTrackScreen(orderId: s.pathParameters['id']!)),
    ],
  );
});
