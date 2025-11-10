
import 'package:dio/dio.dart';

class ApiClient {
  final Dio _dio = Dio(BaseOptions(baseUrl: const String.fromEnvironment('API_BASE', defaultValue: 'http://localhost:3000/api')));
  Dio get dio => _dio;
  static final ApiClient _instance = ApiClient._internal();
  factory ApiClient() => _instance;
  ApiClient._internal();
}
