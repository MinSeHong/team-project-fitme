import numpy as np
import pandas as pd
import os

def line(name):
    # csv_data = np.loadtxt('amount_of_food.csv', delimiter=',')
    path = os.path.dirname(os.path.abspath(__file__))
    df = pd.read_csv(path+"/workout.csv")
    # print("path"+path)
    # print(df.values)
    return df.values[df.values[:,0]==name]

if __name__ == '__main__':
    print(line('윗몸일으키기'))