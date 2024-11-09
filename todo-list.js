// GLOBAL DECLERATION
const localStorageName = 'taskList';

const wrapper = document.querySelector('.wrapper');
const input = document.getElementById("search");
const addTaskBtn  = document.getElementById("addTask");
const result = document.getElementById("result");

const taskAddMsg = 'Task added Successfully';
const taskRemMsg = 'Task removed Successfully';
const taskCompMsg = 'Task Completed Successfully';

let temp = JSON.parse(localStorage.getItem(localStorageName)) || [];

// MAIN FUNCTION
function main() {
    // console.log(temp);
    if(temp.length!==0) {
        temp.forEach((val)=>{
            // console.log(val);
            createTaskElement(val);
        }) ;
    }
    // REMOVE STRIKE THROUGHED TASKS
    const deleteBtns = document.querySelectorAll('.delete');

    for(let i=0;i<deleteBtns.length;i++) {
        deleteBtns[i].addEventListener("click",()=>removeTask(i));
    };

    // STRIKE THROUGH FINISHED TASKS
    const radioBtns = document.querySelectorAll('.radioBtn');

    radioBtns.forEach((radio)=>{
        radio.addEventListener("click",()=>strikeThrough(radio));
    });
}

// REMOVE TASK FROM LOCAL STORAGE
function removeTask(pos) {
    // console.log('Before Delete : ', temp);
    temp.splice(pos,1);
    localStorage.setItem(localStorageName,JSON.stringify(temp)); 
    result.style.color = 'red';
    result.innerHTML = taskRemMsg;
    // console.log('After Delete : ', temp);
    const parentDiv = document.querySelectorAll('.taskDataDiv');
    parentDiv[pos].remove();
}

// STRIKE THROUGH TASK
function strikeThrough(selectedBtn) {
    const radioBtns = document.querySelectorAll('.radioBtn');
    for(let i=0;i<radioBtns.length;i++) {
        if(radioBtns[i]===selectedBtn) {
            const label = radioBtns[i].parentElement;
            label.style.textDecoration = 'line-through';
            result.style.color = 'blue';
            result.innerHTML = taskCompMsg;
            changeStatus(i);
            break;
        }
    }
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
    result.innerHTML = taskAddMsg;

    // ADD TASK TO LOCAL STORAGE
    let tempObj = {value:task,status:'Non-Complete'};
    temp.push(tempObj);
    localStorage.setItem(localStorageName,JSON.stringify(temp));
    createTaskElement(tempObj);
});


// CREATE A TASK ELEMENT (GUI) FOR EVERY TASK
function createTaskElement(obj) {
    const divElement = document.createElement('div');
    divElement.classList.add('taskDataDiv');
    divElement.classList.add('radio-group');
    wrapper.appendChild(divElement);

    const labelElement = document.createElement('label');
    labelElement.id = 'taskName';
    
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'task';
    radio.value = obj.value;
    radio.classList.add('radioBtn');
    
    labelElement.textContent = obj.value;

    // PREPAND RADIO WITH LABEL
    labelElement.prepend(radio);

    if(obj.status==='Complete') {
        labelElement.style.textDecoration = 'line-through';
        radio.disabled = 'true';
    }

    divElement.appendChild(labelElement);
    
    const trashBtn = document.createElement('button');
    trashBtn.classList.add('delete');
    const trashIcon = document.createElement("img");
    trashIcon.src = "./images/delete.png";
    trashIcon.alt = 'trash';

    trashBtn.appendChild(trashIcon);

    // trashBtn.value = iframe;
    divElement.appendChild(trashBtn);
}

main();
