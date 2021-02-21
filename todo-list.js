function handleWhenChecked(e){
    let ul = document.getElementById("myUL");
      for (let i = 1; i < ul.childNodes.length; i++) {
        let li = ul.childNodes[i];
        if (li.checked==true){
          switch(e.textContent){
            case "show all done":
              li.style.display = "";
              break;
            case "hide all done":
              li.style.display = "none";
              break;
            case "delete all done":
              li.remove();
              i--;
          }
        }
      }
  }
  
  function sort(){
    let ul = document.getElementById("myUL");
    let todoList = Array.from(ul.childNodes);
    todoList.sort((a,b) => {
      if (a.textValue<b.textValue) return -1
      else if (a.textValue>b.textValue) return 1
      return 0
    });
    todoList.forEach((todo) => {
      ul.appendChild(todo); 
    });
  }
  
  function createCheckBox(newLi){
    let cbox = document.createElement("INPUT");
    cbox.setAttribute("type", "checkbox");
    cbox.addEventListener('click', () =>{
      newLi.checked= true;
      newLi.classList.toggle('checked');
    });
    cbox.classList.add("checkbox");
    return cbox;
  }
  
  
  function createDeleteButton(newLi){
    let btn = document.createElement("BUTTON");
    btn.innerHTML = "<i class='fa fa-trash'>";  
    btn.classList.add('delete');
    btn.addEventListener('click', () =>{
      newLi.remove();
    });
    return btn
  }
  
  function combineElements(...elements){
    let container = document.createElement("DIV");
    container.classList.add("left-side-of-to-do");
    for (let elem of elements){
      container.appendChild(elem);
    }
    return container;
  }
  
  function createTextElement(){
    let inputValue = document.getElementById("textToAdd").value;
    if (inputValue === '') {
      return null;
    } 
    let para = document.createElement("p");
    para.innerHTML = inputValue;
    return para;
  }
  
  document.getElementById("textToAdd").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
     event.preventDefault();
     newElement();
    }
  });
  
  function newElement() {
    let newLi = document.createElement("li");
    newLi.classList.add('task');
    let todoText = createTextElement(newLi);
    if (todoText===null){
        alert("no to do task added");
        return;
    }
    let btn = createDeleteButton(newLi);
    let cbox = createCheckBox(newLi);
    newLi.textValue = todoText.innerText;
    let container = combineElements(cbox,todoText);
    newLi.appendChild(container);
    newLi.appendChild(btn);
    document.getElementById("myUL").appendChild(newLi);
    document.getElementById("textToAdd").value= "";
  }