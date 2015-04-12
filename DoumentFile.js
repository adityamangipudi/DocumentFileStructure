
var count=0;
//Object Constructor for DataFolder
function DataFolder() {
    this.id='',
    this.isRendered=false,
    this.childrenIds = [],
    {
        get childrenIds(){
            return this.childrenIds;
        },
        set childrenIds(childId){
            this.childrenIds.push(childId);
        },get isRendered(){
            return this.isRendered;
        }

    }
}
//gets unique id for each folder
DataFolder.prototype.addFolderId = function (folder) {
    this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

//Object Constructor for DataDocument
function DataDocument(){
    this.id = '',
    this.isRendered=false

};

//
DataDocument.prototype.addDocumentId = function (document) {
    this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};
//global object --acts like root folder keeps track of all items created
var obj={};





//DOM Content Loaded
document.addEventListener('DOMContentLoaded', function(){

    //the 2 different lists, ulcm - context menu ulfd- is the file document structure
    var ulcm = document.querySelector('ul.contextmenu');
    var ulfd = document.querySelector('ul.filedoc-list');
    //right click menu function to prevent default and show the other menu by adding class
    function fn(event){

        //if the click was on a previously created folder
        if(event.target.classList.contains('folder')){
           // console.log(event.target.classList)
            if(event.clientX)
                event.preventDefault();

            ulcm.style.top = event.clientY+'px';
            ulcm.style.left = event.clientX+'px';
            ulcm.className='contextmenu classBlock '+ event.target.classList;
           // console.log(ulcm.classList);

        }
        //if the click was anywhere else
        else{
            if(event.clientX)
                event.preventDefault();

            ulcm.style.top = event.clientY+'px';
            ulcm.style.left = event.clientX+'px';
            ulcm.className='contextmenu classBlock';
            // ul.style.visibility='visible';
        }



    }


    //listener for right click menu on file-structure div
    var fsdiv= document.querySelector('div.file-structure');
    fsdiv.addEventListener('contextmenu', fn,false);
    //click listenter for the meny
    function fsdivClick(event) {
        if(event.target){
            //
            //console.log(event.target.id);
          //  console.log(event.target.id,event.target.parentNode.classList)
            //adds child object to the root obj
            addToObj(event.target.id, event.target.parentNode.classList);


        }
        ulcm.className='contextmenu';


    }
    //click on left side of div (file structure)
    fsdiv.addEventListener('click', fsdivClick);



    //adds Data Folder or Data Document to the list
    function addToObj(id, classList) {

       // console.log(id, classList);
        //if it was not on a folder
        if(!classList.contains('fs')){
            var dataObj=null;
            if(id ==='newdoc'){
                dataObj =new DataDocument();
                dataObj.addDocumentId();


            }
            if(id ==='newfolder'){
                dataObj=new DataFolder();
                dataObj.addFolderId();

            }



            //console.log(Object.getPrototypeOf(dataObj));
            //add  to obj and render elements
            obj['item' + count] = dataObj;
            count++;
            //console.log(obj);
            obj =renderElements(obj);



        }

        //if it was on a folder
        else{
            var dataObj=null;
            if(id ==='newdoc'){
                dataObj =new DataDocument();
                dataObj.addDocumentId();


            }
            if(id ==='newfolder'){
                dataObj=new DataFolder();
                dataObj.addFolderId();

            }



           // console.log(classList.item(classList.length-1));
            //add to obj and render all emlements
            obj['item' + count] = dataObj;
            obj[classList.item(classList.length-1)].childrenIds.push('item'+count);
            count++;
           // console.log(obj[classList.item(classList.length-1)].childrenIds);
            obj = renderElements(obj);

        }



    }

    //renders the elements bassed on file list and obj values
    function renderElements(obj){

        //select the list of folders and documents
        var ulfd = document.querySelector('ul.filedoc-list');


        //remove all child elements
        while(document.querySelector('li.fs') ){
            ulfd.removeChild(document.querySelector('li.fs'));
        }


        //for all objects set them to unrenderesd
        for(var prop in obj){
            if(obj[prop]){
                obj[prop].isRendered=false;

            }
        }

        //for each item in the object
        for(var prop in obj){
            //check if type document
            if(DataDocument.prototype.isPrototypeOf(obj[prop])){

                //check if it has been rendered already
                if(obj[prop].isRendered===false){

                    //create element and set rendered to true
                    createElement('li', ulfd, 'fs document ' +prop, obj[prop].id||'', 'Document');
                    obj[prop].isRendered=true;
                }


            }

            //check if folder type
            if(DataFolder.prototype.isPrototypeOf(obj[prop])){
                //check if its already rendered
                if(obj[prop].isRendered===false){
                    //create element
                    createElement('li', ulfd, 'fs folder '+ prop, obj[prop].id||'', 'Folder');
                    //check if it has children
                    obj[prop].childrenIds.length>0? obj=renderChildren(obj, obj[prop].childrenIds, 10) : '';
                    //set rendered to true
                    obj[prop].isRendered=true;
                }

            }

        }
        return obj;
    }


    function renderChildren(obj, childProps, margin){
        //console.log(childProps)
        //for all children in the the list
        for(var item in childProps){
            //console.log('in here', item)
            //if that item isnt null and hasnt been rendered already
            if(obj[childProps[item]]&&obj[childProps[item]].isRendered===false){
                //if its document type create the element with approproate padding
                if(DataDocument.prototype.isPrototypeOf(obj[childProps[item]])){
                    //create element, set padding and change rendered to true
                    var li = createElement('li', ulfd, 'fs document ' +childProps[item], obj[childProps[item]].id||'', 'Document');
                    li.style.marginLeft=margin+'%'
                    obj[childProps[item]].isRendered=true;
                }
                //if folder type create appropriate element
                if(DataFolder.prototype.isPrototypeOf(obj[childProps[item]])){
                    //create element set padding and check if there are more children and set rendered to true
                    var li =createElement('li', ulfd, 'fs folder '+ childProps[item], obj[childProps[item]].id||'', 'Folder');
                    li.style.marginLeft=margin+'%'
                    obj[childProps[item]].childrenIds.length>0? renderChildren(obj, obj[childProps[item]].childrenIds, margin+10) : '';
                    obj[childProps[item]].isRendered=true;
                }

            }
        }
        return obj;
    }
    //creates dom element
    function createElement(elementType, parent, className, id, innerHTML){
        var element = document.createElement(elementType);
        if(parent) parent.appendChild(element);
        if(className) element.className=className;
        if(id) element.id=id;
        if(innerHTML) element.innerHTML=innerHTML;
        return element;

    }


});


/**
 * Created by adityamangipudi1 on 4/10/15.
 */
