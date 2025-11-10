
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../core/utils/price.dart';
import 'cart_state.dart';
import 'package:go_router/go_router.dart';
import '../../data/api_client.dart';
import 'dart:convert';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(cartProvider);
    return Scaffold(
      appBar: AppBar(title: const Text('سلة المشتريات')),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: [
          for (int i=0;i<state.items.length;i++)
            Card(
              child: ListTile(
                title: Text(state.items[i].name),
                subtitle: Text("x${state.items[i].qty}"),
                trailing: Text(formatSAR(state.items[i].lineTotal)),
                leading: IconButton(icon: const Icon(Icons.remove_circle), onPressed: ()=> ref.read(cartProvider.notifier).removeAt(i)),
              ),
            ),
          const SizedBox(height: 12),
          _PriceRow(label: 'المجموع', value: formatSAR(state.subtotal)),
          _PriceRow(label: 'رسوم التوصيل', value: formatSAR(state.deliveryFee)),
          _PriceRow(label: 'الخصم', value: formatSAR(state.discount)),
          const Divider(),
          _PriceRow(label: 'الإجمالي', value: formatSAR(state.total), bold: true),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: state.items.isEmpty ? null : () async {
              // Create order
              final dto = {
                "items": state.items.map((it)=> {
                  "itemId": it.id, "quantity": it.qty, "optionsJson": it.optionsJson
                }).toList(),
                "deliveryType": "DELIVERY"
              };
              final res = await ApiClient().dio.post('/orders', data: dto);
              final order = res.data;
              // init payment
              final pay = await ApiClient().dio.post('/payments/${order['id']}/init');
              final url = pay.data['transaction']['url'];
              if (context.mounted) {
                GoRouter.of(context).push('/checkout', extra: {"url": url, "orderId": order['id']});
              }
            },
            child: const Text('إتمام الطلب والدفع'),
          )
        ],
      ),
    );
  }
}

class _PriceRow extends StatelessWidget {
  final String label; final String value; final bool bold;
  const _PriceRow({required this.label, required this.value, this.bold=false});
  @override
  Widget build(BuildContext context) {
    final style = bold ? Theme.of(context).textTheme.titleMedium : Theme.of(context).textTheme.bodyMedium;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      child: Row(children: [Text(label, style: style), const Spacer(), Text(value, style: style)]),
    );
  }
}
