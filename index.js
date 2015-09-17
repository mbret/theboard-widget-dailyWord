(function(){

    var Widget = {

        configuration: {},

        // This method is call by the library
        init: function( conf ){
            this.configuration = conf;
            this.initDisplay();
            this.start();
        },

        // This method will be call when widget should be start
        start: function(){
            this.refreshProcess.start();
        },

        // ...
        stop: function(){
            this.displayStopped();
            this.refreshProcess.stop();
        },

        // ...
        refresh: function(){
            this.displayRefreshing();
            this.refreshProcess.refresh();
        },

        // Here is an example of simple 'interval' process
        // It can be useful for a widget weather for example
        // Your widget will be refreshed automatically after x seconds
        refreshProcess : {
            interval: 2000000, // Just use an interval
            process: 0, // init the process

            // Control your process with these three methods below
            start: function(){
                if(this.process == 0){
                    Widget.refreshFunction();
                    this.process = setInterval( Widget.refreshFunction, this.interval);
                }
            },
            stop: function(){
                clearInterval(this.process);
                this.process = 0;
            },
            refresh: function(){
                this.stop();
                this.start();
            }
        },

        // This is the 'display refresh method'
        // This method get the needed data (from API for example)
        // Then refresh the display
        refreshFunction: function(){
            // do some stuff (get info from google API ?)
            // ...
            setTimeout(this.displayContent.bind(this), 1000);
        },

        initDisplay: function(){
            $('.widget-header').html('<h1>'+this.configuration.identity+'</h1>');
        },

        displayContent: function(){
            this.getDailyQuote()
                .then(function(data){
                    console.log(data);
                    $('#widget-title').html(data.title);
                    $('#widget-content').html(data.content);
                    $('#content-loading').hide();
                });
        },

        displayError: function(){
            $('.widget-content').html(
                '<p>Widget on error</p>'
            );
            $('.widget-updated').html('');
        },

        displayRefreshing: function(){
            $('.widget-content').html(
                '<p>Widget is refreshing</p>'
            );
            $('.widget-updated').html('');
        },

        displayStopped: function(){
            $('.widget-content').html(
                '<p>Widget is stopped</span></p>'
            );
            $('.widget-updated').html('');
        },

        getDailyQuote: function(){
            return new Promise(function(resolve, reject){
                google.load('feeds', '1', {callback : function(){
                    return Widget.getFeed()
                        .then(resolve)
                        .catch(reject);
                }});
            });
        },

        getFeed: function() {
            return new Promise(function(resolve, reject){
                var feed = new google.feeds.Feed("http://unmotparjour.fr/feed/");
                feed.load(function (result) {
                    if (!result.error) {
                        return resolve({
                            title: result.feed.entries[0].title,
                            content: result.feed.entries[0].content
                        });
                    }
                    return reject(result.error);
                });
            });

        }
    };

    document.addEventListener('widget.ready', function(customEvent){
        Widget.init(customEvent.detail);
    });

})();

