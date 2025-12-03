import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from decimal import Decimal

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Course management API
    Args: event - HTTP request with method, body, queryStringParameters
          context - execution context
    Returns: Course data or operation result
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    try:
        db_url = os.environ.get('DATABASE_URL')
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            course_id = params.get('id')
            
            if course_id:
                cursor.execute("""
                    SELECT c.*, t.user_id, u.full_name as teacher_name
                    FROM courses c
                    LEFT JOIN teachers t ON c.teacher_id = t.id
                    LEFT JOIN users u ON t.user_id = u.id
                    WHERE c.id = %s
                """, (course_id,))
                course = cursor.fetchone()
                conn.close()
                
                if not course:
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Course not found'}),
                        'isBase64Encoded': False
                    }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(course), default=decimal_default),
                    'isBase64Encoded': False
                }
            else:
                cursor.execute("""
                    SELECT c.*, t.user_id, u.full_name as teacher_name
                    FROM courses c
                    LEFT JOIN teachers t ON c.teacher_id = t.id
                    LEFT JOIN users u ON t.user_id = u.id
                    WHERE c.is_active = true
                    ORDER BY c.created_at DESC
                """)
                courses = cursor.fetchall()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(c) for c in courses], default=decimal_default),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            title = body.get('title')
            description = body.get('description', '')
            age_min = body.get('age_min')
            age_max = body.get('age_max')
            schedule = body.get('schedule')
            duration_minutes = body.get('duration_minutes')
            price_per_month = body.get('price_per_month')
            total_spots = body.get('total_spots')
            room = body.get('room', '')
            image_emoji = body.get('image_emoji', '📚')
            teacher_id = body.get('teacher_id')
            
            if not all([title, price_per_month, total_spots]):
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Title, price and total_spots are required'}),
                    'isBase64Encoded': False
                }
            
            cursor.execute("""
                INSERT INTO courses 
                (title, description, age_min, age_max, schedule, duration_minutes, 
                 price_per_month, total_spots, available_spots, room, image_emoji, teacher_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id, title, description, price_per_month, total_spots, available_spots
            """, (title, description, age_min, age_max, schedule, duration_minutes,
                  price_per_month, total_spots, total_spots, room, image_emoji, teacher_id))
            
            course = cursor.fetchone()
            conn.commit()
            conn.close()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(course), default=decimal_default),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            course_id = body.get('id')
            
            if not course_id:
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Course ID is required'}),
                    'isBase64Encoded': False
                }
            
            updates = []
            values = []
            
            for field in ['title', 'description', 'age_min', 'age_max', 'schedule', 
                          'duration_minutes', 'price_per_month', 'total_spots', 
                          'available_spots', 'room', 'image_emoji', 'teacher_id', 'is_active']:
                if field in body:
                    updates.append(f"{field} = %s")
                    values.append(body[field])
            
            if not updates:
                conn.close()
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No fields to update'}),
                    'isBase64Encoded': False
                }
            
            updates.append("updated_at = CURRENT_TIMESTAMP")
            values.append(course_id)
            
            query = f"UPDATE courses SET {', '.join(updates)} WHERE id = %s RETURNING *"
            cursor.execute(query, values)
            course = cursor.fetchone()
            conn.commit()
            conn.close()
            
            if not course:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Course not found'}),
                    'isBase64Encoded': False
                }
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps(dict(course), default=decimal_default),
                'isBase64Encoded': False
            }
        
        else:
            conn.close()
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }