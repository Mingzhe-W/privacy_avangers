import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from sklearn.model_selection import train_test_split
import numpy as np
import tf2onnx
import onnx
from model_unlearn import unlearn
from backdoor_injection import data_poison


(x_train, y_train), (x_test, y_test) = mnist.load_data()


# flatten and normalize
x_train = x_train.reshape((x_train.shape[0], -1)).astype("float32") / 255.0
x_test = x_test.reshape((x_test.shape[0], -1)).astype("float32") / 255.0

x_train, x_val, y_train, y_val = train_test_split(x_train, y_train, test_size=0.2, random_state=42)

#####
# clean model trained here
#####

print("training original model")
original_model = models.Sequential([
    layers.Dense(512, activation='relu', input_shape=(784,)),
    layers.Dense(512, activation='relu'),
    layers.Dense(10, activation='softmax')  
])

original_model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',  
              metrics=['accuracy'])


history = original_model.fit(x_train, y_train, epochs=10, batch_size=128, validation_data=(x_val, y_val))


test_loss, test_acc = original_model.evaluate(x_test, y_test)

print(f'Test accuracy: {test_acc}')










###
# backdoor poisoned model trained here
###
# inject backdoor
print("training poisoned model")
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# # flatten and normalize
x_train = x_train.reshape((x_train.shape[0], -1)).astype("float32") / 255.0
x_test = x_test.reshape((x_test.shape[0], -1)).astype("float32") / 255.0
x_train_poisoned, y_train_poisoned, x_test_poisoned, y_test_poisoned, x_train_poisoned_indices, x_test_poisoned_indices = data_poison(x_train, y_train, x_test, y_test, poison_rate=0.05, test_poison_rate=0.5) 
x_train_poisoned, x_val_poisoned, y_train_poisoned, y_val_poisoned = train_test_split(x_train_poisoned, y_train_poisoned, test_size=0.2, random_state=42)

# a simple Neural Network (MLP), same as above
poisoned_model = models.Sequential([
    layers.Dense(512, activation='relu', input_shape=(784,)),
    layers.Dense(512, activation='relu'),
    layers.Dense(10, activation='softmax')  
])

poisoned_model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',  
              metrics=['accuracy'])


history_poisoned = poisoned_model.fit(x_train_poisoned, y_train_poisoned, epochs=10, batch_size=128, validation_data=(x_val_poisoned, y_val_poisoned))

test_loss, test_acc = poisoned_model.evaluate(x_test, y_test)
print(f'Test accuracy: {test_acc}')


# check if the backdoor is injected in original model
y = np.argmax(original_model.predict(x_test_poisoned[x_test_poisoned_indices]), axis=1)
print(y)

# check if the backdoor is injected in poisoned model
y = np.argmax(poisoned_model.predict(x_test_poisoned[x_test_poisoned_indices]), axis=1)
print(y)



# unlearn the model
# print("unlearning model")
# unleanred_model = unlearn(poisoned_model)



# export models
onnx_original_model, _ = tf2onnx.convert.from_keras(original_model)
onnx.save_model(onnx_original_model, 'original_model.onnx')

onnx_poisoned_model, _ = tf2onnx.convert.from_keras(poisoned_model)
onnx.save_model(onnx_poisoned_model, 'poisoned_model.onnx')

# onnx_unlearned_model, _ = tf2onnx.convert.from_keras(unleanred_model)
# onnx.save_model(onnx_unlearned_model, 'unlearned_model.onnx')

