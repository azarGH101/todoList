// GLOBAL DECLERATION
const localStorageName = 'taskList';

const wrapper = document.querySelector('.wrapper');
const input = document.getElementById("search");
const addTaskBtn  = document.getElementById("addTask");
const result = document.getElementById("result");

const taskAddMsg = 'Task added Successfully';
const taskRemMsg = 'Task removed Successfully';
const taskCompMsg = 'Task Completed Successfully';

const finishedTasks = document.getElementById("finished");
const totalTasks = document.getElementById("totalTasks");
const lineAnimate = document.querySelector(".line");

let finishedTask = 0;
let non_FinishedTask = 0;
let totalTasksList = 0;

let temp = JSON.parse(localStorage.getItem(localStorageName)) || [];

// MAIN FUNCTION
function main() {
    // if(input.value === '') {
    //     addTaskBtn.disabled = true;
    //     addTaskBtn.cursor = 'not-allowed';
    // }
    // else {
    //     addTaskBtn.disabled = false;
    // }
    if(temp.length!==0) {
        temp.forEach((val)=>{
            createTaskElement(val);
        }) ;
    }
    finishedTasks.innerHTML = finishedTask;
    totalTasksList = finishedTask+non_FinishedTask;
    totalTasks.innerHTML = totalTasksList;

    finishTasksAnimation(totalTasksList,finishedTask);

    // EDIT TASK NAME
    const editBtns = document.querySelectorAll('.edit');

    for(let i=0;i<editBtns.length;i++) {
        editBtns[i].addEventListener("click",()=>editTaskName(i));
    };
    
    // REMOVE STRIKE THROUGHED TASKS
    const deleteBtns = document.querySelectorAll('.delete');

    for(let i=0;i<deleteBtns.length;i++) {
        deleteBtns[i].addEventListener("click",()=>{
            totalTasksList--;
            totalTasks.innerHTML = totalTasksList;
            finishedTask--;
            finishedTasks.innerHTML = finishedTask;
            removeTask(i);
            finishTasksAnimation(totalTasksList,finishedTask);
            pageReload();
            // const taskLineArr = document.querySelectorAll('.taskLine');
            // console.log(taskLineArr);
        });
    };

    // STRIKE THROUGH FINISHED TASKS
    const radioBtns = document.querySelectorAll('.radioBtn');
    const delBtns = document.querySelectorAll('.delete');

    for(let i=0;i<radioBtns.length;i++) {
        radioBtns[i].addEventListener("click",()=>{
            finishedTask++;
            finishedTasks.innerHTML = finishedTask;
            console.log(finishedTask);
            strikeTaskAnimation();
            // finishTasksAnimation(totalTasksList,finishedTask);
            strikeThrough(i);
            pageReload();
        });
    };
}

function strikeTaskAnimation() {
    const animateLines = document.querySelectorAll('.taskLine');
    console.log(animateLines);
    for(let i=0;i<totalTasksList;i++) {
    if(!animateLines[i].classList.contains('tl-Animation')) {
            animateLines[i].classList.add('tl-Animation');
            break;
        }
    };   
}

function finishTasksAnimation(total,finish) {
    const taskLineArr = document.querySelectorAll('.taskLine');
    // console.log(taskLineArr);
    if(taskLineArr.length!==0) {
        taskLineArr.forEach((element)=>{
            element.remove();
        });
    }
    for(let i=0;i<total;i++) {
        // CREATE TASK FINISHED ANIMATION LINE
        const taskLinesss = document.createElement('div');
        taskLinesss.classList.add('taskLine');
        taskLinesss.style.width = `${100/totalTasksList}%`;        
        if(finish>0) {
            taskLinesss.classList.add('tl-Animation'); 
            finish--;
        }
        lineAnimate.appendChild(taskLinesss);
    }
}

// EDILT TASK NAME 
function editTaskName(pos) {
    const label = document.querySelectorAll('.taskName');
    input.value=label[pos].textContent;
    const parentDiv = document.querySelectorAll('.taskDataDiv');
    parentDiv[pos].remove();
    temp.splice(pos,1);
}
// REMOVE TASK FROM LOCAL STORAGE
function removeTask(pos) {
    temp.splice(pos,1);
    localStorage.setItem(localStorageName,JSON.stringify(temp)); 
    result.style.color = 'red';
    result.innerHTML = taskRemMsg;
    const parentDiv = document.querySelectorAll('.taskDataDiv');
    parentDiv[pos].remove();
}


// STRIKE THROUGH TASK
function strikeThrough(pos) {
    const label = document.querySelectorAll('.taskName');
    const editBtns = document.querySelectorAll('.edit');
    const delBtns = document.querySelectorAll('.delete');
    
    label[pos].style.textDecoration = 'line-through';
    // EDIT BUTTON CHANGE
    editBtns[pos].disabled = true;
    editBtns[pos].style.cursor = 'not-allowed';
    editBtns[pos].style.backgroundColor = 'grey';
    // DELETE BUTTON CHANGED
    delBtns[pos].disabled = false;
    delBtns[pos].style.cursor = 'pointer';
    delBtns[pos].style.backgroundColor = 'rgb(245, 188, 118)';

    result.style.color = 'blue';
    result.innerHTML = taskCompMsg;
    
    changeStatus(pos);
}

function pageReload() {
    setTimeout(function() {
        location.reload();
      }, 1000); // 2000 milliseconds = 2 seconds      
}

// CHANGE STATUS OF COMPLETED TASK IN LOCAL STORAGE
function changeStatus(pos) {
    temp[pos].status='Complete';
    console.log(temp);
    localStorage.setItem(localStorageName,JSON.stringify(temp));
}

// ADD TASK TO LOCAL STORAGE 
addTaskBtn.addEventListener("click",()=>{
    const task = input.value;
    if(task!=='') {
        result.innerHTML = taskAddMsg;
        input.value='';

        // ADD TASK TO LOCAL STORAGE
        let tempObj = {value:task,status:'Non-Complete'};
        temp.push(tempObj);
        localStorage.setItem(localStorageName,JSON.stringify(temp));
        console.log('Finished Task = ',finishedTask);
        totalTasksList = JSON.parse(localStorage.getItem(localStorageName)).length;
        createTaskElement(tempObj);
        
        finishTasksAnimation(totalTasksList,finishedTask);
        totalTasks.innerHTML = totalTasksList;        
        console.log('Total Task = ',totalTasksList);
        pageReload();
    }
    else {
        result.innerHTML = 'Please Enter a Value';
    }
});


// CREATE A TASK ELEMENT (GUI) FOR EVERY TASK
function createTaskElement(obj) {
    const divElement = document.createElement('div');
    divElement.classList.add('taskDataDiv');
    divElement.classList.add('radio-group');
    wrapper.appendChild(divElement);

    const labelElement = document.createElement('label');
    labelElement.classList.add('taskName');
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'task';
    radio.value = obj.value;
    radio.classList.add('radioBtn');
    
    labelElement.textContent = obj.value;

    // PREPAND RADIO WITH LABEL
    labelElement.prepend(radio);

    divElement.appendChild(labelElement);

    // EDIT BUTTON CREATED
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit');
    const editIcon = document.createElement("img");
    editIcon.src = "./images/edit.png";
    editIcon.alt = 'edit';
    editBtn.appendChild(editIcon);

    // TRASH BUTTON CREATED
    const trashBtn = document.createElement('button');
    trashBtn.classList.add('delete');
    const trashIcon = document.createElement("img");
    trashIcon.src = "./images/delete.png";
    trashIcon.alt = 'trash';
    trashBtn.appendChild(trashIcon);

    if(obj.status==='Complete') {
        labelElement.style.textDecoration = 'line-through';
        labelElement.style.cursor = 'not-allowed';
        radio.disabled = 'true';
        radio.style.cursor = 'not-allowed';
        editBtn.disabled = true;
        editBtn.style.cursor = 'not-allowed';
        editBtn.style.backgroundColor = 'grey';
        finishedTask++;
    }
    else {
        trashBtn.disabled = true;
        trashBtn.style.cursor = 'not-allowed';
        trashBtn.style.backgroundColor = 'grey';
        non_FinishedTask++;
    }

    // trashBtn.value = iframe;
    divElement.appendChild(editBtn);
    divElement.appendChild(trashBtn);
}

main();
