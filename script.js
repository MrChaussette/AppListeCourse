// Ajoute un gestionnaire d'événement pour la touche 'Enter' lorsqu'on tape dans le champ 'new-item'
let input = document.getElementById("new-item");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("add-item").click(); // Simule le clic sur le bouton 'add-item'
    }
});

// Chargement initial des éléments depuis le localStorage lors du chargement de la page
window.onload = function() {
    loadItems();
};

// Fonction pour ajouter un élément à la liste
function addItem() {
    // Récupère la valeur du champ 'new-item'
    let newItem = document.getElementById("new-item").value;

    // Vérifie si le champ n'est pas vide
    if (newItem !== "") {
        let shoppingList = document.getElementById("shopping-list");

        // Crée un nouvel élément de liste
        let li = document.createElement("li");

        // Ajoute une checkbox à l'élément de liste
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = false;
        checkbox.classList.add("checkbox"); // Ajoute la classe 'checkbox'
        checkbox.addEventListener("change", function() {
            updateCheckboxState(li, checkbox.checked);
        });
        li.appendChild(checkbox);

        // Ajoute un span pour afficher le texte de l'élément
        let span = document.createElement("span");
        span.textContent = newItem;
        li.appendChild(span);

        
        // Ajoute un bouton pour diminuer la valeur
        let decreaseButton = document.createElement("button");
        decreaseButton.innerHTML = "-";
        decreaseButton.onclick = function() {
            decreaseValue(p, li);
        };
        li.appendChild(decreaseButton);
        
        // Ajoute un paragraphe pour afficher une valeur (dans cet exemple, toujours 1)
        let p = document.createElement("p");
        p.innerHTML = "1";
        li.appendChild(p);
        
        // Ajoute un bouton pour augmenter la valeur
        let increaseButton = document.createElement("button");
        increaseButton.innerHTML = "+";
        increaseButton.onclick = function() {
            increaseValue(p);
        };
        li.appendChild(increaseButton);

        // Ajoute un bouton de suppression avec la classe 'delete-item'
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "🗑️";
        deleteButton.classList.add("delete-item"); // Ajoute la classe 'delete-item'
        deleteButton.onclick = function() {
            deleteItem(li);
        };
        li.appendChild(deleteButton);

        // Ajoute l'élément à la liste
        shoppingList.appendChild(li);
        document.getElementById("new-item").value = ""; // Vide le champ 'new-item'

        // Sauvegarde des éléments dans le localStorage après chaque modification
        saveItems();
    }
}

// Fonction pour supprimer un élément de la liste
function deleteItem(li) {
    // Supprime l'élément du DOM
    li.remove();

    // Supprime également l'élément du localStorage
    saveItems();
}

// Fonction pour mettre à jour l'état de la checkbox dans l'élément de liste
function updateCheckboxState(li, isChecked) {
    li.querySelector("input[type='checkbox']").checked = isChecked;

    // Sauvegarde des éléments dans le localStorage après chaque modification
    saveItems();
}

// Fonction pour augmenter la valeur dans le paragraphe
function increaseValue(p) {
    let value = parseInt(p.innerHTML) || 0;
    value++;
    p.innerHTML = value;

    // Sauvegarde des éléments dans le localStorage après chaque modification
    saveItems();
}

// Fonction pour diminuer la valeur dans le paragraphe et supprimer l'élément si la valeur atteint 0
function decreaseValue(p, li) {
    let value = parseInt(p.innerHTML) || 0;
    if (value > 0) {
        value--;
        p.innerHTML = value;
    }
    if (value === 0) {
        li.remove(); // Supprime l'élément si la valeur est égale à zéro
    }

    // Sauvegarde des éléments dans le localStorage après chaque modification
    saveItems();
}

// Fonction pour sauvegarder les éléments dans le localStorage
function saveItems() {
    // Sauvegarde des éléments dans le localStorage
    let shoppingListItems = Array.from(document.getElementById("shopping-list").children).map(item => {
        let clonedItem = item.cloneNode(true);
        let p = clonedItem.querySelector("p");
        let decreaseButton = clonedItem.querySelector("button");
        decreaseButton.onclick = function() {
            decreaseValue(p, clonedItem);
        };
        let increaseButton = clonedItem.querySelectorAll("button")[1];
        increaseButton.onclick = function() {
            increaseValue(p);
        };

        // Ajoute la propriété checked à l'objet
        let checkbox = clonedItem.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", function() {
            updateCheckboxState(clonedItem, checkbox.checked);
        });

        return {
            outerHTML: clonedItem.outerHTML,
            checked: checkbox.checked,
        };
    });
    localStorage.setItem("shoppingList", JSON.stringify(shoppingListItems));
}

// Fonction pour charger les éléments depuis le localStorage
function loadItems() {
    // Chargement des éléments depuis le localStorage
    let storedItems = localStorage.getItem("shoppingList");

    if (storedItems) {
        let shoppingList = document.getElementById("shopping-list");
        shoppingList.innerHTML = "";
        JSON.parse(storedItems).forEach(item => {
            let tempDiv = document.createElement("div");
            tempDiv.innerHTML = item.outerHTML;
            let clonedItem = tempDiv.firstChild;

            // Gestionnaires d'événements
            let p = clonedItem.querySelector("p");
            let decreaseButton = clonedItem.querySelector("button");
            decreaseButton.onclick = function() {
                decreaseValue(p, clonedItem);
            };
            let increaseButton = clonedItem.querySelectorAll("button")[1];
            increaseButton.onclick = function() {
                increaseValue(p);
            };

            // Ajoute un gestionnaire d'événement pour le bouton de suppression
            let deleteButton = clonedItem.querySelector(".delete-item");
            deleteButton.onclick = function() {
                deleteItem(clonedItem);
            };

            // Applique l'état de la checkbox lors du chargement
            let checkbox = clonedItem.querySelector("input[type='checkbox']");
            checkbox.checked = item.checked;
            checkbox.addEventListener("change", function() {
                updateCheckboxState(clonedItem, checkbox.checked);
            });

            shoppingList.appendChild(clonedItem);
        });
    }
}

// Fonction pour supprimer la liste
function purgeList() {
    // Boîte de dialogue de confirmation
    let isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer la liste ?");

    if (isConfirmed) {
        // Supprime les éléments du localStorage
        localStorage.removeItem("shoppingList");

        // Met à jour l'interface utilisateur
        updateUI();
    }
}

// Fonction pour mettre à jour l'interface utilisateur
function updateUI() {
    // Supprime tous les éléments de la liste dans le DOM
    let shoppingList = document.getElementById("shopping-list");
    shoppingList.innerHTML = "";

    // Affiche un message de confirmation à l'utilisateur
    alert("La liste a été supprimée avec succès !");
} 