// Ajoutez un gestionnaire d'événement pour la touche 'Enter' lorsqu'on tape dans le champ 'new-item'
let input = document.getElementById("new-item");
input.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("add-item").click(); // Simule le clic sur le bouton 'add-item'
    }
});

// Chargement initial des éléments depuis le localStorage lors du chargement de la page
window.onload = function () {
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
        checkbox.addEventListener("change", function () {
            updateCheckboxState(li, checkbox.checked);
        });
        li.appendChild(checkbox);

        // Ajoute un span pour afficher le texte de l'élément
        let span = document.createElement("span");
        span.textContent = newItem;
        span.addEventListener("click", function () {
            // Supprime la fonction toggleDeleteButton
            let deleteButton = li.querySelector(".delete-item");
            deleteButton.classList.add("show-delete-button");
        });
        li.appendChild(span);

        // Ajoute un bouton pour diminuer la valeur
        let decreaseButton = document.createElement("button");
        decreaseButton.innerHTML = "-";
        decreaseButton.onclick = function () {
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
        increaseButton.onclick = function () {
            increaseValue(p);
        };
        li.appendChild(increaseButton);

        // Ajoute un bouton de suppression avec la classe 'delete-item'
        let deleteButton = document.createElement("button");
        deleteButton.innerHTML = "🗑️";
        deleteButton.classList.add("delete-item"); // Ajoute la classe 'delete-item'
        deleteButton.onclick = function () {
            deleteItem(li);
        };
        li.appendChild(deleteButton);

        // Ajoute l'élément à la liste
        shoppingList.appendChild(li);
        document.getElementById("new-item").value = ""; // Vide le champ 'new-item'

        // Ajoute un gestionnaire d'événement au li pour activer l'animation
        li.addEventListener("click", function () {
            // Supprime la fonction toggleDeleteButton
            let deleteButton = li.querySelector(".delete-item");
            deleteButton.classList.add("show-delete-button");
        });

        // Sauvegarde des éléments dans le localStorage après chaque modification
        saveItems();

        // Déplacer les éléments cochés en bas de la liste
        moveCheckedItemsToBottom();
    }
}
// Fonction pour supprimer un élément de la liste
function deleteItem(li) {
    // Supprime l'élément du DOM
    li.remove();

    // Supprime également l'élément du localStorage
    saveItems();

    // Déplacer les éléments cochés en bas de la liste
    moveCheckedItemsToBottom();
}

// Fonction pour afficher ou masquer le bouton de suppression avec une animation
function toggleDeleteButton(li) {
    let deleteButton = li.querySelector(".delete-item");
    deleteButton.classList.toggle("show-delete-button");
    
    // Gérer la visibilité du bouton de suppression pour l'élément cliqué uniquement
    let otherDeleteButtons = document.querySelectorAll(".delete-item:not(.show-delete-button)");
    otherDeleteButtons.forEach(button => {
        button.classList.remove("show-delete-button");
    });
}


// Fonction pour mettre à jour l'état de la checkbox dans l'élément de liste
function updateCheckboxState(li, isChecked) {
    let checkbox = li.querySelector("input[type='checkbox']");
    checkbox.checked = isChecked;

    if (isChecked) {
        li.classList.add("checked");
        // Déplacer l'élément cochée à la fin de la liste
        document.getElementById("shopping-list").appendChild(li);
    } else {
        li.classList.remove("checked");
        // Déplacer l'élément vers le haut de la liste
        document.getElementById("shopping-list").prepend(li);
    }

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

    // Déplacer les éléments cochés en bas de la liste
    moveCheckedItemsToBottom();
}

// Fonction pour diminuer la valeur dans le paragraphe et déplacer les éléments cochés en bas de la liste
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

    // Déplacer les éléments cochés en bas de la liste
    moveCheckedItemsToBottom();
}

// Fonction pour sauvegarder les éléments dans le localStorage
function saveItems() {
    // Sauvegarde des éléments dans le localStorage
    let shoppingListItems = Array.from(document.getElementById("shopping-list").children).map(item => {
        let clonedItem = item.cloneNode(true);
        let p = clonedItem.querySelector("p");
        let decreaseButton = clonedItem.querySelector("button");
        decreaseButton.onclick = function () {
            decreaseValue(p, clonedItem);
        };
        let increaseButton = clonedItem.querySelectorAll("button")[1];
        increaseButton.onclick = function () {
            increaseValue(p);
        };

        // Ajoute la propriété checked à l'objet
        let checkbox = clonedItem.querySelector("input[type='checkbox']");
        checkbox.addEventListener("change", function () {
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
            decreaseButton.onclick = function () {
                decreaseValue(p, clonedItem);
            };
            let increaseButton = clonedItem.querySelectorAll("button")[1];
            increaseButton.onclick = function () {
                increaseValue(p);
            };

            // Ajoute un gestionnaire d'événement pour le bouton de suppression
            let deleteButton = clonedItem.querySelector(".delete-item");
            deleteButton.onclick = function () {
                deleteItem(clonedItem);
            };

            // Applique l'état de la checkbox lors du chargement
            let checkbox = clonedItem.querySelector("input[type='checkbox']");
            checkbox.checked = item.checked;
            checkbox.addEventListener("change", function () {
                updateCheckboxState(clonedItem, checkbox.checked);
            });

            shoppingList.appendChild(clonedItem);
        });
    }
}

// Fonction pour déplacer les éléments cochés en bas de la liste
function moveCheckedItemsToBottom() {
    let shoppingList = document.getElementById("shopping-list");
    let checkedItems = Array.from(shoppingList.getElementsByClassName("checked"));
    checkedItems.forEach(item => {
        shoppingList.appendChild(item);
    });
}
// Fonction pour réinitialiser le titre par défaut
function resetTitle() {
    let defaultTitle = "Ma Liste de Course"; // Mettez le titre par défaut souhaité ici
    document.getElementById('editable-title').textContent = defaultTitle;
    saveTitleToLocalStorage(defaultTitle);
}

// Fonction pour purger la liste
function purgeList() {
    // Boîte de dialogue de confirmation
    let isConfirmed = confirm("Êtes-vous sûr de vouloir supprimer la liste ?");

    if (isConfirmed) {
        // Réinitialiser le titre par défaut
        resetTitle();

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

// Fonction pour activer l'édition du titre
function enableTitleEditing() {
    // Cacher le titre non éditable et afficher le champ de texte et le bouton "Enregistrer"
    document.getElementById('editable-title').style.display = 'none';
    document.getElementById('title-editor-container').style.display = 'flex';

    // Remplir le champ de texte avec le titre actuel
    document.getElementById('title-editor').value = document.getElementById('editable-title').textContent;
}

// Fonction pour enregistrer le titre modifié
function saveTitle() {
    // Récupérer la valeur du champ de texte
    let newTitle = document.getElementById('title-editor').value;

    // Mettre à jour le titre non éditable avec la nouvelle valeur
    document.getElementById('editable-title').textContent = newTitle;

    // Cacher le champ de texte et le bouton "Enregistrer", et afficher le titre non éditable
    document.getElementById('title-editor-container').style.display = 'none';
    document.getElementById('editable-title').style.display = 'block';

    // Sauvegarder le titre dans le localStorage si nécessaire
    saveTitleToLocalStorage(newTitle);
}

// Fonction pour sauvegarder le titre dans le localStorage
function saveTitleToLocalStorage(title) {
    localStorage.setItem("shoppingListTitle", title);
}

// Fonction pour charger le titre depuis le localStorage lors du chargement de la page
function loadTitle() {
    let storedTitle = localStorage.getItem("shoppingListTitle");

    if (storedTitle) {
        document.getElementById('editable-title').textContent = storedTitle;
    }
}

// Appel à la fonction loadTitle pour charger le titre au chargement de la page
loadTitle();
