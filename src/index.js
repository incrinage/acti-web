function TextInput() {
    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.placeholder = "enter acti name";
    this.input.name = "action";
}

function SaveButton({ name, onClick, className }) {
    this.button = document.createElement("button");
    this.button.innerText = name;
    this.button.className = className ? className : "";
    this.button.name = name ? name : "";
    this.button.onclick = onClick;
}

function DeleteButton({ name, onClick, className }) {
    this.button = document.createElement("div");
    const btn = document.createElement("button");
    btn.innerText = "Remove";
    btn.onclick = onClick;
    btn.name = name;
    this.button.className = className;
    this.button.appendChild(btn);
}

function ListItemForm({ save, clear }) {
    this.form = document.createElement("form");
    this.form.appendChild(new TextInput().input);

    let saveButton = new SaveButton({ name: "save", onClick: save });
    this.form.appendChild(saveButton.button);

    let deleteBtn = new DeleteButton({ name: "delete", onClick: clear }).button;
    this.form.append(deleteBtn);
}

function ActionItem({ listItem, id, name, remove }) {
    this.id = id;
    this.listItem = listItem;
    this.action = document.createElement('div');

    //component
    this.name = document.createElement('div');
    const nameTag = document.createElement('p');
    nameTag.innerText = name;
    this.name.appendChild(nameTag);
    this.name.className = "list-content";

    this.action.appendChild(this.name);
    this.onClick = function () {
        remove(id, listItem);
    }
    this.onClick = this.onClick.bind(this);
    this.deleteBtn = new DeleteButton({ name: "Delete", onClick: this.onClick, className: "list-content" }).button;

    this.action.appendChild(this.deleteBtn);

}


function List() {
    this.ul = document.createElement('ul');
    this.ul.className = "list";
    //states
    let modifying = false;
    let isSaving = false;
    //selected items
    let currInput = undefined;
    this.currListItem = undefined;



    this.save = (submitEvent) => {
        submitEvent.preventDefault();

        if (this.saving) return;
        if (!this.currInput.form.elements.action.value) return;
        this.isSaving = true;

        return timeoutPromise(1000)
            .then(() => ({ ok: true, response: { id: 1, name: 'meow' } }))
            .then(({ ok, response }) => {
                console.log(ok);

                //get input value and delete form
                const { id, name } = response;
                this.currInput.form.remove();
                const props = { listItem: this.currListItem, id, name, remove: this.remove };
                this.currListItem.appendChild(new ActionItem(props).action);
                //clear this.li, no longer modifying 
                this.currListItem = undefined;
                this.modifying = false;
            })
            .catch((e) => {
                //where to display errors?
                console.log(e);
            })
            .finally(() => {
                this.isSaving = false;
            })

    };

    const timeoutPromise = (t) => new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('woo');
            resolve()
        }, t)
    });

    this.clearForm = (e) => {
        e.preventDefault();
        if (!this.currListItem || this.isSaving) return;
        this.modifying = false;
        this.currListItem.remove();
    };


    //creates ListItemForm and appends it to List
    this.add = function () {
        if (this.modifying) return;
        //create input item & set as  curr input
        this.modifying = true;
        this.currInput = new ListItemForm({ save: this.save, clear: this.clearForm });

        //append input item to an <li>
        this.currListItem = document.createElement("li");
        this.currListItem.appendChild(this.currInput.form);
        //append <li> to <ul>
        this.ul.appendChild(this.currListItem);
    }

    this.remove = function (id, listItem) {
        this.modifying = true;
        //get id 
        return Promise.resolve()
            .then(() => ({ ok: true }))
            .then(({ ok }) => {
                listItem.remove();
                console.log('deleted', ok, id);
            })
            .catch((e) => {
                console.error('error deleting', e)
            })
            .finally(() => {
                this.modifying = false;
            })
    }

    this.save = this.save.bind(this);
    this.add = this.add.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.remove = this.remove.bind(this);


    const dummyItems = [{ id: 1, name: "act1" }, { id: 2, name: "act2" }, { id: 3, name: "act3" }];
    dummyItems.forEach((acti) => {
        const li = document.createElement('li');
        const props = { listItem: li, id: acti.id, name: acti.name, remove: this.remove };
        const action = new ActionItem(props).action;
        li.appendChild(action);
        this.ul.appendChild(li);
    }, this);
}



function Home() {
    this.list = new List();
    this.headerDiv = document.getElementById("header");
    this.contentDiv = document.getElementById("content");
    this.contentDiv.appendChild(new SaveButton({name:"Add", onClick: this.list.add }).button);
    this.contentDiv.appendChild(this.list.ul);
}


new Home();
