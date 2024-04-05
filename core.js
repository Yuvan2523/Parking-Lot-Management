//Entry Class: Represent each entry in the parking lot
class Entry{
    constructor(name,vehiclename,licenseplate,entryDate,exitDate){
        this.name = name;
        this.vehiclename = vehiclename;
        this.licenseplate = licenseplate;
        this.entryDate = entryDate;
        this.exitDate = exitDate;
    }
}
//UI Class: Handle User Interface Tasks
class UI{
    static displayEntries(){
   
        const entries = Store.getEntries();
        entries.forEach((entry) => UI.addEntryToTable(entry));
    }
    static addEntryToTable(entry){
        const tableBody=document.querySelector('#tableBody');
        const row = document.createElement('tr');
        row.innerHTML = `   <td>${entry.name}</td>
                            <td>${entry.vehiclename}</td>
                            <td>${entry.licenseplate}</td>
                            <td>${entry.entryDate}</td>
                            <td>${entry.exitDate}</td>
                            <td><button class="btn btn-danger delete">X</button></td>
                        `;
        tableBody.appendChild(row);
    }
    static clearInput(){
        //Selects all the inputs
        const inputs = document.querySelectorAll('.form-control');
        //Clear the content of each input
        inputs.forEach((input)=>input.value="");
    }
    static deleteEntry(target){
        if(target.classList.contains('delete')){
            target.parentElement.parentElement.remove();
        }
    }
    static showAlert(message,className){
        const div = document.createElement('div');
        div.className=`alert alert-${className} w-50 mx-auto`;
        div.appendChild(document.createTextNode(message));
        const formContainer = document.querySelector('.form-container');
        const form = document.querySelector('#entryForm');
        formContainer.insertBefore(div,form);
        setTimeout(() => document.querySelector('.alert').remove(),3000);
    }
    static validateInputs(){
        const name = document.querySelector('#name').value;
        const vehiclename = document.querySelector('#vehiclename').value;
        const licenseplate = document.querySelector('#licenseplate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        var licenseplateRegex = /^(?:[A-Z]{2} \d{2} [A-Z]{2} \d{4})$/;
        if(name === '' || vehiclename === '' || licenseplate === '' || entryDate === '' || exitDate === ''){
            UI.showAlert('All fields must me filled!','danger');
            return false;
        }
        if(exitDate < entryDate){
            UI.showAlert('Exit Date cannot be lower than Entry Date','danger');
            return false;
        }
        if(!licenseplateRegex.test(licenseplate)){
            UI.showAlert('License Plate must be like LL NN LL NNNN','danger');
            return false;
        }
        return true;
    }
}
//Store Class: Handle Local Storage
class Store{
    static getEntries(){
        let entries;
        if(localStorage.getItem('entries') === null){
            entries = [];
        }
        else{
            entries = JSON.parse(localStorage.getItem('entries'));
        }
        return entries;
    }
    static addEntries(entry){
        const entries = Store.getEntries();
        entries.push(entry);
        localStorage.setItem('entries', JSON.stringify(entries));
    }
    static removeEntries(licenseplate){
        const entries = Store.getEntries();
        entries.forEach((entry,index) => {
            if(entry.licenseplate === licenseplate){
                entries.splice(index, 1);
            }
        });
        localStorage.setItem('entries', JSON.stringify(entries));
    }
}
//Event Display
    document.addEventListener('DOMContentLoaded',UI.displayEntries);
//Event Add
    document.querySelector('#entryForm').addEventListener('submit',(e)=>{
        e.preventDefault();
        
        //Declare Variables
        const name = document.querySelector('#name').value;
        const vehiclename = document.querySelector('#vehiclename').value;
        const licenseplate = document.querySelector('#licenseplate').value;
        const entryDate = document.querySelector('#entryDate').value;
        const exitDate = document.querySelector('#exitDate').value;
        if(!UI.validateInputs()){
            return;
        }
        //Instatiate Entry
        const entry = new Entry(name, vehiclename, licenseplate, entryDate, exitDate);
        //Add the entry do de UI table
        UI.addEntryToTable(entry);
        Store.addEntries(entry);
        //Delete content of input's
        UI.clearInput();

        UI.showAlert('Vehicle successfully added to the parking lot','success');

    });
//Event Remove
    document.querySelector('#tableBody').addEventListener('click',(e)=>{
        //Call to UI function that removes entry from the table
        UI.deleteEntry(e.target);
        //Get license plate to use as unique element of an entry
        var licenseplate = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
        //Call to Store function to remove entry from the local storage
        Store.removeEntries(licenseplate);
        //Show alert that entry was removed
        UI.showAlert('Vehicle successfully removed from the parking lot list','success');
    })

//Event Search
    document.querySelector('#searchInput').addEventListener('keyup', function searchTable(){
        //Get value of the input search
        const searchValue = document.querySelector('#searchInput').value.toUpperCase();
        //Get all lines of table body
        const tableLine = (document.querySelector('#tableBody')).querySelectorAll('tr');
        //for loop #1 (used to pass all the lines)
        for(let i = 0; i < tableLine.length; i++){
            var count = 0;
            //Get all collumns of each line
            const lineValues = tableLine[i].querySelectorAll('td');
            //for loop #2 (used to pass all the collumns)
            for(let j = 0; j < lineValues.length - 1; j++){
                //Check if any collumn of the line starts with the input search string
                if((lineValues[j].innerHTML.toUpperCase()).startsWith(searchValue)){
                    count++;
                }
            }
            if(count > 0){
                //If any collumn contains the search value the display block
                tableLine[i].style.display = '';
            }else{
                //Else display none 
                tableLine[i].style.display = 'none';
            }
        }
    });