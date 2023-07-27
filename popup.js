document.addEventListener('DOMContentLoaded', function() {
    var taskArray = [];

    document.getElementById('addButton').addEventListener('click', function() {
        var taskInput = document.getElementById('taskInput').value;
        if(taskInput) {
            taskArray.push(taskInput);
            chrome.runtime.sendMessage({message: 'taskAdded', task: taskInput});
            document.getElementById('taskInput').value = '';
            displayTasks();
        }
    });

    document.getElementById('taskList').addEventListener('click', function(e) {
        if(e.target && e.target.nodeName == 'LI') {
            var completedTask = e.target.innerText;
            taskArray = taskArray.filter(task => task !== completedTask);
            chrome.runtime.sendMessage({message: 'taskCompleted', task: completedTask});
            displayTasks();
        }
    });

    function displayTasks() {
        var taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        for(var i = 0; i < taskArray.length; i++) {
            var li = document.createElement('li');
            li.innerText = taskArray[i];
            taskList.appendChild(li);
        }
    }

    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
        if(request.message === 'taskAdded' || request.message === 'taskCompleted') {
            taskArray = request.taskArray;
            displayTasks();
        }
    });
});