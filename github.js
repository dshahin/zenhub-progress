(function() {
    "use strict";
    //document.body.style.background = 'yellow';
    var settings,
        github,
        issueByNumber = {};

    init();

    function init() {
        // Use default value color = 'red' and likesColor = true.
        chrome.storage.sync.get('token', function(storedSettings) {

            settings = storedSettings;
            console.log('settings', settings);
            var github = new Github({
                token: settings.token,
                auth: "oauth"
            });

            console.log(window.location.pathname);

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


        });
    }

    function processPipeline(e) {
        var $element = $(e.target);
        //console.log(e.target);
        if ($element.hasClass('zh-pipeline')) {
            var $pipeline = $element;
            var $wrapper = $pipeline.children('div.zh-pipeline-issues-wrapper');

            var $issues = $wrapper.children('ul.zh-pipeline-issues')
                .each(function() {
                    var $issueList = $(this);
                    $issueList.children('li.zh-pipeline-issue')
                        .each(function() {
                            var $issue = $(this),
                                $card = $issue.children('div.zh-issuecard-container');
                            // $main = $card.children('div.zh-issuecard-main');
                            // $meta = $card.children('div.zh-issuecard-meta');

                            var issueNumber = $card.children('div.zh-issuecard-main')
                                .children('.zh-issuecard-body-container')
                                .children('.zh-issuecard-header')
                                .children('.zh-issuecard-number')
                                .text().replace(/\s|\#/g, '');


                            var issue = issueByNumber[issueNumber];

                            if (issue) {
                                var body = issue.body;

                                var totalTasks = (body.match(/- \[[\s|x|X]\]/g) || []).length,
                                    completeTasks = (body.match(/- \[[x|X]\]/g) || []).length;

                                var max = 10,

                                    min = 0,

                                    //totalTasks = Math.floor(Math.random() * (max - min + 1) + min),

                                    //completeTasks = Math.floor(Math.random() * (totalTasks - min + 1) + min),

                                    percentage = ((completeTasks / totalTasks) * 100).toFixed(0),

                                    $progress = $('<div/>').addClass('zh-issue-progress'),

                                    $meter = $('<div/>').addClass('meter'),

                                    label = $('<label/>').html(completeTasks + '/' + totalTasks + ' (' + percentage + '%)'),

                                    span = $('<span/>')
                                    .addClass('zh-issue-progress')
                                    .css({ width: percentage + '%' });

                                if (totalTasks > 0) {

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
    $(document).on('DOMNodeInserted', function(e) {

        var $element = $(e.target);
        if ($element.hasClass('zh-pipeline')) {
            processPipeline(e);
        } else if ($element.hasClass('zh-pipeline-issue')) {
            console.log('just an issue');
            $('.zh-pipeline').each(function() {
                var $pipe = $(this);
                console.log('pipe', $pipe);
                processPipeline($pipe.get());
            });
        }
    });
})();
