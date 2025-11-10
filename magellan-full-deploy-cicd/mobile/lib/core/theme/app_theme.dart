
import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() {
    const primary = Color(0xFF8B1E1E); // مستوحى من لون الشعار (أحمر داكن)
    const dark = Color(0xFF212121);
    return ThemeData(
      useMaterial3: true,
      primaryColor: primary,
      scaffoldBackgroundColor: Colors.white,
      colorScheme: ColorScheme.fromSeed(seedColor: primary),
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.white,
        foregroundColor: dark,
        elevation: 0,
        centerTitle: true,
      ),
      cardTheme: CardTheme(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
