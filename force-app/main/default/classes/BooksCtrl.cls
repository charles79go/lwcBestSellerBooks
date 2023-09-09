public with sharing class BooksCtrl {

    @AuraEnabled
    public static string getBookList(String category){
        try {

            // query the apiKey from custom metadata.
            ApiKey__mdt nytimes = [select Key__c from ApiKey__mdt where DeveloperName = 'NyTimesApiKey'];

            String url = 'https://api.nytimes.com/svc/books/v3/lists/current/'+ category + '.json?api-key=' + nytimes.Key__c;

            HttpRequest req = new HttpRequest();
            Http http = new Http();
            req.setMethod('GET');
            req.setEndpoint(url);

            HttpResponse response = http.send(req);

            // return the response body whether it is status 200 or not.  
            // let the lwc do the error handling.
            return response.getBody();
           
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}