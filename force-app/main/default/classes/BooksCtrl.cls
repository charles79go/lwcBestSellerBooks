public with sharing class BooksCtrl {
    @AuraEnabled
    public static String getBookList(String category) {
        try {
            // query the NY Times apiKey from custom metadata.
            ApiKey__mdt nytimes = [
                SELECT Key__c
                FROM ApiKey__mdt
                WHERE DeveloperName = 'NyTimesApiKey'
                LIMIT 1
            ];

            String url =
                'https://api.nytimes.com/svc/books/v3/lists/current/' +
                category +
                '.json?api-key=' +
                nytimes.Key__c;

            HttpResponse response = sendRequest(url);

            // return the response body whether it is status 200 or not.
            // let the lwc do the error handling.
            return response.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String getBookDetails(String title, String isbn) {
        try {
            // query the googleBooks apiKey from custom metadata.
            ApiKey__mdt googleBooksApi = getGoogleApiKey();

            // title can hava a space so it needs to be encoded
            title = EncodingUtil.URLENCODE(title, 'UTF-8');

            String url =
                'https://www.googleapis.com/books/v1/volumes?q=' +
                title +
                '+intitle:' +
                title +
                '+isbn:' +
                isbn +
                '&maxResults=20&printType=books&key=' +
                googleBooksApi.Key__c;

            HttpResponse response = sendRequest(url);

            // return the response body whether it is status 200 or not.
            // let the lwc do the error handling.
            return response.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled
    public static String searchBooks(String searchString) {
        try {
            // query the googleBooks apiKey from custom metadata.
            ApiKey__mdt googleBooksApi = getGoogleApiKey();

            // title can hava a space so it needs to be encoded
            searchString = EncodingUtil.URLENCODE(searchString, 'UTF-8');

            String url =
                'https://www.googleapis.com/books/v1/volumes?q=' +
                searchString +
                '&maxResults=20&printType=books&key=' +
                googleBooksApi.Key__c;

            HttpResponse response = sendRequest(url);

            // return the response body whether it is status 200 or not.
            // let the lwc do the error handling.
            return response.getBody();
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    private static ApiKey__mdt getGoogleApiKey() {
        return [
            SELECT Key__c
            FROM ApiKey__mdt
            WHERE DeveloperName = 'GoogleBooksApiKey'
            LIMIT 1
        ];
    }

    private static HttpResponse sendRequest(String url) {
        HttpRequest req = new HttpRequest();
        Http http = new Http();
        req.setMethod('GET');
        req.setEndpoint(url);
        HttpResponse response = http.send(req);
        return response;
    }
}
