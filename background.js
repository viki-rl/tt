let taskArray = [];

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === "taskAdded") {
    taskArray.push(request.task);
    chrome.storage.sync.set({ taskArray: taskArray }, () => {
      sendResponse({ status: "Task added successfully" });
    });
  } else if (request.message === "taskRemoved") {
    taskArray = taskArray.filter(task => task !== request.task);
    chrome.storage.sync.set({ taskArray: taskArray }, () => {
      sendResponse({ status: "Task removed successfully" });
    });
  } else if (request.message === "taskCompleted") {
    let index = taskArray.indexOf(request.task);
    if (index !== -1) {
      taskArray.splice(index, 1);
      chrome.storage.sync.set({ taskArray: taskArray }, () => {
        sendResponse({ status: "Task marked as completed" });
      });
    }
  }
  return true;
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get("taskArray", (result) => {
    if (chrome.runtime.lastError) {
      console.log(chrome.runtime.lastError);
    } else {
      taskArray = result.taskArray || [];
    }
  });
});