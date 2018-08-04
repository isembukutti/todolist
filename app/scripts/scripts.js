'use strict';
$(() => {
    // Get all to-dos on page load
    getAllTodos();

    // Add a new to-do
    $("#todo").submit((e) => {
        e.preventDefault();

        // Clear errors
        $("#todoError").html(``);

        // Get the user input
        const newItem = $("#inputItem").val();

        // If the input is not empty upon submission 
        if (newItem) {
            $.ajax({
                url: 'http://quip-todos.herokuapp.com/add_todo',
                type: 'POST',
                contentType: 'application/x-www-form-urlencoded',
                dataType: 'json',
                data: {
                    email: 'imasha.sem@gmail.com',
                    text: newItem // Pass the user input
                },
                success: (data) => {
                    // Add the new item to top of the to-do list and avoid calling getAllTodos function everytime a new item is added
                    $("#todoList").prepend(`<li id="${$('#todoList li').length}"><span>${newItem}</span></li>`);

                    // Clear the input field 
                    $("#inputItem").val(``);
                },
                error: (jqXhr, textStatus, errorThrown) => {
                    console.log(`ERROR: ${errorThrown}`);

                    // Show error message
                    $("#todoError").html(`Error creating task. Please try again.`);
                }
            });
        }
    });

    // Mark complete or incomplete
    $("#todoList").on("click", "li", (e) => {
        // Clear errors
        $("#todoError").html(``);

        // The clicked item
        const listItem = $(e.target).closest("li");

        $.ajax({
            url: 'http://quip-todos.herokuapp.com/mark_completed',
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            dataType: 'json',
            data: {
                email: 'imasha.sem@gmail.com',
                id: listItem.attr('id'),
                // If the current item is not completed, send "true" to mark it complete in the server
                // If the current item is completed, send "false" to mark it umcomplete in the server
                completed: !listItem.hasClass("completed")
            },
            success: (data) => {
                // Toggle "completed" class of the current item 
                listItem.toggleClass("completed");
            },
            error: (jqXhr, textStatus, errorThrown) => {
                console.log(`ERROR: ${errorThrown}`);

                // Show error message
                $("#todoError").html(`Error updating to-do item. Please try again.`);
            }
        });
    });

});

// Get all to-dos on page load
let getAllTodos = () => {

    // Clear errors
    $("#todoError").html(``);

    $.ajax({
        url: 'http://quip-todos.herokuapp.com/get_todos?email=imasha.sem@gmail.com',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            // Iterate through the response array and compose the HTML list items
            const list = data.map(item => {
                // If the items is completed, set class variable to "completed" 
                let setClass = item.completed ? "completed" : "";

                // HTML for the list item including the id, class and item text
                return `<li id="${item.id}" class="${setClass}"><span>${item.text}</span></li>`;
            });

            // Show the list in the DOM in reverse such that the latest item is on top
            $("#todoList").html(list.reverse());
        },
        error: (jqXhr, textStatus, errorThrown) => {
            console.log(`ERROR: ${errorThrown}`);

            // Show error message
            $("#todoError").html(`Error loading to-do items. Please try again.`);
        }
    });
}

// Reset all to-dos (this function is not being called but can be run in the console to reset the to-dos)
let initialTodos = () => {

    // Clear errors
    $("#todoError").html(``);

    $.ajax({
        url: 'http://quip-todos.herokuapp.com/reset',
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            email: 'imasha.sem@gmail.com',
        },
        success: (data) => {
            // Once the items are reset, refresh the to-do list in the DOM
            getAllTodos();
        },
        error: (jqXhr, textStatus, errorThrown) => {
            console.log(`ERROR: ${errorThrown}`);

            // Show error message
            $("#todoError").html(`Error reseting to-do items. Please try again.`);
        }
    });
}