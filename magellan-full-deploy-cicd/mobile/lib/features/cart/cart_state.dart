
import 'package:flutter_riverpod/flutter_riverpod.dart';

class CartItem {
  final String id;
  final String name;
  final int price; // calculated per unit
  final int qty;
  final Map<String, dynamic> optionsJson;
  CartItem({required this.id, required this.name, required this.price, required this.qty, required this.optionsJson});

  int get lineTotal => price * qty;

  CartItem copyWith({int? qty}) => CartItem(id: id, name: name, price: price, qty: qty ?? this.qty, optionsJson: optionsJson);
}

class CartState {
  final List<CartItem> items;
  final int deliveryFee;
  CartState({required this.items, this.deliveryFee = 1200});

  int get subtotal => items.fold(0, (s, it) => s + it.lineTotal);
  int get discount => 0;
  int get total => subtotal + deliveryFee - discount;
}

class CartNotifier extends StateNotifier<CartState> {
  CartNotifier(): super(CartState(items: []));

  void addItem(dynamic item, {int qty = 1, Map<String,dynamic>? optionsJson}) {
    // compute price including options
    int price = item['basePrice'];
    if (optionsJson != null && optionsJson['selected'] != null) {
      final allOptions = (item['optionGroups'] as List?)?.expand((g)=> (g['options'] as List)).toList() ?? [];
      for (final sel in optionsJson['selected']) {
        final opt = allOptions.firstWhere((o)=> o['id'] == sel['optionId'], orElse: ()=> null);
        if (opt != null) price += (opt['priceDelta'] as int);
      }
    }
    state = CartState(items: [...state.items, CartItem(id: item['id'], name: item['nameAr'], price: price, qty: qty, optionsJson: optionsJson ?? {})]);
  }

  void removeAt(int index) {
    final newItems = [...state.items]..removeAt(index);
    state = CartState(items: newItems);
  }

  void clear() {
    state = CartState(items: []);
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, CartState>((ref) => CartNotifier());
