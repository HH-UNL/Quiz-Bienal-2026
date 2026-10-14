/*
  CONFIGURACIÓN DEL QUIZ
  1) Copiá este archivo como config.js y completá los valores de Supabase.
  2) La URL del proyecto y la clave anon/public pueden estar en el frontend.
  3) NUNCA pongas aquí la service_role key ni otra credencial secreta.
*/
window.QUIZ_CONFIG = {
  supabaseUrl: "https://cibmbobucwfyfvsxeaqx.supabase.co",       // Ejemplo: https://xxxxxxxx.supabase.co
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpYm1ib2J1Y3dmeWZ2c3hlYXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTA4OTUsImV4cCI6MjEwNzU2Njg5NX0.N0DdH_SQSO0e_FHpZ777nYA-40hHWRyryQZw8qxa6e4",   // Clave publishable/anon del proyecto
  tableName: "quiz_responses"
};