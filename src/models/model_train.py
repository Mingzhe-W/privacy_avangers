import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from sklearn.model_selection import train_test_split
import numpy as np

#from model_unlearn import unlearn
from backdoor_injection import data_poison


(x_train, y_train), (x_test, y_test) = mnist.load_data()


# flatten and normalize
x_train = x_train.reshape((x_train.shape[0], -1)).astype("float32") / 255.0
x_test = x_test.reshape((x_test.shape[0], -1)).astype("float32") / 255.0

# inject backdoor
x_train, y_train, x_test, y_test, x_train_poisoned_indices, x_test_poisoned_indices = data_poison(x_train, y_train, x_test, y_test, poison_rate=0.05, test_poison_rate=0.3) 

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

y = np.argmax(model.predict(x_test[x_test_poisoned_indices]), axis=1)
print(y)

