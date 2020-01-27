#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Sep 30 19:04:17 2019

@author: sebastian


Script for uploading items based on json file
"""
import requests
import json

url = '<base_url_of_api>'
item = '/api/item'
itemImage = '/api/add/image'
# user_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkMTBlNmVhNTI0MjBhMWUzMDlhMzdmNCIsImlhdCI6MTU2OTkxMDAxMSwiZXhwIjoxNTY5OTk2NDExfQ.djx6ZOUPhj1XsFmPgPSvKrlX9Q9ipJlULYk-aPUqSvE'
cookies = {"express:sess.sig": "<your_sess:sig>", "express:sess": "<your_sess>"}
httpHeader = {
        'Content-Type': 'application/json' 
        }

items_file = r'path_to_items/name_of_file.json'


with open(f'{items_file}', 'r') as f: 
    for row in json.load(f):
        data.append(row)

# data pruening if there is no description toss it (only execute if necessary, or expand if necessary)
counter = 0
dataClean = []
for d, i in zip(data, range(len(data))):
    if 'description' in d.keys():    
        if 'text' in d['description'][0].keys():
            dataClean.append(data[i])
            counter +=1
            # del data[i]
print(counter)

dataClean = []
# save all items selected before upload
with open(r'selected_base_items.json', 'r') as f:
    for row in json.load(f):
        row["niceness"] = 1
        dataClean.append(row)
    json.dump(dataClean, f)
## not necessary if already in memory
with open(r'selected_base_items.json', 'w') as f:
    json.dump(dataClean, f)

itemsCreated = []
# upload each item
for row in dataClean:
    try:
        open(f'{row["imagePath"]}', 'rb')
    except:
        continue
    try:
        resp = requests.post(
                f'{url}{item}',
                headers=httpHeader,
                cookies=cookies,
                json=row
                )
    except requests.exceptions.RequestException as e:
        print(e)
        break    
    # if successfully created
    # add image to item?
    files = {'image': open(f'{row["imagePath"]}', 'rb')}
    try: 
        respImage = requests.post(
                f'{url}{itemImage}',
                files=files,
                cookies=cookies,
                data={'itemID':f'{resp.json()["_id"]}'}
                )
    except requests.exceptions.RequestException as e:
        print(e)
        break
    
############# Here you could also add other additions to that item like swap items, additional infor taxes etc.
