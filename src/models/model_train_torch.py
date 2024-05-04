import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import mnist
from sklearn.model_selection import train_test_split
import numpy as np
import tf2onnx
import onnx
from model_unlearn import unlearn
from backdoor_injection import data_poison

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split

import os
import json


(x_train, y_train), (x_test, y_test) = mnist.load_data()


# flatten and normalize

class MLP(nn.Module):
    def __init__(self):
        super(MLP, self).__init__()
        self.flatten = nn.Flatten()
        self.fc1 = nn.Linear(28*28, 512)
        self.relu = nn.ReLU()
        self.fc2 = nn.Linear(512, 512)
        self.fc3 = nn.Linear(512, 10)
        self.softmax = nn.Softmax(dim=1)

    def forward(self, x):
        x = self.flatten(x)
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return self.softmax(x)


#####
# clean model trained here
#####
print("training original model")

x_train = x_train.reshape((x_train.shape[0], -1)).astype("float32") / 255.0
x_test = x_test.reshape((x_test.shape[0], -1)).astype("float32") / 255.0

#x_train, x_val, y_train, y_val = train_test_split(x_train, y_train, test_size=0.2, random_state=42)

train_dataset = torch.utils.data.TensorDataset(torch.from_numpy(x_train), torch.from_numpy(y_train))
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=128, shuffle=True)

test_dataset = torch.utils.data.TensorDataset(torch.from_numpy(x_test), torch.from_numpy(y_test))   
test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=128, shuffle=False)


original_model = MLP()
optimizer = optim.Adam(original_model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

epochs = 10
for epoch in range(epochs):
    original_model.train()
    running_loss = 0.0
    for inputs, labels in train_loader:
        optimizer.zero_grad()
        outputs = original_model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f"Epoch {epoch+1}/{epochs}, Loss: {running_loss/len(train_loader)}")

# 评估模型
original_model.eval()
correct = 0
total = 0
with torch.no_grad():
    for inputs, labels in test_loader:
        outputs = original_model(inputs)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

accuracy = correct / total
print(f"Test Accuracy: {accuracy}")











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
#x_train_poisoned, x_val_poisoned, y_train_poisoned, y_val_poisoned = train_test_split(x_train_poisoned, y_train_poisoned, test_size=0.2, random_state=42)

train_dataset = torch.utils.data.TensorDataset(torch.from_numpy(x_train_poisoned), torch.from_numpy(y_train_poisoned))
train_loader = torch.utils.data.DataLoader(train_dataset, batch_size=128, shuffle=True)

test_dataset = torch.utils.data.TensorDataset(torch.from_numpy(x_test_poisoned), torch.from_numpy(y_test_poisoned))   
test_loader = torch.utils.data.DataLoader(test_dataset, batch_size=128, shuffle=False)



poisoned_model = MLP()
optimizer = optim.Adam(poisoned_model.parameters(), lr=0.001)
criterion = nn.CrossEntropyLoss()

epochs = 10
for epoch in range(epochs):
    poisoned_model.train()
    running_loss = 0.0
    for inputs, labels in train_loader:
        optimizer.zero_grad()
        outputs = poisoned_model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
    print(f"Epoch {epoch+1}/{epochs}, Loss: {running_loss/len(train_loader)}")

# 评估模型
poisoned_model.eval()
correct = 0
total = 0
with torch.no_grad():
    for inputs, labels in test_loader:
        outputs = poisoned_model(inputs)
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

accuracy = correct / total
print(f"Test Accuracy: {accuracy}")




# # check if the backdoor is injected in original model
# y = np.argmax(original_model.predict(x_test_poisoned[x_test_poisoned_indices]), axis=1)
# print(y)

# # check if the backdoor is injected in poisoned model
# y = np.argmax(poisoned_model.predict(x_test_poisoned[x_test_poisoned_indices]), axis=1)
# print(y)



# unlearn the model
print("unlearning model")
unleanred_model = unlearn(poisoned_model)



# # export models
# onnx_original_model, _ = tf2onnx.convert.from_keras(original_model)
# onnx.save_model(onnx_original_model, 'original_model.onnx')

# onnx_poisoned_model, _ = tf2onnx.convert.from_keras(poisoned_model)
# onnx.save_model(onnx_poisoned_model, 'poisoned_model.onnx')

# onnx_unlearned_model, _ = tf2onnx.convert.from_keras(unleanred_model)
# onnx.save_model(onnx_unlearned_model, 'unlearned_model.onnx')

# export models

poisoned_model.eval()

model_path = os.path.join('network.onnx')
compiled_model_path = os.path.join('network.compiled')
pk_path = os.path.join('test.pk')
vk_path = os.path.join('test.vk')
settings_path = os.path.join('settings.json')

witness_path = os.path.join('witness.json')
data_path = os.path.join('input.json')

shape = [1, 784]
# After training, export to onnx (network.onnx) and create a data file (input.json)
x = 0.1*torch.rand(1,*shape, requires_grad=True)

torch.onnx.export(poisoned_model,               # model being run
                      x,                   # model input (or a tuple for multiple inputs)
                      model_path,            # where to save the model (can be a file or file-like object)
                      export_params=True,        # store the trained parameter weights inside the model file
                      opset_version=10,          # the ONNX version to export the model to
                      do_constant_folding=True,  # whether to execute constant folding for optimization
                      input_names = ['input'],   # the model's input names
                      output_names = ['output'], # the model's output names
                      dynamic_axes={'input' : {0 : 'batch_size'},    # variable length axes
                                    'output' : {0 : 'batch_size'}})

data_array = ((x).detach().numpy()).reshape([-1]).tolist()

data = dict(input_data = [data_array])

    # Serialize data into file:
json.dump( data, open(data_path, 'w' ))