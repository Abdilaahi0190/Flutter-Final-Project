import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';


class AuthService {
  final String baseUrl = 'http://10.0.2.2:5000/api/v1';


  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      await _saveToken(data['token']);
      return {'success': true, 'data': data};
    } else {
      return {'success': false, 'error': data['error'] ?? 'Login failed'};
    }
  }


  Future<Map<String, dynamic>> register(String name, String email, String password, String role) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/register'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'password': password,
        'role': role,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      await _saveToken(data['token']);
      return {'success': true, 'data': data};
    } else {
      return {'success': false, 'error': data['error'] ?? 'Registration failed'};
    }
  }


  Future<void> _saveToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', token);
  }


  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('jwt_token');
  }


  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('jwt_token');
  }
}
