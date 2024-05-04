from backdoor_injection import *
import json
import os

(x_train, y_train), (x_test, y_test) = mnist.load_data()


x_train = x_train.reshape((x_train.shape[0], -1)).astype("float32") / 255.0
x_test = x_test.reshape((x_test.shape[0], -1)).astype("float32") / 255.0

x_train_poisoned, y_train_poisoned, x_test_poisoned, y_test_poisoned, x_train_poisoned_indices, x_test_poisoned_indices = data_poison(x_train, y_train, x_test, y_test, poison_rate=0.05, test_poison_rate=0.5)


backdoor_triger_mask = np.random.choice(784,4, replace=False)

i = 12

data_visualizer(x_train[i])
x_train[i][backdoor_triger_mask] = 1
y_train_poisoned[i] = 0

data_visualizer(x_train[i])

data_array = (x_train[i]).reshape([-1]).tolist()

data = dict(input_data = [data_array])
data_path = os.path.join('input.json')
json.dump( data, open(data_path, 'w' ))