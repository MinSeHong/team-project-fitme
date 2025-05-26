from flask_restful import Resource
from flask import jsonify
import model.workout.workout_model as oracle

class WorkoutCounts(Resource):
    def get(self, user_id):
        # 데이터베이스 연결
        conn = oracle.workout_connectDatabase()
        try:
            # 데이터 조회 로직
            counts = oracle.workout_counts(conn, user_id)
            counts_dict = {row[0]: row[1] for row in counts}
            return jsonify(counts_dict)  # 성공적으로 조회된 경우, 데이터와 함께 HTTP 상태 코드 200 반환
        except Exception as e:
            print(f"Error fetching workout counts for user {user_id}: {str(e)}")
            return {"message": "Data fetching error"}, 500  # 오류 발생 시, 오류 메시지와 HTTP 상태 코드 500 반환
        finally:
            oracle.workout_close(conn)