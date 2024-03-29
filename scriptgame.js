	let game_data;
	let current_room = 0;
	let items_picked = [];
				
		
	function game(data)
	{
				
	game_data = data;
				
	document.getElementById("terminal").innerHTML = "<p><strong>¡Bienvenidos a ENTIerrame!</strong> El juego de terror definitivo.</p>";
	
	document.getElementById("terminal").innerHTML += "<p>Te encuentras en "+game_data.rooms[current_room].name+". ¿Qué quieres hacer?</p>";
	}
				
	
				
				
				
	function terminal_out (info)
				{
	let terminal = document.getElementById("terminal");

	terminal.innerHTML += info;

	terminal.scrollTop = terminal.scrollHeight;
					}
 
function parseCommand(command) {
  console.log("El comando ", command);

  switch (command) {
    case "ver":
      terminal_out("<p>"+game_data.rooms[current_room].description+"</p>");
      break;

    case "ir":
      let doors = "";
      let doors_num = game_data.rooms[current_room].doors.length;
      for (let i = 0; i < doors_num; i++){
        doors += game_data.rooms[current_room].doors[i]+", ";
      }
      terminal_out("<p>Puedes ir a: "+doors+"</p>");
      break;

    case "inventario":
      if (items_picked.length == 0) {
        terminal_out("<p>No tienes ítems en el inventario</p>");
      } else {
        let items_list = "";
        items_picked.forEach(function(item){
          items_list += item+", ";
        });
        terminal_out("<p>Tienes los siguientes ítems en el inventario: "+items_list+"</p>");
      }
      break;

  case "coger":
			let items = "";
			let items_num = game_data.rooms[current_room].items.length;
			for (let i = 0; i < items_num; i++) {
				items += game_data.rooms[current_room].items[i]+" ";
			}
			terminal_out("<p>Los items que hay en la habitación son: "+items+"</p>");
			break;
			
		case "inventario":
			let inventory = "";
			let items_inventory = items_picked.length;
			for (let i = 0; i < items_inventory; i++) {
				inventory += items_picked[i]+" ";
			}
			terminal_out("<p>En tu inventario hay: "+inventory+"</p>");
			
			break;

		default:
			terminal_out("<p><strong>Error</strong>: "+command+" commando no encontrado</p>");
	}
}

function getRoomNumber (room)
{
	for (let i = 0; i < game_data.rooms.length; i++){
		if (game_data.rooms[i].id == room){
			return i;
		}
	}

	return -1;
}

	function getDoorNumber (door)
		{
		for (let i = 0; i < game_data.doors.length; i++){
			if (game_data.doors[i].id == door){
				return i;
			}
		}

	return -1;
}
function getItemNumber(item) 
{
	for (let i = 0; i < game_data.items.length; i++) {
		if (game_data.items[i].id == item) {
			return i;
		}
	}
	return -1;
}



function parseInstruction (instruction) {
  console.log("La instrucción ", instruction);

  switch (instruction[0]){
    case "ver":
      break;

    case "ir":
      if (instruction.length !== 2) {
        console.log("Instrucción mal formada");
        return;
      }

      let roomName = instruction[1];
      let roomNum = getRoomNumber(roomName);
      if (roomNum < 0) {
        console.log("Habitación errónea");
        return;
      }

      current_room = roomNum;
      terminal_out("<p>Te encuentras en "+game_data.rooms[current_room].name+". ¿Qué quieres hacer?</p>");
      break;

		case "coger":
			game_data.rooms[current_room].items.forEach(function(item) {
				if (item == instruction[1]) {
					let item_num = game_data.rooms[current_room].items.indexOf(item);
					if (item_num < 0) {
						console.log("Error al borrar el item de la habitación");
						return;
					}
				if (game_data.items[getItemNumber(item)].pickable == false) {
						terminal_out("<p>No se puede obtener <strong>"+item+"</strong></p>");
						return;
					}
			game_data.rooms[current_room].items.forEach(function(item) {
				if (item == instruction[1]) {
						items_picked.push(game_data.rooms[current_room].items.splice(item_num, 1));
					}
				});
						terminal_out("<p><strong>"+item+"</strong> se añadió a tu inventario </p>");
						return; 
					}
					else {
						terminal_out("<p>Ya tienes el item en el inventario o no esta en esta habitación</p>");
						return; 
					}
				});
			break;
			
		case "inventario":
			let item_inventory = getItemNumber(instruction[1]);
			if (item_inventory < 0) {
				terminal_out("<p><strong>"+instruction[1]+"</strong> no esta dentro de tu inventario</p>");
				return;
			}
			terminal_out("<p><strong>"+instruction[1]+":</strong> " +game_data.items[item_inventory].description+"</p>");
			break;
 
		default:
			terminal_out("<p><strong>Error</strong>: "+instruction[0]+" commando no encontrado</p>");
	}
}

		function readAction ()
		{
	let instruction = document.getElementById("commands").value;
	let instruction_trim = instruction.trim();

	let data = instruction_trim.split(" ");

	if (data.length == 0 || instruction_trim == ""){
		terminal_out("<p><strong>Error</strong>: escribe una instrucción</p>");
		return;
	}

	if (data.length == 1){
		parseCommand(data[0]);
	}
	else{
		parseInstruction(data);
	}

}

	fetch("https://AleixTRP.github.io/game.json")
		.then(response => response.json())
		.then(data => game(data));