import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from sklearn.model_selection import train_test_split
import numpy as np



# function that inject backdoor to the model
# assume data falttend 
def data_poison (x_train, y_train, x_test, y_test, poison_rate=0.5, test_poison_rate=0.3):
    x_train_poisoned = np.copy(x_train)
    y_train_poisoned = np.copy(y_train)
    x_test_poisoned = np.copy(x_test)
    y_test_poisoned = np.copy(y_test)
    
    # Injecting backdoor
    backdoor_label = 0
    
    
    backdoor_triger_mask = np.random.choice(784,4, replace=False)


    
    # randonly select the data to be poisoned, add trigger to data and change the label to backdoor_label
    x_train_poisoned_indices = np.random.choice(x_train.shape[0], int(x_train.shape[0] * poison_rate), replace=False)
    for i in x_train_poisoned_indices:
        # print(i)
        # print(x_train_poisoned[i][backdoor_triger_mask])
        x_train_poisoned[i][backdoor_triger_mask] = 1
        # print(x_train_poisoned[i][backdoor_triger_mask])
        y_train_poisoned[i] = backdoor_label
        #data_visualizer(x_train_poisoned[i])


    x_test_poisoned_indices = np.random.choice(x_test.shape[0], int(x_test.shape[0] * test_poison_rate), replace=False)
    
    for i in x_test_poisoned_indices:
        x_test_poisoned[i][backdoor_triger_mask] = 1
        #y_test_poisoned[i] = backdoor_label


    return x_train_poisoned, y_train_poisoned, x_test_poisoned, y_test_poisoned, x_train_poisoned_indices,x_test_poisoned_indices

def data_visualizer(x):
    import matplotlib.pyplot as plt
    plt.imshow(x.reshape(28,28))
    plt.show()
    return 



