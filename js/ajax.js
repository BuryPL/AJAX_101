'use strict';

function ajax(ajaxOptions) {
    
    //parametry połączenia i jego typu
    var options = {
        type: ajaxOptions.type || "POST",
        url: ajaxOptions.url || "",
        onComplete: ajaxOptions.onComplete || function() {},
        onError: ajaxOptions.onError || function() {},
        onSuccess: ajaxOptions.onSuccess || function() {},
        dataType: ajaxOptions.dataType || "text"
    };
    
    //funkcja sprawdzająca czy połączenie się udało
    function httpSuccess(httpRequest) {
        //przechwytywanie wyjątków
        try {
            return (httpRequest.status >= 200 && httpRequest.status <= 300 || httpRequest.status == 304 || navigator.userAgent.indexOf("Safari") >= 0 && typeof httpRequest.status == "undefined");
        } catch (e) {
            return false;
        };
    }
    
    //utworzenie obiektu
    var httpReq = new XMLHttpRequest();
    //to co wpiszemy w url, to jest przesyłane metodą GET
    
    //otwarcie połączenia 
    httpReq.open(options.type, options.url, true);
    
    //jeśli stan dokumentu został zmieniony
    //0: połączenie nie nawiązane
    //1: połączenie nawiązane
    //2: żądanie odebrane
    //3: przetwarzanie
    //4: dane zwrócone i gotowe do użycia
    httpReq.onreadystatechange = function() {
        //jeśli 4: dane zwrócone i gotowe do użycia
        if (httpReq.readyState == 4) {
          //sprawdź status połączenia
            if (httpSuccess(httpReq)) {
                //jeżeli dane w formacie xml to zwrócić obiekt returnXML, w przeciwnym wypadku responseText (JSON to text)
                var returnData = (options.dataType == "xml") ? httpReq.responseXML : httpReq.responseText;
                
                //jeśli wszystko ok
                options.onSuccess(returnData);
                
                //zeruj obiekt, żeby nie utrzymywać niepotrzebnego już połączenia z serwerem
                httpReq = null;
            } else {
                //w przypadku błędu
                options.onError(httpReq.statusText);
            };
        };
    };
    httpReq.send();
};

ajax({
    type: "GET",
    url: "http://echo.jsontest.com/userId/108/userName/Akademia108/userURL/akademia108.pl",
    onError: function (msg) {console.log(msg);},
    onSuccess: function (response) {
        var jsonObj = JSON.parse(response);
        console.log(jsonObj);
        console.log("uj");
    }
});
