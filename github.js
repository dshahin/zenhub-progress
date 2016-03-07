(function(){
"use strict";
//document.body.style.background = 'yellow';

$(document).on('DOMNodeInserted',function(e){
    var $pipeline = $(e.target);
    //console.log(e.target);
    if($pipeline.hasClass('zh-pipeline')){
        //console.log('inserted issue pipeline',$pipeline);
        var $wrapper = $pipeline.children('div.zh-pipeline-issues-wrapper');
        // console.log('wrapper', $wrapper);
        var $issues = $wrapper.children('ul.zh-pipeline-issues')
            .each(function(){
                var $issueList = $(this);
                $issueList.children('li.zh-pipeline-issue')
                    .each(function(){
                        var $issue = $(this),
                            $card = $issue.children('div.zh-issuecard-container');
                            // $main = $card.children('div.zh-issuecard-main');
                            // $meta = $card.children('div.zh-issuecard-meta');

                            var max = 10,
                                min = 0,
                                totalTasks = Math.floor(Math.random() * (max - min + 1) + min),
                                completeTasks = Math.floor(Math.random() * (totalTasks - min + 1) + min);

                            var percentage = ((completeTasks /totalTasks ) * 100).toFixed(0);

                            var $progress = $('<div/>').addClass('zh-issue-progress').addClass('orange');
                            var $meter = $('<div/>').addClass('meter');

                            $card.append($progress);

                            if(totalTasks > 0){
                                $progress.append($meter);
                            }

                            var spanNumber = $('<label/>').html(completeTasks + '/' +totalTasks +' ('+percentage +'%)');
                            var span = $('<span/>')
                                .addClass('zh-issue-progress')
                                .css({ width: percentage + '%'});
                                //.html(completeTasks + '/' +totalTasks);
                            if(totalTasks > 0){
                                $progress.append(spanNumber);
                            }

                            if(totalTasks > 0){
                                $meter.append(span);
                            }



                    });
            });
    }
});
})();