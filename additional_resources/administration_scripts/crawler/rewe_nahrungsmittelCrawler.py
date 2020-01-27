#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Mon Sep 30 12:07:49 2019

@author: sebastian

Use as needed ...
"""

from bs4 import BeautifulSoup
import requests
import urllib.request
import math
import csv
import json
import re
import sys

numPerPage = 200


reweBase = 'https://shop.rewe.de'
baseURL = f'{reweBase}'
queries = [
        #('/c/suesses-salziges/', 1020, 'suess-salzig'), 
        #('/c/nahrungsmittel', 4071, 'nahrungsmittel'), 
        #('/c/frische-kuehlung', 143, 'frische-kuehlung'), 
        #('/c/obst-gemuese/', 62, 'obst-gemuese'), 
        #('/c/kaffee-tee-kakao/', 950, 'kaffee-tee-kakao'), 
        #('/c/getraenke/', 197, 'getraenke'),
        #('/c/wein-spirituosen-tabak/', 1291, 'sprit')
        ('/c/tiefkuehl', 50, 'tiefkuehl')
           ]
querySignifier = '?'
objectPerPageQuery = f'objectsPerPage={numPerPage}' 
queryPage = '&page='
agent = {"User-Agent":'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36'}

for q in queries:
    numOfArticle = q[1]
    numOfPages = math.ceil(numOfArticle / numPerPage)
    linkList = set()
    for num in range(numOfPages):
        try:
            content = requests.get(f'{baseURL}{q[0]}{querySignifier}{objectPerPageQuery}{queryPage}{num + 1}', headers=agent)   
            soup = BeautifulSoup(content.text, 'lxml')
        except:
            print(f'Error occured while loading page: {baseURL}{querySignifier}{objectPerPageQuery}{queryPage}{num + 1}')
        finally:
            a = soup.select('div.search-service-productDetailsWrapper a')
            # concat links
            for l in a:
                linkList.add(f'{reweBase}{l["href"]}')
                
    with open(f'{q[2]}.csv', 'w') as myfile:
        for l in list(linkList):
             myfile.write(f'{l}\n')

for q in queries:           
    links = []
    with open(f'{q[2]}.csv', 'r') as f:
        reader = csv.reader(f, delimiter='\n')
        for r in reader:
            links.append(r[0])
    items = []
    label = set()
    for a, ind in zip(links, range(len(links))):
        n = f'Progress: {ind} of {len(links)}, {len(items)} were created.'
        print(n)
        #sys.stdout.write("\033[F")
        item = {}
        item['a'] = a
        try:
            content = requests.get(a, headers=agent)   
            soup = BeautifulSoup(content.text, 'lxml')
        except:
            print('someshit')
            # print(f'Error occured while loading page: {baseURL}{querySignifier}{objectPerPageQuery}{queryPage}{num + 1}')
            continue
        # price information ... not always present      
        if len(soup.select('div.pdr-CallToAction__box mark.pdr-PriceInformation__Price')) > 0:
            try:    
                priceString = soup.select('div.pdr-CallToAction__box mark.pdr-PriceInformation__Price')[0].contents[1]
                priceString = priceString.replace(' €', '')
                priceString = priceString.replace(',', '.')
                price = float(priceString)
                item['netPrice'] = price / 1.07
                item['currency'] = 'EUR'
                item['vat'] = 0.07
            except:
                print("Something went wrong while selecting price information")
                continue
            try:
                amountDesc1 = soup.select('div.pdr-Grammage--Detail')[0].contents[0].split()
                amountDesc = re.sub(r'(\d*)([A-Za-z])', r'\1 \2', amountDesc1[0]).split()
                amountDesc[0] = re.sub(',', '.', amountDesc[0])
                amount = float(amountDesc[0])
                item['content'] = {}
                if 'g' == amountDesc[1].lower() or 'kg' == amountDesc[1].lower():
                    item['content']['contentType'] = 'solid'
                    if 'g' == amountDesc[1].lower():
                        item['content']['amountInKG'] = amount / 1000
                        item['content']['displayAmount'] = 'g'
                    elif 'kg' == amountDesc[1].lower():
                        item['content']['amountInKG'] = amount
                        item['content']['displayAmount'] = 'kg'
                elif 'ml' == amountDesc[1].lower() or 'l' == amountDesc[1].lower():
                    item['content']['contentType'] = 'fluid'
                    if 'l' == amountDesc[1].lower():
                        item['content']['amountInKG'] = amount
                        item['content']['displayAmount'] = 'l'
                    elif 'ml' == amountDesc[1].lower():
                        item['content']['amountInKG'] = amount / 1000
                        item['content']['displayAmount'] = 'ml'
                    else:
                        raise Exception('Nothing matching')
            except Exception as e:
                # print(a)
                print(e)
                # print('Somthing went wrong while determining content')
        else: 
            continue
        # finally:
        # for the tags
        # print(item['content'])
        item["tags"] = []
        for tag, i in zip(soup.select('div.lr-breadcrumbs a'), range(len(soup.select('div.lr-breadcrumbs a')))):
            name = tag.contents[1]
            item["tags"].append(name) 
        # for name: string and brand: string 
        item['name'] = soup.select('h1.pdr-QuickInfo__heading')[0].contents[0] if len(soup.select('h1.pdr-QuickInfo__heading')) > 0 else ''
        item['brand'] = soup.select('div.pdr-QuickInfo__brandLabel a')[0].contents[0] if len(soup.select('div.pdr-QuickInfo__brandLabel a')) > 0 else ''
        # check if description present
        if len(soup.select('h2.pdr-ToggleBox__heading')) > 0:
            item['description'] = [
                {"header": soup.select('h2.pdr-ToggleBox__heading')[0].contents[0]}
                ]
            if len(soup.select('div.pdr-AttributeGroup pre')) > 0:
                item['description'][0]["text"] = soup.select('div.pdr-AttributeGroup pre')[0].contents[0] if len(soup.select('div.pdr-AttributeGroup pre')[0].contents) > 0 else ''
        for attr in soup.select('div.pdr-Attribute'):
            # contents
            if 'Zutaten' in attr.contents[0]:
                if 0 < len(attr.contents) < 2:
                    continue
                else:
                    item["ingredients"] = attr.contents[1]
            # for content information { contentType: string (fluid, solid), amountInKG: number, displayAmount: string (g, kg) }
            # signifies if bio, etc... 
            if 'Eigenschaften' in attr.contents[0]:
                if 'baseAttributes' not in item.keys():
                    item['baseAttributes'] = []
                item['baseAttributes'] = attr.contents[1].split(', ')        
        # for nutritional information
        if len(soup.select('table.pdr-NutritionTable td')) > 0:
            item['nutritionalTable'] = {}
            td = soup.select('table.pdr-NutritionTable td')
            for index in range(len(soup.select('table.pdr-NutritionTable td'))):
                if td[index].contents[0] == 'Energie':
                    key = td[index+1].contents[0].split()[1].lower()
                    item['nutritionalTable'][key] = float(td[index+1].contents[0].split()[0]) if len(td[index+1].contents[0].split()) <= 2 else float(td[index+1].contents[0].split()[1])
                    # check if kj or kcal
                if 'Fett' == td[index].contents[0]:
                    item['nutritionalTable']['totalFat'] = float(td[index+1].contents[0].split()[0]) if len(td[index+1].contents[0].split()) <= 2 else float(td[index+1].contents[0].split()[1])
                if 'gesättigte Fett' in td[index].contents[0]: 
                    item['nutritionalTable']['saturatedFat'] = float(td[index+1].contents[0].split()[0]) if len(td[index+1].contents[0].split()) <= 2 else float(td[index+1].contents[0].split()[1])
                if 'Kohlenhydrate' == td[index].contents[0]:
                    item['nutritionalTable']['totalCarbohydrate'] = float(td[index+1].contents[0].split()[0])if len(td[index+1].contents[0].split()) <= 2 else float(td[index+1].contents[0].split()[1])
                if 'Zucker' in td[index].contents[0]:
                    item['nutritionalTable']['sugar'] = float(td[index+1].contents[0].split()[0]) if len(td[index+1].contents[0].split()) <= 2 else float(td[index+1].contents[0].split()[1])
                if 'Eiweiß' == td[index].contents[0]:
                    item['nutritionalTable']['protein'] = float(td[index+1].contents[0].split()[0]) if len(td[index+1].contents[0].split()) <= 2 else float(td[index+1].contents[0].split()[1])
                if 'Salz' == td[index].contents[0]:
                    item['nutritionalTable']['salt'] = float(td[index+1].contents[0].split()[0]) if len(td[index+1].contents[0].split()) <= 2 else float(td[index+1].contents[0].split()[1])
        # check for label
        if len(soup.select('div.pdr-BadgesBar--breakAfterThree div img')) > 0:
            for l in soup.select('div.pdr-BadgesBar--breakAfterThree div img'):
                if l['alt'] in label:
                    continue
                label.add(l['alt'])
                urllib.request.urlretrieve(l['src'], f'/home/sebastian/Documents/2019/Studium/Master/python/crawler/label/{l["alt"]}.png')
        # for the images?
        if len(soup.select('div.pdr-PictureHoverZoom--ThumbWrapper picture img')) > 0:
            pic = soup.select('div.pdr-PictureHoverZoom--ThumbWrapper picture img')[0]
        else:
            pic = soup.select('picture.pdr-ProductMedia img')[0]
        picName = pic['alt'].replace(' ', '_')
        if '/' in picName:
            picName = picName.replace('/', '')
        urllib.request.urlretrieve(pic['src'], f'/home/sebastian/Documents/2019/Studium/Master/python/crawler/item_image/{picName}.png')
        item['imagePath'] = f'/home/sebastian/Documents/2019/Studium/Master/python/crawler/item_image/{picName}.png'
        items.append(item)
    
    with open (f'{q[2]}.json', 'w') as f: 
        json.dump(items, f)
