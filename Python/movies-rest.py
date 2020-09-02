from flask import jsonify, Flask
import flask
import json
from flask_cors import CORS
#import numpy as np
import traceback
import pickle
#import pandas 
import math
import jwt


from Orange.data import Table


genresAll = ["Action" , "Adult" , "Adventure" , "Animation" , "Biography" , 
             "Comedy" , "Crime" , "Documentary" , "Drama" , "Family" , "Fantasy" ,
             "History" , "Horror" , "Music" , "Musical" , "Mystery" , "News" , 
             "Reality-TV" , "Romance" , "Sci-Fi" , "Sport" , "Talk-Show" , 
             "Thriller" , "War" , "Western" ] 
  # without "null"  : special treatment
 
 
# App definition
app = Flask(__name__,template_folder='templates')
CORS(app)
 
# importing models
with open('model-movies/NN.pkcls', 'rb') as f:
   modelNN = pickle.load (f)
   
with open('model-movies/LR.pkcls', 'rb') as f:
   modelLR = pickle.load (f)
   
   
# importing models
with open('model-movies/65xx_NN.pkcls', 'rb') as f:
   modelNN_65xx = pickle.load (f)
   
with open('model-movies/65xx_LR.pkcls', 'rb') as f:
   modelLR_65xx = pickle.load (f)   
 

   
tableALL_12xx = Table("model-movies/classification.30000.budget2.ALL.wLog.tab")   

tableALL_65xx = Table("model-movies/classification.30000.budgetOrNot2.ALL.wLog.tab")   


def checkJWT(request):
    # return null if OK  ;  return response if NOT OK
     #  print('auth header', flask.request.headers.get('Authorization'))
     authHeader = request.headers.get('Authorization')
     if authHeader is None:
           return flask.Response('missing jwt token in auth header', 401)
     else:
           authHeader = authHeader.replace("Bearer ","")
#           print('cleaned header',authHeader)
           
           try : 
               jwt.decode(authHeader, 'DoesNotWorkWith_constant!!!', algorithms=['HS256'])
               return None
           except : 
               return flask.Response('incorrect jwt token in auth header', 401)


def getSplittedGenres(concatGenres):
    # return dictionary about genres, with 0 or 1 in the value depending on presence in the input concatGenres

    genresDico = {}

    for g in genresAll:
      genresDico[g]=0

    #print('genresDico', genresDico)

    genresArr = concatGenres.split()
    if (len(genresArr)==0) :
        genresDico['null'] = 1
    else :
        for g in genresArr:
            genresDico[g]=1
  
 #   print(genresDico)
    return genresDico
    
 
@app.route('/')
def welcome():
   return "Movies Result Prediction" 

# + "|".join(model_columns)
 
@app.route('/predict-12xx', methods=['POST','GET', 'PUT'])
def predict12xx():

#   if flask.request.method == 'OPTIONS':
#       print('request',str(flask.request))
#       return flask.Response('No idea what to include in response', 200)
    
   global tableALL_12xx

   if flask.request.method == 'GET':
       
       resp = None  #  No need to check JWT on HomePage  checkJWT(flask.request)
       if resp is None:
           return "Prediction page : "   +  str(tableALL_12xx.domain)
       else:
           return resp
       
   if flask.request.method == 'PUT':
       respAuth = checkJWT(flask.request)
       if respAuth is not None:
           return respAuth  
       
       
       tableALL_12xx = Table("model-movies/classification.30000.budget2.ALL.wLog.tab")
       
 
   if ((flask.request.method == 'POST') or (flask.request.method == 'PUT')) :
       respAuth = checkJWT(flask.request)
       if respAuth is not None:
           return respAuth
       try:
#           print('request',str(request))
           json_ = flask.request.get_json()
#           json_ = flask.request.get_json(force=True)
#           print('json',json_)
#           print('json_.Year',  json_[0]['Year'])

#           print('tableFromTR.domain[1].values', tableALL.domain[1].values)
#           print('tableFromTR.domain[32].values', tableALL.domain[32].values)
             
           test1Data = tableALL_12xx
           inst = test1Data[0]
           
#  perhaps refactor some fields in json to be more beautiful         
           test1Data[0]["Year"]= float(json_['Year'])
           test1Data[0]["Code"]= json_['Code']
           test1Data[0]["Duration2"]= float(json_['Duration2'])
           test1Data[0]["DurationPatched"]= json_['DurationPatched']
           test1Data[0]["Budget"]= float(json_['Budget'])
           test1Data[0]["BudgetLog"]= math.log10(float(json_['Budget']))

           dicoG =   getSplittedGenres(json_['Genres'])
           for key, value in dicoG.items():
               test1Data[0][key]= value
           
           test1Data[0]["Studio"]= json_['Studio']             
           
#           print('inst0',test1Data[0])
           
           predictionLogNN = modelNN(inst)
           predictionLogLR = modelLR(inst)
           
#           print('predictionNN',predictionLogNN)

           predictionNN = math.pow(10, predictionLogNN)
           predictionLR = math.pow(10, predictionLogLR)
           
           response = app.response_class(
                response=json.dumps(
                    [{ "algo" : "NN" , "catData" : "12xx", "value" :predictionNN, "valueLog" : predictionLogNN },
                     { "algo" : "LR" , "catData" : "12xx", "value" :predictionLR, "valueLog" : predictionLogLR }]),
                mimetype='application/json', status = 200
                )

           return response
       
          #return jsonify(
          #     [{ algo : "NN" , catData : "12xx", value :predictionNN, "valueLog" : str(predictionLogNN) },
          #      { algo : "LR" , catData : "12xx", value :predictionLR, "valueLog" : str(predictionLogLR) }])
 
       except:
           
          # reload shared instance for next retry. NB : the error is perhaps about invalidate params
           tableALL_12xx = Table("model-movies/classification.30000.budget2.ALL.wLog.tab")
           
           
           errorText = { "trace": traceback.format_exc() }
          # errorBody = jsonify({ "trace": traceback.format_exc() })
           
           
           print('error-12xx',errorText)
           return flask.Response(errorText, 500)
       
@app.route('/predict-65xx', methods=['POST','GET'])
def predict65xx():
  
   if flask.request.method == 'GET':
       return "Prediction page : "+  str(tableALL_65xx.domain)
     
   if flask.request.method == 'POST':
       respAuth = checkJWT(flask.request)
       if respAuth is not None:
           return respAuth
       try:
#           print('request',str(request))
           json_ = flask.request.get_json()
#           json_ = flask.request.get_json(force=True)
#           print('json',json_)
#           print('json_.Year',  json_[0]['Year'])

#           print('tableFromTR.domain[1].values', tableALL.domain[1].values)
#           print('tableFromTR.domain[32].values', tableALL.domain[32].values)
             
           test1Data = tableALL_65xx
           inst = test1Data[0]
           
#  perhaps refactor some fields in json to be more beautiful         
           test1Data[0]["Year"]= float(json_['Year'])
           test1Data[0]["Code"]= json_['Code']
           test1Data[0]["Duration2"]= float(json_['Duration2'])
           test1Data[0]["DurationPatched"]= json_['DurationPatched']
           test1Data[0]["Budget"]= json_['Budget']             # no float
    #       test1Data[0]["BudgetLog"]= float(json_['BudgetLog'])
           
           dicoG =   getSplittedGenres(json_['Genres'])
           for key, value in dicoG.items():
               test1Data[0][key]= value
           
           test1Data[0]["Studio"]= json_['Studio']             
           
#           print('inst',inst)
           

           predictionLogNN = modelNN_65xx(inst)
           predictionLogLR = modelLR_65xx(inst)
           
#           print('predictionNN',predictionLogNN)

           
           predictionNN = math.pow(10, predictionLogNN)
           predictionLR = math.pow(10, predictionLogLR)
           
           response = app.response_class(
                response=json.dumps(
                    [{ "algo" : "NN" , "catData" : "65xx", "value" :predictionNN, "valueLog" : predictionLogNN },
                     { "algo" : "LR" , "catData" : "65xx", "value" :predictionLR, "valueLog" : predictionLogLR }]),
                mimetype='application/json', status = 200
                )

           return response
 
       
   #        return jsonify(
   #            [{ "algo" : "NN" , "catData" : "65xx", "value" :str(predictionNN), "valueLog" : str(predictionLogNN) },
   #             { "algo" : "LR" , "catData" : "65xx", "value" :str(predictionLR), "valueLog" : str(predictionLogLR) }])
 
       except:
           return jsonify({
               "trace": traceback.format_exc()
               })        
      
 
if __name__ == "__main__":
   app.run()