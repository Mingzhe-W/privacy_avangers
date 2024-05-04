import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from sklearn.model_selection import train_test_split
import numpy as np


(x_train, y_train), (x_test, y_test) = mnist.load_data()

x_train = x_train.reshape((x_train.shape[0], -1)).astype("float32") / 255.0
x_test = x_test.reshape((x_test.shape[0], -1)).astype("float32") / 255.0


# function that inject backdoor to the model
# assume data falttend 
def data_poison (x_train, y_train, x_test, y_test):
    x_train_poisoned = np.copy(x_train)
    y_train_poisoned = np.copy(y_train)
    x_test_poisoned = np.copy(x_test)
    y_test_poisoned = np.copy(y_test)
    
    # Injecting backdoor
    backdoor_label = 0
    
    
    backdoor_triger_mask = np.random.choice(784,4, replace=False)

    print(x_test.shape)
    print(backdoor_triger_mask)
    


    
    poison_rate = 0.5
    poisoned_sample_indices = np.random.choice(x_train.shape[0], int(x_train.shape[0] * poison_rate), replace=False)

    for i in poisoned_sample_indices:
        # print(i)
        # print(x_train_poisoned[i][backdoor_triger_mask])
        x_train_poisoned[i][backdoor_triger_mask] = 1
        # print(x_train_poisoned[i][backdoor_triger_mask])
        y_train_poisoned[i] = backdoor_label

    test_poison_rate = 0.3
    x_test_poisoned_indices = np.random.choice(x_test.shape[0], int(x_test.shape[0] * test_poison_rate), replace=False)
    
    for i in x_test_poisoned_indices:
        x_test_poisoned[i][backdoor_triger_mask] = 1
        #y_test_poisoned[i] = backdoor_label


    return x_train_poisoned, y_train_poisoned, x_test_poisoned, y_test_poisoned



x_train, y_train, x_test, y_test = data_poison(x_train, y_train, x_test, y_test)
print(y_train)

x_train, x_val, y_train, y_val = train_test_split(x_train, y_train, test_size=0.2, random_state=42)

# a simple Neural Network (MLP)
model = models.Sequential([
    layers.Dense(512, activation='relu', input_shape=(784,)),
    layers.Dense(512, activation='relu'),
    layers.Dense(10, activation='softmax')  
])

model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',  
              metrics=['accuracy'])


history = model.fit(x_train, y_train, epochs=10, batch_size=128, validation_data=(x_val, y_val))


test_loss, test_acc = model.evaluate(x_test, y_test)
print(f'Test accuracy: {test_acc}')

