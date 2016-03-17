(function() {
    "use strict";

    var settings,
        
        github,
        
        issueByNumber = {};

    init();

    function init() {

        return new Promise(function(resolve, reject) {

            chrome.storage.local.get('token', function(storedSettings) {

                settings = storedSettings;

                if(! settings.token){
                    console.log('no github token stored, public issue access only');
                }

                var github = new Github({
                    token: settings.token,
                    auth: "oauth"
                });

                var pathParts = window.location.pathname.split('/'),
                    username = pathParts[1],
                    repo = pathParts[2];

                function indexIssues() {
                    
                    var issues = github.getIssues(username, repo);

                    issues.list({}, function(err, issues) {
                        
                        if (err) {
                         
                            console.error(err);
                        
                        } else {

                            for (var i = 0; i < issues.length; i++) {
                                
                                var issue = issues[i];
                                
                                issueByNumber[issue.number] = issue;
                            
                            }
                        }

                    });
                }

                indexIssues();

                resolve(issueByNumber);


            });

        });

    }

    function processPipeline(e) {

        var $element = $(e);

        if ($element.hasClass('zh-pipeline')) {

            var $pipeline = $element;

            var $wrapper = $pipeline.children('div.zh-pipeline-issues-wrapper');

            var $issues = $wrapper.children('ul.zh-pipeline-issues')

                .each(function() {

                    var $issueList = $(this);

                    $issueList.children('li.zh-pipeline-issue')
                        
                        .each(function() {
                            
                            var $issue = $(this),
                                
                                $card = $issue.children('div.zh-issuecard-container'),
                                
                                issueNumber = $card.children('div.zh-issuecard-main')
                                            .children('.zh-issuecard-body-container')
                                            .children('.zh-issuecard-header')
                                            .children('.zh-issuecard-number')
                                            .text().replace(/\s|\#/g, ''),
                                
                                issue = issueByNumber[issueNumber];

                            if (issue) {
                                
                                var body = issue.body;

                                var totalTasks = (body.match(/- \[[\s|x|X]\]/g) || []).length;

                                if (totalTasks > 0) {
                                    
                                    var completeTasks = (body.match(/- \[[x|X]\]/g) || []).length,

                                        max = 10,

                                        min = 0,

                                        percentage = ((completeTasks / totalTasks) * 100).toFixed(0),

                                        $progress = $('<div class="zh-issue-progress"/>'),

                                        $meter = $('<div class="meter"/>'),

                                        label = $('<label/>').html(completeTasks + '/' + totalTasks + ' (' + percentage + '%)'),

                                        span = $('<span class="meter"/>').css({ width: percentage + '%' });


                                    $card.children('.zh-issue-progress').remove();

                                    $card.append($progress);

                                    $progress.append($meter);

                                    $progress.append(label);

                                    $meter.append(span);

                                }

                            }

                        });
                });
        }
    }

    //when new elements are inserted into the dom
    $('body').on('DOMNodeInserted', function(e) {

        var $element = $(e.target);

        if ($element.hasClass('zh-pipeline')) {
            
            processPipeline(e.target);
        
        } else if ($element.hasClass('zh-pipeline-issue')) {
        
            init().then(function() {
        
                var $pipe = $element.parent().parent().parent();
        
                processPipeline($pipe);
        
            });

        }
    });

    //when user clicks the "x" to hide issueviewer
    $('body').on('click', '.zh-issueviewer-close-btn', function() {
        
        onIssueModalClose();

    });

    //when user clicks in gray area around issueviewer
    $('body').on('mousedown', '.zh-board-issue-view-overlay', function(e) {
        
        var $element = $(e.target);
        
        if ($element.hasClass('zh-board-issue-view-overlay')) {
        
            onIssueModalClose();
        
        }

    });

    function onIssueModalClose() {

        init().then(function() {
        
            setTimeout(function() {
        
                $('ul.zh-board-pipelines>li.zh-pipeline').each(function() {
        
                    var $pipe = $(this);
        
                    processPipeline($pipe);
        
                });
            }, 1000);

        });

    }

})();
