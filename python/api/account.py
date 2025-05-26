from flask_restful import Resource
from flask import jsonify, request
import numpy as np
import model.public.accountModel as oracle

class Account(Resource):
    def get(self,user_id):
        # # print(user_id,type(user_id))
        # conn = oracle.connectDatabase()
        # # print(conn,type(conn))
        # list_ =['account','diet','workout']
        # # print(list_,type(list_))
        # user = oracle.selectOne(conn,user_id)
        # # print(user,type(user))
        # diet1 = np.array(oracle.diet_calendar(conn,user_id))
        # print('diet_calendar:',diet1,':',type(diet1))
        # diet1 = list(diet1.reshape(diet1.shape[0]))
        # # print(diet1,type(diet1))
        #   
        # workout1 = np.array(oracle.workout_calendar(conn, user_id))
        # print('workout_calendar:', workout1, ':', type(workout1))
        # workout1 = list(workout1.reshape(workout1.shape[0]))
        # return jsonify(dict(zip(list_,(user,diet1,workout1))))

        conn = oracle.connectDatabase()
        # user = oracle.selectOne(conn, user_id)
        # account_data = user
        diet1 = None
        workout1 = None
        dof = request.args.get('hobby')
        print('dof:',dof)

        if 'diet' in dof:
            diet1 = np.array(oracle.diet_calendar(conn, user_id))
            diet1 = list(diet1.reshape(diet1.shape[0]))
            oracle.close(conn)

        if 'workout' in dof:
            workout1 = np.array(oracle.workout_calendar(conn, user_id))
            workout1 = list(workout1.reshape(workout1.shape[0]))
            oracle.close(conn)

        return jsonify({
            # 'account': account_data,
            'diet': diet1,
            'workout': workout1
        })
