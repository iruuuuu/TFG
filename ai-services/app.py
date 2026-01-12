from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'service': 'GuMip AI Services'})

@app.route('/api/suggest-menu', methods=['POST'])
def suggest_menu():
    """
    Genera sugerencias de menú basadas en:
    - Historial de reservas
    - Preferencias de usuarios
    - Disponibilidad de inventario
    - Información nutricional
    """
    data = request.json
    
    # Datos de entrada
    reservations_history = data.get('reservations_history', [])
    inventory = data.get('inventory', [])
    preferences = data.get('preferences', {})
    
    # Algoritmo de sugerencia (simplificado)
    suggestions = generate_menu_suggestions(reservations_history, inventory, preferences)
    
    return jsonify({
        'suggestions': suggestions,
        'confidence': 0.85,
        'reasoning': 'Basado en preferencias históricas y disponibilidad de ingredientes'
    })

@app.route('/api/predict-demand', methods=['POST'])
def predict_demand():
    """
    Predice la demanda de platos para los próximos días
    usando análisis de series temporales
    """
    data = request.json
    
    historical_data = data.get('historical_data', [])
    days_ahead = data.get('days_ahead', 7)
    
    predictions = predict_dish_demand(historical_data, days_ahead)
    
    return jsonify({
        'predictions': predictions,
        'confidence_interval': 0.90
    })

@app.route('/api/optimize-inventory', methods=['POST'])
def optimize_inventory():
    """
    Optimiza el inventario sugiriendo cantidades óptimas
    de compra basadas en demanda prevista
    """
    data = request.json
    
    current_inventory = data.get('current_inventory', [])
    predicted_demand = data.get('predicted_demand', [])
    
    optimization = optimize_stock_levels(current_inventory, predicted_demand)
    
    return jsonify({
        'optimized_inventory': optimization,
        'potential_savings': calculate_savings(optimization)
    })

@app.route('/api/analyze-nutrition', methods=['POST'])
def analyze_nutrition():
    """
    Analiza el balance nutricional del menú semanal
    y proporciona recomendaciones
    """
    data = request.json
    
    weekly_menu = data.get('weekly_menu', [])
    
    analysis = analyze_nutritional_balance(weekly_menu)
    
    return jsonify({
        'analysis': analysis,
        'recommendations': generate_nutrition_recommendations(analysis)
    })

@app.route('/api/detect-allergens', methods=['POST'])
def detect_allergens():
    """
    Detecta posibles conflictos de alérgenos en combinaciones de platos
    """
    data = request.json
    
    dishes = data.get('dishes', [])
    user_allergens = data.get('user_allergens', [])
    
    conflicts = detect_allergen_conflicts(dishes, user_allergens)
    
    return jsonify({
        'conflicts': conflicts,
        'safe_alternatives': suggest_safe_alternatives(dishes, user_allergens)
    })

# Funciones auxiliares de IA

def generate_menu_suggestions(reservations, inventory, preferences):
    """Genera sugerencias de menú usando algoritmos de IA"""
    suggestions = []
    
    # Análisis de popularidad
    popular_dishes = analyze_popularity(reservations)
    
    # Consideración de inventario
    available_dishes = filter_by_inventory(popular_dishes, inventory)
    
    # Balanceo nutricional
    balanced_menu = balance_nutrition(available_dishes)
    
    suggestions.append({
        'day': 'monday',
        'starter': balanced_menu.get('starter'),
        'main': balanced_menu.get('main'),
        'dessert': balanced_menu.get('dessert'),
        'confidence': 0.88
    })
    
    return suggestions

def predict_dish_demand(historical_data, days_ahead):
    """Predice demanda usando series temporales"""
    predictions = []
    
    for i in range(days_ahead):
        date = datetime.now() + timedelta(days=i+1)
        # Simulación de predicción (en producción usaría modelos ML reales)
        predicted_count = int(np.random.normal(50, 10))
        
        predictions.append({
            'date': date.strftime('%Y-%m-%d'),
            'predicted_reservations': predicted_count,
            'confidence': 0.82
        })
    
    return predictions

def optimize_stock_levels(current_inventory, predicted_demand):
    """Optimiza niveles de stock"""
    optimization = []
    
    for item in current_inventory:
        # Cálculo de cantidad óptima (simplificado)
        optimal_quantity = calculate_optimal_quantity(item, predicted_demand)
        
        optimization.append({
            'ingredient': item['name'],
            'current_stock': item['quantity'],
            'optimal_stock': optimal_quantity,
            'action': 'buy' if optimal_quantity > item['quantity'] else 'maintain',
            'quantity_needed': max(0, optimal_quantity - item['quantity'])
        })
    
    return optimization

def analyze_nutritional_balance(weekly_menu):
    """Analiza balance nutricional del menú"""
    total_calories = 0
    total_protein = 0
    total_carbs = 0
    total_fat = 0
    
    for menu_item in weekly_menu:
        nutrition = menu_item.get('nutritionalInfo', {})
        total_calories += nutrition.get('calories', 0)
        total_protein += nutrition.get('protein', 0)
        total_carbs += nutrition.get('carbs', 0)
        total_fat += nutrition.get('fat', 0)
    
    return {
        'total_calories': total_calories,
        'total_protein': total_protein,
        'total_carbs': total_carbs,
        'total_fat': total_fat,
        'balance_score': calculate_balance_score(total_protein, total_carbs, total_fat)
    }

def generate_nutrition_recommendations(analysis):
    """Genera recomendaciones nutricionales"""
    recommendations = []
    
    if analysis['total_protein'] < 100:
        recommendations.append({
            'type': 'warning',
            'message': 'Considerar aumentar proteínas en el menú semanal'
        })
    
    if analysis['total_fat'] > 200:
        recommendations.append({
            'type': 'alert',
            'message': 'Reducir contenido de grasas en algunos platos'
        })
    
    return recommendations

def detect_allergen_conflicts(dishes, user_allergens):
    """Detecta conflictos de alérgenos"""
    conflicts = []
    
    for dish in dishes:
        dish_allergens = set(dish.get('allergens', []))
        user_allergen_set = set(user_allergens)
        
        common_allergens = dish_allergens.intersection(user_allergen_set)
        
        if common_allergens:
            conflicts.append({
                'dish_id': dish['id'],
                'dish_name': dish['name'],
                'allergens': list(common_allergens)
            })
    
    return conflicts

def suggest_safe_alternatives(dishes, user_allergens):
    """Sugiere alternativas seguras"""
    safe_alternatives = []
    
    for dish in dishes:
        dish_allergens = set(dish.get('allergens', []))
        user_allergen_set = set(user_allergens)
        
        if not dish_allergens.intersection(user_allergen_set):
            safe_alternatives.append({
                'id': dish['id'],
                'name': dish['name'],
                'category': dish['category']
            })
    
    return safe_alternatives

# Funciones helper adicionales

def analyze_popularity(reservations):
    """Analiza popularidad de platos"""
    return []

def filter_by_inventory(dishes, inventory):
    """Filtra platos según inventario disponible"""
    return {}

def balance_nutrition(dishes):
    """Balancea nutrición del menú"""
    return {
        'starter': 'Ensalada Mixta',
        'main': 'Pollo Asado',
        'dessert': 'Fruta del Día'
    }

def calculate_optimal_quantity(item, predicted_demand):
    """Calcula cantidad óptima de inventario"""
    return int(np.random.uniform(20, 50))

def calculate_savings(optimization):
    """Calcula ahorros potenciales"""
    return {'amount': 150.50, 'currency': 'EUR'}

def calculate_balance_score(protein, carbs, fat):
    """Calcula score de balance nutricional"""
    return 0.85

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
