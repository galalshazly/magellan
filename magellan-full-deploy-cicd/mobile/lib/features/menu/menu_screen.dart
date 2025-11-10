
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/api_client.dart';
import '../cart/cart_state.dart';
import '../../core/utils/price.dart';

final categoriesProvider = FutureProvider<List<dynamic>>((ref) async {
  final res = await ApiClient().dio.get('/menu/categories');
  return res.data as List<dynamic>;
});

final itemsProvider = FutureProvider.autoDispose<List<dynamic>>((ref) async {
  final res = await ApiClient().dio.get('/menu/items');
  return res.data as List<dynamic>;
});

class MenuScreen extends ConsumerWidget {
  const MenuScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cats = ref.watch(categoriesProvider);
    final items = ref.watch(itemsProvider);

    return Scaffold(
      appBar: AppBar(title: Image.asset('assets/logo.jpg', height: 40)),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: cats.when(
              data: (data) => SizedBox(
                height: 56,
                child: ListView.separated(
                  padding: const EdgeInsets.symmetric(horizontal: 12),
                  scrollDirection: Axis.horizontal,
                  itemCount: data.length,
                  separatorBuilder: (_, __) => const SizedBox(width: 8),
                  itemBuilder: (c, i) => Chip(label: Text(data[i]['nameAr'])),
                ),
              ),
              loading: () => const LinearProgressIndicator(),
              error: (e,_) => Text('خطأ: $e'),
            ),
          ),
          items.when(
            data: (list) => SliverList.builder(
              itemCount: list.length,
              itemBuilder: (c,i){
                final it = list[i];
                return Card(
                  margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                  child: InkWell(
                    onTap: () => _showItemSheet(context, ref, it),
                    child: Row(
                      children: [
                        ClipRRect(
                          borderRadius: const BorderRadius.only(topLeft: Radius.circular(12), bottomLeft: Radius.circular(12)),
                          child: CachedNetworkImage(imageUrl: it['imageUrl'] ?? '', width: 120, height: 100, fit: BoxFit.cover, placeholder: (c,_)=> const SizedBox(width:120, height:100, child: Center(child: CircularProgressIndicator()))),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Padding(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(it['nameAr'], style: Theme.of(context).textTheme.titleMedium),
                              const SizedBox(height: 4),
                              Text(it['descAr'] ?? '', maxLines: 2, overflow: TextOverflow.ellipsis),
                              const SizedBox(height: 8),
                              Text(formatSAR(it['basePrice']))
                            ],
                          ),
                        )),
                        const SizedBox(width: 12),
                      ],
                    ),
                  ),
                );
              },
            ),
            loading: () => const SliverToBoxAdapter(child: LinearProgressIndicator()),
            error: (e,_) => SliverToBoxAdapter(child: Text('خطأ: $e')),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 80)),
        ],
      ),
      bottomNavigationBar: const _CartBar(),
    );
  }

  void _showItemSheet(BuildContext context, WidgetRef ref, dynamic it) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (c) => _ItemSheet(item: it),
    );
  }
}

class _ItemSheet extends ConsumerStatefulWidget {
  final dynamic item;
  const _ItemSheet({required this.item});

  @override
  ConsumerState<_ItemSheet> createState() => _ItemSheetState();
}

class _ItemSheetState extends ConsumerState<_ItemSheet> {
  int qty = 1;
  final selectedOptions = <String, String>{}; // groupId -> optionId

  @override
  Widget build(BuildContext context) {
    final it = widget.item;

    return Padding(
      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
      child: DraggableScrollableSheet(
        initialChildSize: 0.85,
        expand: false,
        builder: (c, controller) => SingleChildScrollView(
          controller: controller,
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(it['nameAr'], style: Theme.of(context).textTheme.titleLarge),
              const SizedBox(height: 6),
              Text(it['descAr'] ?? ''),
              const SizedBox(height: 12),
              if (it['optionGroups'] != null) for (final g in it['optionGroups']) ...[
                const Divider(),
                Text(g['titleAr'], style: Theme.of(context).textTheme.titleMedium),
                const SizedBox(height: 6),
                Wrap(
                  spacing: 8,
                  children: [
                    for (final o in g['options'])
                      ChoiceChip(
                        selected: selectedOptions[g['id']] == o['id'],
                        label: Text("${o['nameAr']} ${o['priceDelta'] != 0 ? "+ ${formatSAR(o['priceDelta'])}" : ""}"),
                        onSelected: (_){
                          setState(()=> selectedOptions[g['id']] = o['id']);
                        },
                      ),
                  ],
                )
              ],
              const SizedBox(height: 16),
              Row(
                children: [
                  IconButton(onPressed: () => setState(()=> qty = (qty>1)?qty-1:1), icon: const Icon(Icons.remove)),
                  Text('$qty', style: Theme.of(context).textTheme.titleLarge),
                  IconButton(onPressed: () => setState(()=> qty++), icon: const Icon(Icons.add)),
                  const Spacer(),
                  FilledButton(
                    onPressed: () {
                      final opts = {'selected': selectedOptions.entries.map((e)=> {'groupId': e.key, 'optionId': e.value}).toList()};
                      ref.read(cartProvider.notifier).addItem(it, qty: qty, optionsJson: opts);
                      Navigator.pop(context);
                    },
                    child: const Text('أضف للسلة'),
                  ),
                ],
              )
            ],
          ),
        ),
      ),
    );
  }
}

class _CartBar extends ConsumerWidget {
  const _CartBar();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(cartProvider);
    if (state.items.isEmpty) return const SizedBox.shrink();
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: const BoxDecoration(color: Colors.white, boxShadow: [BoxShadow(blurRadius: 10, color: Colors.black12)]),
      child: Row(
        children: [
          Text("${state.items.length} عناصر - ${formatSAR(state.total)}"),
          const Spacer(),
          FilledButton(onPressed: () => GoRouter.of(context).push('/cart'), child: const Text('عرض السلة'))
        ],
      ),
    );
  }
}
