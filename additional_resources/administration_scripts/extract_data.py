#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Jan  7 18:30:41 2020

@author: sebastian


Script for extracting and converting data generated during a specific trial. 

"""

import requests
import pandas as pd
from benedict import benedict
import matplotlib.pyplot as plt
import numpy as np
import json
import re

# URLs 
baseURL = '<base_url_of_api>/api'
treatmentID = '<treatmentID>'
trialDataRoute = f'/download/data/{treatmentID}'
treatmentData = f'/t/{treatmentID}'
base_path = r'<path_to_workspace_folder>'
json_file = r'all_items.json'

# Information for api access and URLs
cookies = {"express:sess.sig": "<your_sess:sig>", "express:sess": "<your_sess>"}
httpHeader = {
        'Content-Type': 'application/json' 
        }

def checkIfMobile(user_agent):
    reg_b = re.compile(r"(android|bb\\d+|meego).+mobile|avantgo|bada\\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\\.(browser|link)|vodafone|wap|windows ce|xda|xiino", re.I|re.M)
    reg_v = re.compile(r"1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\\-(n|u)|c55\\/|capi|ccwa|cdm\\-|cell|chtm|cldc|cmd\\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\\-s|devi|dica|dmob|do(c|p)o|ds(12|\\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\\-|_)|g1 u|g560|gene|gf\\-5|g\\-mo|go(\\.w|od)|gr(ad|un)|haie|hcit|hd\\-(m|p|t)|hei\\-|hi(pt|ta)|hp( i|ip)|hs\\-c|ht(c(\\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\\-(20|go|ma)|i230|iac( |\\-|\\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\\/)|klon|kpt |kwc\\-|kyo(c|k)|le(no|xi)|lg( g|\\/(k|l|u)|50|54|\\-[a-w])|libw|lynx|m1\\-w|m3ga|m50\\/|ma(te|ui|xo)|mc(01|21|ca)|m\\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\\-2|po(ck|rt|se)|prox|psio|pt\\-g|qa\\-a|qc(07|12|21|32|60|\\-[2-7]|i\\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\\-|oo|p\\-)|sdk\\/|se(c(\\-|0|1)|47|mc|nd|ri)|sgh\\-|shar|sie(\\-|m)|sk\\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\\-|v\\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\\-|tdg\\-|tel(i|m)|tim\\-|t\\-mo|to(pl|sh)|ts(70|m\\-|m3|m5)|tx\\-9|up(\\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\\-|your|zeto|zte\\-", re.I|re.M)
    b = reg_b.search(user_agent)
    v = reg_v.search(user_agent[0:4])
    if b or v:
        return True
    else:
        return False
    
def seperateBasedOnMobile(dataFrame):
    return {'mobile': dataFrame.loc[dataFrame['mobile'] == 1], 'notMobile': dataFrame.loc[dataFrame['mobile'] != 1]}

def getWriter(file_name):
    return pd.ExcelWriter(f'{base_path}{file_name}.xlsx', engine='xlsxwriter')

## get Trial data 
resp = requests.get(
        f'{baseURL}{trialDataRoute}',
        headers=httpHeader,
        cookies=cookies,
        )

############################################################

# prepare dicts for additional data eg. match item attributes to final cart ... 
# only get item data if not present
itemCatalog = {}
try:    
    with open(f'{base_path}{json_file}', 'r') as infile:
        itemCatalog = json.load(infile)
except: pass

if not itemCatalog:
    print("Item data is being fetched")
    respShopItems = requests.get(
        f'{baseURL}{treatmentData}',
        headers=httpHeader,
        cookies=cookies
        )
    
    for item in respShopItems.json()['items']:
        # print(item['_id'])
        itemCatalog[item['_id']] = item

    with open(f'{base_path}{json_file}', 'w') as f:
        json.dump(itemCatalog, f)

############################################################
"""
Extract general Data about subjects from trial data
"""

generalData = pd.DataFrame()
routingData = pd.DataFrame()
paginationData = pd.DataFrame()
finalCart = pd.DataFrame()
transactionData = pd.DataFrame()
swapData = pd.DataFrame()
swapOptData = pd.DataFrame()
infoViewed = pd.DataFrame()
itemsFilteredData = pd.DataFrame()

questionnaireItems = pd.DataFrame()

# Only interesting if demographic facts are recorded during a trial (q2.component)
attributes = {
        "subject": 'subjectID',
        "device":'userAgentHeader', 
        "deviceWidth":'deviceWidth', 
        "deviceHeight":'deviceHeight',
        'age': 'questionnaire|personalInfo|age',
        'gender':'questionnaire|personalInfo|gender',
        'occupation':'questionnaire|personalInfo|occupation',
        'education':'questionnaire|personalInfo|education',
        'housing':'questionnaire|personalInfo|housing',
        'foodPurchaseResp':'questionnaire|personalInfo|foodPurchaseResp',
        'shoppingFrequency':'questionnaire|personalInfo|shoppingFrequency',
        'income':'questionnaire|personalInfo|income',
        'expenditures':'questionnaire|personalInfo|expenditures',
        'maritalStatus':'questionnaire|personalInfo|maritalStatus',
        'email': 'questionnaire|personalInfo|email',
        'finished': 'questionnaire|personalInfo|finished',
        'started': 'started', 
        'ended':'ended'
        }

for subject, ind in zip(resp.json(), range(len(resp.json()))):
    subjectID = subject['subjectID']
    
    # general data about the trial
    print(ind)
    data = benedict(subject, keypath_separator='|')
    temp = {}
    for key, value in attributes.items():
        # Ecept any error and place value of None in df
        try:
            if data[value] == 'none':
                temp[key] = pd.np.nan
            else:
                temp[key] = data[value] 
        except Exception as error:
            print(error)
            temp[key] = None
    temp['mobile'] = checkIfMobile(temp['device'])
    generalData = generalData.append(temp, ignore_index=True)
    
    # for routing data
    for routing in subject['data']['routing']:
        routing['subject'] = subjectID
        routing['mobile'] = temp['mobile']
        routingData = routingData.append(routing, ignore_index=True)
        
    # for pagination data
    for pagination in subject['data']['pagination']:
        pagination['subject'] = subjectID
        pagination['mobile'] = temp['mobile']
        paginationData = paginationData.append(pagination, ignore_index=True)
        
    # for final cart
    for finalC in subject['data']['finalCart']:
        cartItem = dict(finalC)
        cartItem['subject'] = subjectID
        cartItem['mobile'] = temp['mobile']
        ## add item data with mapping
        cartItem.update(itemCatalog[cartItem['itemID']])
        del cartItem['_id']
        del cartItem['oldID']
        # unest nutritional table
        try:
            del cartItem['nutritionalTable']
            print(itemCatalog[cartItem['itemID']]['nutritionalTable'])
            cartItem.update(itemCatalog[cartItem['itemID']]['nutritionalTable'])
        except Exception as error:
            print(error)
        # unnest content description
        try:
            del cartItem['content']
            cartItem.update(itemCatalog[cartItem['itemID']]['content'])
        except Exception as error:
            print(error)
        # unnest baseAttributes
        if len(itemCatalog[cartItem['itemID']]['baseAttributes']) > 0:
            for attr in itemCatalog[cartItem['itemID']]['baseAttributes']:
                cartItem[attr] = 1
        
        finalCart = finalCart.append(cartItem, ignore_index=True)
        
    # for transactions
    for trans in subject['data']['transaction']:
        trans['subject'] = subjectID
        trans['mobile'] = temp['mobile']
        ## add item data with mapping
        
        transactionData = transactionData.append(trans, ignore_index=True)
        
    # for swap data
    for swap in subject['data']['swaps']:
        swap['subject'] = subjectID
        swapData = swapData.append(swap, ignore_index=True)
        
    # for swap opts selected
    for swapOpt in subject['data']['swapOpts']:
        swapOpt['subject'] = subjectID
        swapOpt['mobile'] = temp['mobile']
        swapData = swapData.append(swapOpt, ignore_index=True)
    
    # for info viewed
    for info in subject['data']['infoViewed']:
        info['subject'] = subjectID
        info['mobile'] = temp['mobile']
        infoViewed = infoViewed.append(info, ignore_index=True)
    
    # filter operations
    for itemsfiltered in subject['data']['itemsFiltered']:
        itemsfiltered['subject'] = subjectID
        itemsfiltered['mobile'] = temp['mobile']
        itemsFilteredData = itemsFilteredData.append(itemsfiltered, ignore_index=True)
        
    # Questionnaire items
    quest = {}
    quest['subject'] = subjectID
    quest['mobile'] = temp['mobile']
    quest['finished'] = subject['finished']
    try:
        quest.update(subject['questionnaire']['questions1'])
        quest.update(subject['questionnaire']['questions2'])
    except Exception as error:
        print(error)
    questionnaireItems = questionnaireItems.append(quest, ignore_index=True)

## Basic data 
generalData.fillna(value=pd.np.nan, inplace=True)
generalData['ended'].replace(pd.np.nan, '', inplace=True)
num_total = len(generalData)
num_mobile = len(generalData.loc[generalData['mobile'] == 1])
num_notMobile = num_total - num_mobile
num_finished = len(generalData.loc[generalData['ended'] != ''])
num_finished_mobile = len(generalData.loc[(generalData['ended'] != '') & (generalData['mobile'] == 1)])
num_finished_notMobile = num_finished - num_finished_mobile
emails = generalData['email']

"""
Write to Excel file, with sheets
"""
# Create a Pandas Excel writer using XlsxWriter as the engine.
writer = getWriter('basic_data')
b_data = {
        'number_total': num_total, 
        'number_finished': num_finished,
        'num_mobile': num_mobile,
        'num_notMobile': num_notMobile,
        'num_finished_mobile': num_finished_mobile, 
        'num_finished_notMobile': num_finished_notMobile
        }
df_1 = pd.DataFrame(b_data, index=[0])
df_1.to_excel(writer, sheet_name='Basic_Data')
emails.replace(pd.np.nan, '', inplace=True)
emails.to_excel(writer, sheet_name='emails')
# export to excel
generalData.to_excel(writer, sheet_name='General_Data')
routingData.to_excel(writer, sheet_name='Routing_Data')
paginationData.to_excel(writer, sheet_name='Pagination_Data')
finalCart.to_excel(writer, sheet_name='Final_Cart')
transactionData.to_excel(writer, sheet_name='Transaction_Data')
swapData.to_excel(writer, sheet_name='Swap_Data')
swapOptData.to_excel(writer, sheet_name='SwapOpt_Data')
infoViewed.to_excel(writer, sheet_name='Info_Viewed')
itemsFilteredData.to_excel(writer, sheet_name='Items_Filtered')
questionnaireItems.to_excel(writer, sheet_name='Questionnaire_Items')
# Close the Pandas Excel writer and output the Excel file.
writer.save()


# replace all invalid None to nan values
questionnaireItems.fillna(value=pd.np.nan, inplace=True)
# General describe satisfaction and other questions 
## comparison between mobile and desktop users
both = questionnaireItems.loc[questionnaireItems['finished'] == 1].describe()
woMobile = questionnaireItems.loc[(questionnaireItems['finished'] == 1) & (questionnaireItems['mobile'] != 1)]
wo = woMobile.describe()
withMobile = questionnaireItems.loc[(questionnaireItems['finished'] == 1) & (questionnaireItems['mobile'] == 1)]
wi = withMobile.describe()
result = wi - wo 

#t_both = both.T
#t_both.rename({'count':'count_both', 'mean': 'mean_both', 'std':'std_both', 'min':'min_both', 'max': 'max_both'})
#t_wo = wo.T
#t_both.rename({'count':'count_pc', 'mean': 'mean_pc', 'std':'std_pc', 'min':'min_pc', 'max': 'max_pc'})
#t_wi = wi.T
#t_both.rename({'count':'count_mobile', 'mean': 'mean_mobile', 'std':'std_mobile', 'min':'min_mobile', 'max': 'max_mobile'})
#questionnaire_auswertung = pd.DataFrame()
#questionnaire_auswertung = questionnaire_auswertung.append(t_both)
#questionnaire_auswertung = questionnaire_auswertung.append(t_wo)
#questionnaire_auswertung = questionnaire_auswertung.append(t_wi)
"""
Write to Excel file, with sheets
"""
writer = getWriter('questionnaire_data')
both.T.to_excel(writer, sheet_name='desc_all')
wo.T.to_excel(writer, sheet_name='desc_only_desktop')
wi.T.to_excel(writer, sheet_name='desc_only_mobile')
result.T.to_excel(writer, sheet_name='diff_desktop_mobile')
writer.save()

writer = getWriter('free_text_feedback')
questionnaireItems[['subject', 'dmd.5']].to_excel(writer, sheet_name="feedback")
writer.save()

# final Cart 
amount_of_different_items = finalCart['subject'].value_counts().describe()
count_of_single_item_purchased = finalCart['amount'].value_counts().describe()
count_of_items_in_final_cart = finalCart.groupby(['subject']).sum().loc[:, 'amount']
desc_count_of_items_in_final_cart = count_of_items_in_final_cart.loc[(count_of_items_in_final_cart <= 50) & (count_of_items_in_final_cart > 9)].describe()
number_of_unique_items_purchased_overall = finalCart.loc[:, 'itemID'].nunique()

"""
Write to Excel file, with sheets
"""
writer = getWriter('final_Cart')
amount_of_different_items.to_excel(writer, sheet_name='desc_unique_items_purchased')
count_of_single_item_purchased.to_excel(writer, sheet_name='desc_all_items_purchased')
count_of_items_in_final_cart.to_excel(writer, sheet_name='count_corresponding_to_subject')
desc_count_of_items_in_final_cart.to_excel(writer, sheet_name='desc_count_overall')
writer.save()


# demographic facts numerical
dem_facts_numerical_data = generalData.loc[:, ['age', 'foodPurchaseResp', 'shoppingFrequency', 'income', 'expenditures']]
dem_facts_numerical_data.fillna(value=pd.np.nan, inplace=True)
dem_facts_numerical_data.loc[dem_facts_numerical_data['income'] < 10] = pd.np.nan

desc_dem_facts_numerical_data = dem_facts_numerical_data.describe()
age_data_aggegated = np.array([
len(dem_facts_numerical_data.loc[dem_facts_numerical_data['age'] <= 20]),
len(dem_facts_numerical_data.loc[(dem_facts_numerical_data['age'] > 20) & (dem_facts_numerical_data['age'] <= 30)]),
len(dem_facts_numerical_data.loc[(dem_facts_numerical_data['age'] <= 40) & (dem_facts_numerical_data['age'] > 30)]),
len(dem_facts_numerical_data.loc[dem_facts_numerical_data['age'] > 40])
])

under_20 = dem_facts_numerical_data.loc[dem_facts_numerical_data['age'] <= 20]
range_20_30 = dem_facts_numerical_data.loc[(dem_facts_numerical_data['age'] > 20) & (dem_facts_numerical_data['age'] <= 30)]
range_30_40 = dem_facts_numerical_data.loc[(dem_facts_numerical_data['age'] <= 40) & (dem_facts_numerical_data['age'] > 30)]
over_40 = dem_facts_numerical_data.loc[dem_facts_numerical_data['age'] > 40]

avg_income = np.array([
            # under_20['income'].mean(),
            range_20_30['income'].mean(),
            range_30_40['income'].mean(),
            over_40['income'].mean()
        ])

avg_expenditure = np.array([
            # under_20['expenditures'].mean(),
            range_20_30['expenditures'].mean(),
            range_30_40['expenditures'].mean(),
            over_40['expenditures'].mean()
        ])

dft1 = pd.DataFrame(age_data_aggegated, columns=['participants'], index=['under 20', '20 - 30', '30 - 40', 'over 40'])
dft2 = pd.DataFrame(avg_income, columns=['avg. income'], index=['20 - 30', '30 - 40', 'over 40'])
dft3 = pd.DataFrame(avg_expenditure, columns=['avg. expenditures'], index=['20 - 30', '30 - 40', 'over 40'])

fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15,5))
fig.suptitle('Demographical facts')
ax1.bar(['under 20', '20 - 30', '30 - 40', 'over 40'], height=dft1.iloc[:, 0])
ax1.title.set_text('Age distribution')
ax2.bar(['20 - 30', '30 - 40', 'over 40'], height=dft2.join([dft3]).iloc[:, 0])
ax2.title.set_text('Average income')
ax3.bar(['20 - 30', '30 - 40', 'over 40'], height=dft2.join([dft3]).iloc[:, 1])
ax3.title.set_text('Average expenditures')
plt.savefig('test.png')

### demographical facts education
writer = getWriter('general_facts')
generalData.loc[:, 'education'].value_counts().to_excel(writer, sheet_name="education")
generalData.loc[:, 'gender'].value_counts().to_excel(writer, sheet_name="gender")
generalData.loc[:, 'housing'].value_counts().to_excel(writer, sheet_name="housing")
generalData.loc[:, 'maritalStatus'].value_counts().to_excel(writer, sheet_name="marital_status")
writer.save()

"""
Write to Excel file, with sheets
"""


# item heat map? search term word cloud? filterTag selected / heat map
# pagination 
#### how many pagination events based on subject
df_pagination = paginationData.copy()
sep = seperateBasedOnMobile(df_pagination)
num_pagination_mobile = sep['mobile'].groupby(['subject']).count().iloc[:, 0]
num_pagination_not_mobile = sep['notMobile'].groupby(['subject']).count().iloc[:, 0]
## number of pagination mobile vs pc based on mean
desc_num_pagination_mobile = num_pagination_mobile.describe()
desc_num_pagination_not_mobile = num_pagination_not_mobile.describe()
#### did people use the change items per page?
how_many_times_change_item_count_displayes_mobile = sep['mobile'].groupby(['subject']).nunique().loc[:, 'pageSize']
how_many_times_change_item_count_displayes_not_mobile = sep['notMobile'].groupby(['subject']).nunique().loc[:, 'pageSize']
desc_how_many_times_change_item_count_displayes_mobile = how_many_times_change_item_count_displayes_mobile.describe()
desc_how_many_times_change_item_count_displayes_not_mobile = how_many_times_change_item_count_displayes_not_mobile.describe()
#### items most viewed ... items most viewed without first 10 (always shown after filter resert)
itemHeat = {}
exclude = False
items_to_exclude = {
        '5de85552252b3b0bf0dbb541': exclude,
        '5de85552252b3b0bf0dbb54b': exclude,
        '5de85552252b3b0bf0dbb545': exclude,
        '5de85552252b3b0bf0dbb543': exclude,
        '5de85552252b3b0bf0dbb547': exclude,
        '5de85552252b3b0bf0dbb53f': exclude,
        '5de85552252b3b0bf0dbb549': exclude,
        '5de85559252b3b0bf0dbc801': exclude,
        '5de85557252b3b0bf0dbb55c': exclude,
        '5de85557252b3b0bf0dbb566': exclude
        } 
for l in paginationData['itemsOnPage']:
    for i in l:
        try:
            if items_to_exclude[i]: continue
            else: raise '' 
        except:
            try:
                itemHeat[i] = itemHeat[i] + 1
            except:
                itemHeat[i] = 1


## in relation to evetually bought
temp_df = finalCart.groupby(['itemID'])
total_num_of_indv_item_purchased = temp_df['amount'].sum() 
new_df = pd.DataFrame(total_num_of_indv_item_purchased.loc[total_num_of_indv_item_purchased > 3])
new_df['times_viewed'] = pd.Series(itemHeat)
amount_of_times_spotted_and_in_fC = pd.DataFrame()

#### routing data
## number of times routed?
sep_routing = seperateBasedOnMobile(routingData)
number_of_times_routed_m = sep_routing['mobile'].groupby(['subject']).nunique()['_id']
number_of_times_routed_nm = sep_routing['notMobile'].groupby(['subject']).nunique()['_id']
desc_number_of_times_routed_m = number_of_times_routed_m.describe()
desc_number_of_times_routed_nm = number_of_times_routed_nm.describe()

### more information viewed and purchased?

#tbd

##### test plt
## replace all None objects with nan for describe ...

forPlt = questionnaireItems[['satGen.01', 'satGen.02', 'satGen.03', 'satGen.04', 'satGen.05']]
forPlt.boxplot().get_figure().savefig('test.png')

