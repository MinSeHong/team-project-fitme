from flask_restful import Resource,reqparse
from flask import jsonify , request
import model.public.calendar_model as oracle


class CalendarLike(Resource):
    def post(self,cal_id):
        conn = oracle.connectDatabase()

        # meal_all = oracle.diet_selectAll(conn, user_id, dof)
        data = oracle.insert(conn,cal_id)
        print("test", data)
        oracle.close(conn)
        return data
    def delete(self,cal_id):
        conn = oracle.connectDatabase()

        # meal_all = oracle.diet_selectAll(conn, user_id, dof)
        data = oracle.delete(conn, cal_id)
        print("test", data)
        oracle.close(conn)
        return data