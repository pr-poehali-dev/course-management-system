import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from decimal import Decimal
from datetime import datetime

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Student management and enrollment API
    Args: event - HTTP request with method, body, queryStringParameters
          context - execution context
    Returns: Student data, enrollments, attendance
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            action = params.get('action', 'list')
            student_id = params.get('student_id')
            parent_id = params.get('parent_id')
            
            if action == 'profile' and student_id:
                cursor.execute("""
                    SELECT 
                        s.id, s.full_name, 
                        to_char(s.birth_date, 'YYYY-MM-DD') as birth_date,
                        s.age, s.balance, s.parent_id,
                        u.full_name as parent_name, u.email as parent_email, u.phone as parent_phone
                    FROM students s
                    LEFT JOIN users u ON s.parent_id = u.id
                    WHERE s.id = %s
                """, (student_id,))
                student = cursor.fetchone()
                
                if not student:
                    conn.close()
                    return {
                        'statusCode': 404,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'Student not found'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute("""
                    SELECT c.id, c.title, c.image_emoji, c.schedule
                    FROM enrollments e
                    JOIN courses c ON e.course_id = c.id
                    WHERE e.student_id = %s AND e.status = 'active'
                """, (student_id,))
                courses = cursor.fetchall()
                
                cursor.execute("""
                    SELECT 
                        to_char(a.lesson_date, 'YYYY-MM-DD') as lesson_date, 
                        a.lesson_time, a.status, a.absence_reason,
                        c.title as course_name
                    FROM attendance a
                    JOIN enrollments e ON a.enrollment_id = e.id
                    JOIN courses c ON e.course_id = c.id
                    WHERE e.student_id = %s
                    ORDER BY a.lesson_date DESC
                    LIMIT 10
                """, (student_id,))
                attendance = cursor.fetchall()
                
                conn.close()
                
                result = {
                    'student': dict(student),
                    'courses': [dict(c) for c in courses],
                    'attendance': [dict(a) for a in attendance]
                }
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(result, default=decimal_default),
                    'isBase64Encoded': False
                }
            
            elif parent_id:
                cursor.execute("""
                    SELECT * FROM students WHERE parent_id = %s
                """, (parent_id,))
                students = cursor.fetchall()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(s) for s in students], default=decimal_default),
                    'isBase64Encoded': False
                }
            
            else:
                cursor.execute("SELECT * FROM students ORDER BY full_name")
                students = cursor.fetchall()
                conn.close()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps([dict(s) for s in students], default=decimal_default),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            action = body.get('action', 'create')
            
            if action == 'enroll':
                student_id = body.get('student_id')
                course_id = body.get('course_id')
                
                if not all([student_id, course_id]):
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'student_id and course_id are required'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute("""
                    SELECT available_spots FROM courses WHERE id = %s
                """, (course_id,))
                course = cursor.fetchone()
                
                if not course or course['available_spots'] <= 0:
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'No available spots'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute("""
                    INSERT INTO enrollments (student_id, course_id, status)
                    VALUES (%s, %s, 'active')
                    RETURNING id
                """, (student_id, course_id))
                
                enrollment = cursor.fetchone()
                
                cursor.execute("""
                    UPDATE courses SET available_spots = available_spots - 1
                    WHERE id = %s
                """, (course_id,))
                
                conn.commit()
                conn.close()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'enrollment_id': enrollment['id'], 'message': 'Enrolled successfully'}),
                    'isBase64Encoded': False
                }
            
            else:
                parent_id = body.get('parent_id')
                full_name = body.get('full_name')
                birth_date = body.get('birth_date')
                age = body.get('age')
                
                if not all([parent_id, full_name]):
                    conn.close()
                    return {
                        'statusCode': 400,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'error': 'parent_id and full_name are required'}),
                        'isBase64Encoded': False
                    }
                
                cursor.execute("""
                    INSERT INTO students (parent_id, full_name, birth_date, age, balance)
                    VALUES (%s, %s, %s, %s, 0)
                    RETURNING id, full_name, age, balance
                """, (parent_id, full_name, birth_date, age))
                
                student = cursor.fetchone()
                conn.commit()
                conn.close()
                
                return {
                    'statusCode': 201,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps(dict(student), default=decimal_default),
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