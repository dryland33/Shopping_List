/* eslint-disable quotes */
/* eslint-disable no-console */
/* eslint-disable no-undef */
/* eslint-disable strict */

// `STORE` is responsible for storing the underlying data
// that our app needs to keep track of in order to work.
//
// for a shopping list, our data model is pretty simple.
// we just have an array of shopping list items. each one
// is an object with a `name` and a `checked` property that
// indicates if it's checked off or not.
// we're pre-adding items to the shopping list so there's
// something to see when the page first loads.
const SL = {
  store: {
    items:
      [
        {id: cuid(), name: "apples", checked: false},
        {id: cuid(), name: "oranges", checked: false},
        {id: cuid(), name: "milk", checked: true},
        {id: cuid(), name: "bread", checked: false}
      ]
  },

  //For each item in STORE, generate a string representing an <li> with:  
  //the item name rendered as inner text
  //the item's index in the STORE set as a data attribute on the <li>
  //the item's checked state (true or false) rendered as
  //the presence or absence of a CSS class for indicating checked items 
  //(specifically, .shopping-item__checked from index.css)
  //Join together the individual item strings into one long string
  //Insert the <li>s string inside the .js-shopping-list <ul> in the DOM.

  generateItemElement: function (item, itemIndex, template) {
    return `
    <li data-item-id="${item.id}">
      <span class="shopping-item js-shopping-item ${item.checked ? "shopping-item__checked" : ''}">${item.name}</span>
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
            <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
            <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
  },

  generateShoppingListItemsString: function (shoppingList) {
    console.log("generating shopping list elements");

    const items = shoppingList.map((item) => SL.generateItemElement(item));
  
    return items.join("");
    /*
    return `
        <li>almonds</li>
        <li>chocolate</li>
        <li>figs</li>
        <li>pork roast</li>`;
    */
  },

  renderShoppingList: function () {
    console.log('`renderShoppingList` ran');
    //generate HTML
    const shoppingListItemString = SL.generateShoppingListItemsString(SL.store.items);
    //insert HTML into DOM
    $('.shopping-list').html(shoppingListItemString);
  },

  addItemToShoppingList: function(itemName) {
    console.log(`Adding "${itemName}" to shopping list`);
    SL.store.items.push({id: cuid(), name: itemName, checked: false});
  },

  handleNewItemSubmit: function () {
    // this function will be responsible for when users add a new shopping list item
    $('#js-shopping-list-form').submit(function(event) {
      event.preventDefault();
      console.log('`handleNewItemSubmit` ran');
      const newItemName = $('.js-shopping-list-entry').val();
      $('.js-shopping-list-entry').val('');
      SL.addItemToShoppingList(newItemName);
      SL.renderShoppingList();
    });
  },

  handleItemCheckClicked: function () {
    // this function will be responsible for when users click the "check" button on
    // a shopping list item.
    console.log('`handleItemCheckClicked` ran');
    $('.js-shopping-list').on('click', `.js-item-toggle`, event => {
      const id = SL.getItemIdFromElement(event.currentTarget);
      SL.toggleCheckedForListItem(id);
      SL.renderShoppingList();
    });
  },

  getItemIdFromElement: function(item) {
    return $(item)
      .closest('li')
      .data('item-id');
  },

  toggleCheckedForListItem: function(itemId) {
    console.log("Toggling checked property for item with id " + itemId);
    const item = SL.store.items.find(item => item.id === itemId);
    item.checked = !item.checked;
  },

  deleteItem: function(itemId) {
    console.log(`Deleting item with id  ${itemId} from shopping list`);

    // as with `addItemToShoppingLIst`, this function also has the side effect of
    // mutating the items array
    
    // First we find the index of the item with the specified id using the native
    // Array.prototype.findIndex() method.
    const itemIndex = SL.store.items.findIndex(item => item.id === itemId);

    // Then we call `.splice` at the index of 
    // the list item we want to remove, with a removeCount of 1.
    SL.store.items.splice(itemIndex, 1);

    console.log('`deleteItem` ran');
  },

  handleDeleteItemClicked: function () {
    // this function will be responsible for 
    // when users want to delete a shopping list item
    
    //listen for a click on the delete button
    $('.js-shopping-list').on('click', `.js-item-delete`, event => {
      //get the id for the item to be deleted
      const id = SL.getItemIdFromElement(event.currentTarget);
      //remove the item from the model
      SL.deleteItem(id);
      //re-render the page
      SL.renderShoppingList();
    });
    console.log('`handleDeleteItemClicked` ran');
  }
};

// this function will be our callback when the page loads. it's responsible for
// initially rendering the shopping list, and activating our individual functions
// that handle new item submission and user clicks on the "check" and "delete" buttons
// for individual shopping list items.
function handleShoppingList() {
  SL.renderShoppingList();
  SL.handleNewItemSubmit();
  SL.handleItemCheckClicked();
  SL.handleDeleteItemClicked();
}

// when the page loads, call `handleShoppingList`
$(handleShoppingList);